!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(1);self.EasyPwaSW=new r.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this.sw=self,this.initSkipWaiting()}initSkipWaiting(){this.sw.addEventListener("message",e=>{"skipWaiting"===e.data&&skipWaiting()})}}}]);
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache-v1').then((cache) => {
        console.log('Сайт кеширован');
        return cache.addAll([
          '/',
          '/index.html',
          '/register.html',
          '/assets/css/styles.css',
          '/assets/js/script.js',
          '/assets/images/icon-192x192.png',
          '/assets/images/icon-512x512.png',
          '/manifest.json',  // Если файл манифеста должен быть кеширован
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;  // Возвращаем кешированный ответ
        }
        return fetch(event.request);  // Если нет в кеше — запрашиваем сеть
      })
    );
  });
  
  // Активируем сервис-воркер
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['my-cache-v1'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);  // Удаляем устаревшие кеши
            }
          })
        );
      })
    );
  });
  
  // Для пропуска ожидания в случае обновления сервис-воркера
  self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
      self.skipWaiting();  // Пропустить ожидание
    }
  });
  