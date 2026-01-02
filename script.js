document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. AUTO-HIGHLIGHT ACTIVE PAGE --- */
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "" || currentPath === "/") {
        currentPath = "index.html";
    }

    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    /* --- 2. MOBILE MENU & SCROLL LOCK --- */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu if a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }


    /* --- 4. LIGHTBOX LOGIC --- */
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbVidLocal = document.getElementById('lightbox-video-local');
    const lbVidYT = document.getElementById('lightbox-video-yt');
    const triggers = document.querySelectorAll('.lb-trigger');
    const closeBtn = document.querySelector('.close-lightbox');

    if (lightbox && triggers.length > 0) {
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const type = trigger.getAttribute('data-type');
                const src = trigger.getAttribute('data-src');

                lbImg.style.display = 'none';
                lbVidLocal.style.display = 'none';
                lbVidYT.style.display = 'none';
                lbVidLocal.src = "";
                lbVidYT.src = "";

                if (type === 'image') {
                    lbImg.src = src;
                    lbImg.style.display = 'block';
                } else if (type === 'video') {
                    if (src.includes('youtube.com') || src.includes('youtu.be')) {
                        lbVidYT.src = src;
                        lbVidYT.style.display = 'block';
                    } else {
                        lbVidLocal.src = src;
                        lbVidLocal.style.display = 'block';
                    }
                }
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            if(lbVidLocal) lbVidLocal.pause();
            lbVidLocal.src = ""; 
            lbVidYT.src = "";
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});


function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(category)) btn.classList.add('active');
    });

    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    });
}