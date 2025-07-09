document.addEventListener('DOMContentLoaded', () => {
    const weatherResult = document.getElementById('weatherResult');
    const errorMsg = document.getElementById('errorMsg');
    const toggle = document.getElementById('tempToggle');

    // Show last saved result if available
    const last = localStorage.getItem('lastWeather');
    if (last) renderWeather(JSON.parse(last));

    // Temperature toggle listener
    toggle.addEventListener('change', () => {
        const last = localStorage.getItem('lastWeather');
        if (last) renderWeather(JSON.parse(last));
    });

    // Button click handler
    document.getElementById('getWeatherBtn').addEventListener('click', () => {
        weatherResult.innerHTML = '<div class="loader"></div>';
        errorMsg.textContent = '';

        if (!navigator.geolocation) {
            errorMsg.textContent = 'Geolocation is not supported by your browser.';
            weatherResult.innerHTML = '';
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error);
    });

    function success(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const apiKey = 'be1ec329c72649d8ba794031250907';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Weather data not found.');
                return response.json();
            })
            .then(data => {
                localStorage.setItem('lastWeather', JSON.stringify(data));
                renderWeather(data);
            })
            .catch(() => {
                weatherResult.innerHTML = '';
                errorMsg.textContent = 'Failed to fetch weather data.';
            });
    }

    function error(err) {
        weatherResult.innerHTML = '';
        if (err.code === 1) {
            errorMsg.textContent = 'Location permission denied.';
        } else {
            errorMsg.textContent = 'Unable to retrieve your location.';
        }
    }

    function formatTemp(c, f) {
        const isFahrenheit = toggle.checked;
        return isFahrenheit ? `${Math.round(f)}°F` : `${Math.round(c)}°C`;
    }

    function renderWeather(data) {
        weatherResult.innerHTML = `
            <div class="weather-info">
                <div class="weather-main">
                    <img src="https:${data.current.condition.icon}" alt="icon" class="weather-icon">
                    <span class="temp">${formatTemp(data.current.temp_c, data.current.temp_f)}</span>
                </div>
                <div class="city">${data.location.name}</div>
                <div class="condition">${data.current.condition.text}</div>
            </div>
        `;
    }
});
