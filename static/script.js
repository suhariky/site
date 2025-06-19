const places = [
  {
    name: "Эйфелева башня",
    lat: 48.8588443,
    lng: 2.2943506,
    streetview: "https://www.google.com/maps/embed?pb=!4v1718800000000!6m8!1m7!1sCAoSLEFGMVFpcE1wQ2Z3b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6!2m2!1d48.8588443!2d2.2943506!3f0!4f0!5f0.7820865974627469"
  },
  {
    name: "Статуя Свободы",
    lat: 40.6892494,
    lng: -74.0445004,
    streetview: "https://www.google.com/maps/embed?pb=!4v1718800000001!6m8!1m7!1sCAoSLEFGMVFpcE1wQ2Z3b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6!2m2!1d40.6892494!2d-74.0445004!3f0!4f0!5f0.7820865974627469"
  },
  {
    name: "Сиднейский оперный театр",
    lat: -33.8567844,
    lng: 151.2152967,
    streetview: "https://www.google.com/maps/embed?pb=!4v1718800000002!6m8!1m7!1sCAoSLEFGMVFpcE1wQ2Z3b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6!2m2!1d-33.8567844!2d151.2152967!3f0!4f0!5f0.7820865974627469"
  },
  {
    name: "Тадж-Махал",
    lat: 27.1750151,
    lng: 78.0421552,
    streetview: "https://www.google.com/maps/embed?pb=!4v1718800000003!6m8!1m7!1sCAoSLEFGMVFpcE1wQ2Z3b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6!2m2!1d27.1750151!2d78.0421552!3f0!4f0!5f0.7820865974627469"
  },
  {
    name: "Великая китайская стена",
    lat: 40.4319077,
    lng: 116.5703749,
    streetview: "https://www.google.com/maps/embed?pb=!4v1718800000004!6m8!1m7!1sCAoSLEFGMVFpcE1wQ2Z3b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6b2Z6!2m2!1d40.4319077!2d116.5703749!3f0!4f0!5f0.7820865974627469"
  }
];

let answer = null;
let guess = null;
let marker = null;

function pickRandomPlace() {
  const idx = Math.floor(Math.random() * places.length);
  answer = places[idx];
  // Меняем streetview
  document.getElementById('streetview').src = answer.streetview;
  // Сбрасываем overlay
  const overlay = document.getElementById('streetview-overlay');
  if (overlay) overlay.classList.remove('hide');
  // Сбрасываем маркер и результат
  if (marker) { marker.remove(); marker = null; }
  guess = null;
  document.getElementById('result').textContent = '';
}

// Инициализация карты Leaflet
const map = L.map('leaflet-map').setView([20, 0], 2);
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

// При загрузке страницы выбираем случайное место
window.addEventListener('DOMContentLoaded', pickRandomPlace); 