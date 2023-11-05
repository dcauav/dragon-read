"use strict";

class CookieManager {
    constructor() {
        this._domain = window.location.hostname;
    }

    setCookie(data = {
        name: '',
        value: '',
        expires: '',
        path: '',
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    }) {
        try {
            if (!data.path) {
                data.path = "/";
            }

            let date = new Date();

            date.setTime(date.getTime() + (data.expires * 24 * 60 * 60 * 1000));

            document.cookie = `${encodeURIComponent(data.name)}=${encodeURIComponent(data.value)}; expires=${date.toUTCString()}; domain=${this._domain}; path=${data.path}; ${data.secure ? `secure=${data.secure};` : ''} ${data.httpOnly ? `httponly=${data.httpOnly};` : ''} ${data.sameSite ? `samesite=${data.sameSite};` : ''}`;
        } catch (error) {
            console.error(`Falha ao gerar cookie (${data.name})`, error);
        }
    }

    getCookie(name) {
        try {
            const escape = function(str) { 
                return str.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); 
            }
            
            const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));

            return match ? match[1] : null;
        } catch (error) {
            console.error(`Falha ao consultar cookie (${name})`, error);
        }
    }
}