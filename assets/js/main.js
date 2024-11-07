// bouncy header
window.addEventListener('scroll', () => {
    const header = document.getElementsByClassName('main-header')[0];
    header.classList.toggle('scrollto', window.scrollY > 50);
});

// back to top
const calcScrollValue = () => {
    const scrollProgress = document.getElementById("btt-btn");
    const progressValue = document.getElementById("progress-value");
    const pos = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = Math.round((pos * 100) / calcHeight);

    // Toggle the visibility of the scroll progress button
    if (pos > 100) {
        scrollProgress.style.display = "grid";
        scrollProgress.classList.add("back"); // Add class when scrolled past threshold
    } else {
        scrollProgress.classList.remove("back"); // Remove class when scrolled back up
    }

    // Add event listener for the click event
    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;
    });

    // Update the background gradient based on scroll value
    scrollProgress.style.background = `conic-gradient(#ffc224 ${scrollValue}%, #5751e1b3 ${scrollValue}%)`;
};

// Attach event listeners
window.onscroll = calcScrollValue;
window.onload = calcScrollValue;

// faqs
const detailsElements = document.querySelectorAll("details");
const summaryElements = document.querySelectorAll("summary");
summaryElements.forEach((summary, index) => {
    summary.addEventListener("click", () => {
        detailsElements.forEach((details, i) => {
            if (i !== index) {
                details.open = false;
            }
        });
        summaryElements.forEach((s, i) => {
            if (i !== index) {
                s.classList.remove("actives");
            }
        });
        summary.classList.toggle("actives");
    });
});


// logo slider
const marqueeSlider = document.querySelector('.marquee-slider');

if (marqueeSlider) {
    marqueeSlider.append(...Array.from(marqueeSlider.children).map(image => image.cloneNode(true)));

    marqueeSlider.addEventListener('mouseover', () => marqueeSlider.style.animationPlayState = 'paused');
    marqueeSlider.addEventListener('mouseout', () => marqueeSlider.style.animationPlayState = 'running');
}

// course tabs
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("coursesContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tabsLink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" tabsActive", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " tabsActive";
}

// Automatically open the first tab
window.onload = function () {
    var firstTab = document.querySelector('.tabsLink');
    if (firstTab) {
        firstTab.click();
    }
};

// Handle the number input buttons using event delegation
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('increase') || e.target.classList.contains('decrease')) {
        const input = e.target.parentElement.querySelector('input[type="number"]');
        const action = e.target.classList.contains('increase') ? 1 : -1;

        // Ensure the value respects the min and max attributes
        input.value = Math.max(input.min, Math.min(input.max, parseInt(input.value) + action));
    }
});

// coupon add js
document.querySelector('.apply-cpn')?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.coupon-form')?.classList.toggle('fill-cpn');
});


// custom slider code
function accountSlider(slider) {
    slider.forEach(config => {
        let {
            className,
            slidesPerView,
            spaceBetween,
            speed
        } = config;
        const defaultSlidesPerView = slidesPerView.default || 2; // Default slidesPerView if not provided
        const defaultSpaceBetween = spaceBetween || 20; // Default spaceBetween if not provided

        const sliderParent = document.querySelector('.' + className);
        if (!sliderParent) return; // Check if sliderParent is found, exit if not found

        const sliderWrap = sliderParent.querySelector('.slider-wrap');
        if (!sliderWrap) return; // Check if sliderWrap is found, exit if not found

        const slideCards = sliderWrap.querySelectorAll('.slide-card');
        if (!slideCards || slideCards.length === 0) return; // Check if slideCards is found and not empty, exit if not found

        let currentIndex = 0;
        let slideWidth;
        let autoplayInterval; // Variable to store autoplay interval

        function updateSlider() {
            // Determine the appropriate slidesPerView based on window width
            let currentSlidesPerView;
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                currentSlidesPerView = slidesPerView.tablet;
            } else if (window.innerWidth <= 600) {
                currentSlidesPerView = slidesPerView.mobile;
            } else {
                currentSlidesPerView = defaultSlidesPerView;
            }

            // Calculate the width of the container
            const containerWidth = sliderWrap.offsetWidth;

            // Calculate the width of each slide based on the formula
            slideWidth = (containerWidth / currentSlidesPerView) - ((currentSlidesPerView - 1) * defaultSpaceBetween / currentSlidesPerView);

            // Set the width and marginRight for each slide
            for (let i = 0; i < slideCards.length; i++) {
                slideCards[i].style.width = slideWidth + 'px';
                slideCards[i].style.marginRight = defaultSpaceBetween + 'px';
            }
        }

        function goToNextSlide() {
            currentIndex = (currentIndex + 1) % slideCards.length;
            updateSliderPosition();
        }

        function updateSliderPosition() {
            const translateValue = -currentIndex * (slideWidth + defaultSpaceBetween);
            sliderWrap.style.transition = `transform ${speed}ms ease-in-out`; // Set transition for smooth sliding
            sliderWrap.style.transform = `translateX(${translateValue}px)`;
        }

        // Function to start autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(goToNextSlide, speed + 1500); // Add slide speed to autoplay interval
        }

        // Function to stop autoplay
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Initial calculation of slide size
        updateSlider();

        // Start autoplay when the slider is initialized
        startAutoplay();

        // Recalculate slide size when the window is resized
        window.addEventListener('resize', updateSlider);

        // Reset slider to first slide after transition ends for infinite loop
        sliderWrap.addEventListener('transitionend', () => {
            if (currentIndex + defaultSlidesPerView >= slideCards.length) {
                currentIndex = 0;
                updateSliderPosition();
            } else if (currentIndex === 0) {
                updateSliderPosition();
            }
        });

        // If buttons are present, attach click events to navigation buttons
        const prevButton = sliderParent.querySelector('.button-prev');
        const nextButton = sliderParent.querySelector('.button-next');
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slideCards.length) % slideCards.length;
                updateSliderPosition();
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slideCards.length;
                updateSliderPosition();
            });
        }
    });
}

