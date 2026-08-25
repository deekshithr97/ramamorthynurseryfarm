const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Image Slider Functionality
function changeSlide(button, direction) {
    const slider = button.closest('.product-image-slider');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    let currentSlide = 0;
    
    // Find current active slide
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentSlide = index;
        }
    });
    
    // Remove active class from current slide and dot
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Calculate new slide index
    currentSlide += direction;
    
    // Handle wrapping
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    // Add active class to new slide and dot
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function currentSlide(dot, slideNumber) {
    const slider = dot.closest('.product-image-slider');
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dotEl => dotEl.classList.remove('active'));
    
    // Add active class to selected slide and dot
    slides[slideNumber - 1].classList.add('active');
    dots[slideNumber - 1].classList.add('active');
}

// Auto-slide functionality (optional)
function initAutoSlide() {
    const sliders = document.querySelectorAll('.product-image-slider');
    
    sliders.forEach(slider => {
        let autoSlideInterval;
        
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                const nextBtn = slider.querySelector('.next-btn');
                changeSlide(nextBtn, 1);
            }, 4000); // Change slide every 4 seconds
        };
        
        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };
        
        // Start auto-slide
        startAutoSlide();
        
        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Pause auto-slide on touch (mobile)
        slider.addEventListener('touchstart', stopAutoSlide);
        slider.addEventListener('touchend', () => {
            setTimeout(startAutoSlide, 2000); // Resume after 2 seconds
        });
    });
}

// Initialize auto-slide when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initAutoSlide();
});
