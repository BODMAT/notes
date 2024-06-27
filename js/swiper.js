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

    limitRotation: true,
    slideShadows: true,
    effect: 'flip',
});

// Создаем мутационный наблюдатель для отслеживания изменений в DOM-элементах слайдов
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.target.closest('.swiper-slide')) {
            updateSwiper();
        }
    });
});

// Настраиваем мутационный наблюдатель для отслеживания изменений в DOM-элементах слайдов
observer.observe(document.querySelector('.swiper-wrapper'), {
    childList: true,
    subtree: true
});

// Отслеживаем изменения размеров элементов, вызванные изменением CSS-свойств
var resizeObserver = new ResizeObserver(function () {
    updateSwiper();
});

// Наблюдаем за изменениями размеров элементов
var elements = document.querySelectorAll('.swiper-slide, .textarea, .ellipsis');
elements.forEach(function (element) {
    resizeObserver.observe(element);
});

function updateSwiper() {
    // Обновляем Swiper
    swiper.update();
}
