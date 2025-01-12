!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(1);self.EasyPwaSW=new r.default},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(){this.sw=self,this.initSkipWaiting()}initSkipWaiting(){this.sw.addEventListener("message",e=>{"skipWaiting"===e.data&&skipWaiting()})}}}]);
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache-v1').then((cache) => {
      console.log('Сайт кеширован');
      return Promise.all([
        cache.add('/'),
        cache.add('/index.html'),
        cache.add('/register.html'),
        cache.add('/assets/css/styles.css'),
        cache.add('/assets/js/script.js'),
        cache.add('/assets/images/icon-192x192.png'),
        cache.add('/assets/images/icon-512x512.png'),
        cache.add('/manifest.json'),
        cache.add('/offline.html')  // Добавляем страницу оффлайн
      ]).catch((err) => {
        console.error('Ошибка при кешировании:', err);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Если ответ удачный, возвращаем его
        if (response && response.status === 200) {
          return response;
        }
        // Если ошибка при запросе, проверяем кеш
        return caches.match(event.request).then((cachedResponse) => {
          // Если в кеше есть ответ, возвращаем его
          if (cachedResponse) {
            return cachedResponse;
          }
          // Если нет кешированного ответа, проверяем на запросы к страницам
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');  // Возвращаем страницу оффлайн
          }
          // Если нет ответа и это не запрос страницы, возвращаем ошибку
          return Promise.reject('No cached response or network response');
        });
      })
      .catch((error) => {
        console.error('Ошибка сети:', error);
        // В случае ошибки сети возвращаем кешированную страницу оффлайн
        return caches.match('/offline.html');
      })
  );
});

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

