/* contact.js */
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        const checkboxes = document.querySelectorAll('.svc, #bleachAddon');
        const totalDisp = document.getElementById('totalPrice');
        const depositDisp = document.getElementById('depositPrice');
        const dateInput = document.getElementById('bookDate');
        const submitBtn = document.getElementById('submitBtn');

        // 1. Set Minimum Date
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // 2. The Calculation Function
        const calculateTotal = () => {
            let total = 0;
            checkboxes.forEach(box => {
                if (box.checked) {
                    total += parseInt(box.getAttribute('data-price')) || 0;
                }
            });

            const deposit = total * 0.3;

            // Update the UI Spans
            if (totalDisp) totalDisp.innerText = `$${total.toLocaleString()}`;
            if (depositDisp) depositDisp.innerText = `$${deposit.toLocaleString()}`;
        };

        // Listen for changes to update the UI immediately
        checkboxes.forEach(box => box.addEventListener('change', calculateTotal));

        // 3. The Submission Function
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // Basic validation
            const name = document.getElementById('custName').value;
            const phone = document.getElementById('custPhone').value;
            let selected = [];
            checkboxes.forEach(box => { if(box.checked) selected.push(box.value); });

            if(selected.length === 0) {
                alert("Please select at least one service.");
                return;
            }

            // UI feedback
            if (submitBtn) {
                submitBtn.classList.add('is-loading'); 
                submitBtn.disabled = true;
            }

            // Create the data object from the form
            const formData = new FormData(this);

            // MANUALLY ADD DATA WITHOUT HIDDEN INPUTS
            // This pulls the text from your <span> tags and adds them to the email
            formData.append("Total Estimate", totalDisp.innerText);
            formData.append("Required Deposit", depositDisp.innerText);

            // Send to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    // Success: Open WhatsApp
                    const date = dateInput.value;
                    const finalTotal = totalDisp.innerText;
                    const finalDeposit = depositDisp.innerText;
                    
                    const msg = `*New Booking Request*%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Date:* ${date}%0A*Services:* ${selected.join(', ')}%0A*Total:* ${finalTotal}%0A*Deposit Due:* ${finalDeposit}`;
                    
                    window.open(`https://wa.me/18767715258?text=${msg}`, '_blank');
                    window.location.href = "thanks.html";
                } else {
                    alert("Submission failed. Please try again.");
                    submitBtn.classList.remove('is-loading');
                    submitBtn.disabled = false;
                }
            }).catch(error => {
                alert("Error: Check your connection.");
                submitBtn.classList.remove('is-loading');
                submitBtn.disabled = false;
            });
        });
    }
});