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
  
