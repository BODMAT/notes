import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

var swiper = new Swiper('.swiper', {
    allowTouchMove: isMobileViewport,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});