// Usage
accountSlider([{
    className: 'logo-sliders',
    slidesPerView: {
        default: 6,
        tablet: 3,
        mobile: 1
    },
    spaceBetween: 30,
    speed: 500
},
{
    className: 'testimonial-slides',
    slidesPerView: {
        default: 3,
        tablet: 2,
        mobile: 1
    },
    spaceBetween: 30,
    speed: 1000
}
]);

// mobile menu settings
let hasCloned = false;

const toggleMenu = () => {
    const isMobileView = window.matchMedia('(max-width: 1023px)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 600px)').matches;
    const menu = document.querySelector('.menu');

    if (!menu || !isMobileView) return;

    menu.classList.toggle('mobile_menu');

    if (!hasCloned) {
        cloneElements(menu);
        hasCloned = true;
    }

    if (isSmallScreen) cloneBadges(menu);
};

const cloneElements = (menu) => {
    const logo = document.querySelector('.logo');
    const dropDownSearch = document.querySelector('.dropDown_search');

    if (logo) menu.insertBefore(logo.cloneNode(true), menu.firstChild);

    if (dropDownSearch) {
        const clonedDropDownSearch = dropDownSearch.cloneNode(true);
        clonedDropDownSearch.classList.add('cloned_search');
        const firstLogo = menu.querySelector('.logo');
        menu.insertBefore(clonedDropDownSearch, firstLogo ? firstLogo.nextSibling : menu.firstChild);
    }
};

const closeMenu = () => {
    const isMobileView = window.matchMedia('(max-width: 1023px)').matches;
    if (!isMobileView) return;

    const menu = document.querySelector('.menu');
    menu.classList.remove('mobile_menu');
};

const cloneBadges = (menu) => {
    const isSmallScreen = window.matchMedia('(max-width: 600px)').matches;
    if (!isSmallScreen) return;

    let cartsDiv = menu.querySelector('.carts');
    if (!cartsDiv) {
        cartsDiv = document.createElement('div');
        cartsDiv.classList.add('carts');
        const navElement = menu.querySelector('nav');
        navElement?.insertAdjacentElement('afterend', cartsDiv);
    }

    cartsDiv.innerHTML = '';

    document.querySelectorAll('.badge').forEach((badge, index) => {
        if (index < 2) cartsDiv.appendChild(badge.cloneNode(true));
    });
};

const dropdowns = document.querySelectorAll('.dropdown');

function toggleDropdown(e) {
    const svgIcon = e.target.closest('svg');
    if (!svgIcon) return;

    const parentOfTarget = svgIcon.closest('.dropdown'); // Ensure it's the direct parent

    dropdowns.forEach((dropdown) => {
        if (dropdown !== parentOfTarget && !dropdown.contains(parentOfTarget)) {
            dropdown.classList.remove('mobile_dropdown');
        }
    });

    if (parentOfTarget) {
        parentOfTarget.classList.toggle('mobile_dropdown');
    }
}

dropdowns.forEach((dropdown) => {
    dropdown.querySelector('svg').addEventListener("click", toggleDropdown);
});

document.querySelector('.menuToggler').addEventListener('click', toggleMenu);
document.querySelector('.menuClose').addEventListener('click', closeMenu);

window.addEventListener('resize', () => {
    const menu = document.querySelector('.menu');
    cloneBadges(menu); // Handles the condition check internally
});

// Run on page load
(() => {
    cloneBadges(document.querySelector('.menu'));
})();