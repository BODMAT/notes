import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

var swiper = new Swiper('.swiper', {
    allowTouchMove: isMobileViewport,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    slidesPerView: 1,
    autoHeight: true,
});

// Для отслеживания висоты
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            swiper.update();
        }
    });
});
observer.observe(document.querySelector('.swiper-wrapper'), { childList: true, subtree: true });

const noteEls = document.querySelectorAll('.main__note');
noteEls.forEach((noteEl) => {
    noteEl.addEventListener('click', () => {
        swiper.update();
    });
});