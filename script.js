document.addEventListener('DOMContentLoaded', function() {

    // --- Feature 1: Image Carousel for Hero Section ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval = null;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Show the first slide initially
        showSlide(currentSlide);

        // Change slide every 3 seconds
        slideInterval = setInterval(nextSlide, 3000);

        // Pause on hover (optional)
        slides.forEach(slide => {
            slide.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slide.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 3000);
            });
        });
    }

    // --- Feature 2: "Back to Top" Button (robust and accessible) ---
    const backToTopButton = document.getElementById("back-to-top-btn");

    function setBackToTopVisibility(visible) {
        if (!backToTopButton) return;
        backToTopButton.classList.toggle('visible', visible);
        backToTopButton.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    if (backToTopButton) {
        // Initial state
        setBackToTopVisibility(false);

        // Throttled scroll handler (lightweight)
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    const sc = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                    setBackToTopVisibility(sc > 150);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });

        backToTopButton.addEventListener("click", function(event) {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Also make the footer "Back to top" area clickable (many pages use that)
    document.querySelectorAll('.fot-panel, .foot-panel .back-to-top, [data-back-to-top]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- Feature 3: Interactive "Add to Cart" Buttons with toast (instead of alert) ---
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // create toast container (reused)
    function showCartToast(message) {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.className = 'cart-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        // show
        toast.classList.add('visible');
        // hide after 2s
        clearTimeout(toast._hideTimeout);
        toast._hideTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 2000);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // find sensible title: prefer data-title, then closest .box-content h2 or .heading
            const box = button.closest('.box-content') || button.closest('.box') || document;
            const productTitle =
                button.getAttribute('data-title') ||
                box?.querySelector('h2')?.innerText?.trim() ||
                box?.querySelector('.heading')?.innerText?.trim() ||
                'Product';
            // show toast
            showCartToast(`${productTitle} added to cart`);
            // small visual feedback on the button
            button.classList.add('added');
            setTimeout(() => button.classList.remove('added'), 500);
        });
    });

    // --- Hero message: slide in from right then slide out after 3s ---
    const heroMsg = document.querySelector('.hero-msg');
    if (heroMsg) {
        // ensure start state (off-screen to the right)
        heroMsg.classList.remove('animate-show', 'animate-hide');

        // Force reflow so the class addition triggers the transition
        void heroMsg.offsetWidth;

        // show (slide in)
        heroMsg.classList.add('animate-show');

        // after 3 seconds, slide out to the right
        setTimeout(() => {
            heroMsg.classList.remove('animate-show');
            heroMsg.classList.add('animate-hide');
        }, 7000);
    }

});