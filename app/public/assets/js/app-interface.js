(() => {
    'use strict';

    const cookieManager = new CookieManager();
    const ctPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const setCookie = function (theme) {
        let expires = new Date();
        expires.setTime(365);
        cookieManager.setCookie({
            name: 'color-theme',
            value: theme,
            expires: expires
        })

        return theme;
    }

    const setTheme = function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    const cookieValue = cookieManager.getCookie('color-theme');

    if (!cookieValue) {
        setTheme(setCookie(ctPref));
    } else {
        setTheme(cookieValue);
    }

    document.querySelectorAll('#btn-theme-switch').forEach((element) => {
        element.checked = cookieValue == 'dark' ? true : false;

        element.addEventListener('change', (event) => {
            if (event.target.checked) {
                setTheme(setCookie('dark'));
                return;
            }

            setTheme(setCookie('light'));
        })
    });

    const swiper = new Swiper('.swiper', {
        direction: 'horizontal',
        loop: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
})();

