const nombreCache = 'apv-v1';
const archivos  = [
    '/',
    '/index.html',
    '/error.html',
    '/css/bootstrap.css',
    '/css/styles.css',
    '/js/app.js',
    '/js/apv.js'
];

//Cuando se instala el service worker
self.addEventListener('install', e => {
    console.log('Instalando el Service Worker');

    e.waitUntil(
        caches.open(nombreCache)
            .then(cache => {
                console.log('cacheando');
                cache.addAll(archivos)
            })
    )
});

//Activar el Service Worker
self.addEventListener('activate', e => {
    console.log('Service Worker Activado');

    e.waitUntil(
        caches.keys()
            .then(keys => {
                //console.log(keys);
                
                return Promise.all(
                    keys.filter(key => key !== nombreCache)
                    //Borra las versiones anteriores
                        .map(key => caches.delete(key)) 
                )
            })
    )
});

//Evento fetch para descargar archivos estaticos
self.addEventListener('fetch', e => {
    console.log('Fetch...', e);

    e.respondWith(
        caches.match(e.request)
            .then(respuestaCache => {
                return respuestaCache || fetch(e.request);
            })
            .catch( () => caches.match('/error.html'))
    );
});