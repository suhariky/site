// Координаты правильного ответа (пример: Эйфелева башня)
const answer = { lat: 48.8588443, lng: 2.2943506 };

let guess = null;
let marker = null;

// Инициализация карты Leaflet
const map = L.map('leaflet-map').setView([20, 0], 2); // Центрируем на весь мир
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', function(e) {
    guess = e.latlng;
    if (marker) {
        marker.setLatLng(guess);
    } else {
        marker = L.marker(guess).addTo(map);
    }
});

document.getElementById('guess-btn').addEventListener('click', function() {
    if (!guess) {
        document.getElementById('result').textContent = 'Сначала выберите точку на карте!';
        return;
    }
    // Скрываем overlay с названием места
    var overlay = document.getElementById('streetview-overlay');
    if (overlay) overlay.classList.add('hide');
    // Вычисляем расстояние между точками (гаверсинус)
    const R = 6371; // радиус Земли в км
    const dLat = (guess.lat - answer.lat) * Math.PI / 180;
    const dLng = (guess.lng - answer.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(answer.lat * Math.PI / 180) * Math.cos(guess.lat * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = Math.round(R * c);
    document.getElementById('result').textContent = `Вы были в ${distance} км от правильного места!`;
}); 