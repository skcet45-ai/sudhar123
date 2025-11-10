const API_BASE_URL = 'http://localhost:5000';
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';

let charts = {};
let sensorHistory = {
    temperature: [],
    humidity: [],
    soilMoisture: [],
    timestamps: []
};
let previousValues = {
    temperature: null,
    humidity: null,
    soilMoisture: null
};
let historicalData = [];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeApp();
    setupNavigationListeners();
    setupFormListeners();
    setupTableListeners();
    initializeCharts();
    startDataFetching();
    updateDateTime();
    getLocation();

    setInterval(updateDateTime, 1000);
    setInterval(() => fetchSensorData(), 5000);
    setInterval(() => updateAllCharts(), 30000);
});

function initializeApp() {
    loadHistoricalData();
}

function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            switchPage(page);

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function switchPage(pageName) {
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    document.getElementById('pageTitle').textContent = pageTitle;

    if (pageName === 'weather') {
        fetchWeatherData();
    }

    lucide.createIcons();
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
}

async function getLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        document.getElementById('locationText').textContent = `${data.city}, ${data.country_name}`;
    } catch (error) {
        document.getElementById('locationText').textContent = 'Location unavailable';
    }
}

function startDataFetching() {
    fetchSensorData();
}

async function fetchSensorData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sensor-data`);
        const data = await response.json();

        updateMetricCards(data);
        updateSensorHistory(data);
        updateCharts();

        saveToHistory(data);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        showMockData();
    }
}

function showMockData() {
    const mockData = {
        temperature: (20 + Math.random() * 10).toFixed(1),
        humidity: (50 + Math.random() * 30).toFixed(1),
        soil_moisture: (40 + Math.random() * 30).toFixed(1),
        timestamp: new Date().toISOString()
    };

    updateMetricCards(mockData);
    updateSensorHistory(mockData);
    updateCharts();
}

function updateMetricCards(data) {
    updateMetricValue('tempValue', data.temperature, '°C', 'tempTrend');
    updateMetricValue('humidityValue', data.humidity, '%', 'humidityTrend');
    updateMetricValue('soilValue', data.soil_moisture, '%', 'soilTrend');

    document.getElementById('weatherValue').textContent = 'Clear';
}

function updateMetricValue(elementId, value, unit, trendId) {
    const element = document.getElementById(elementId);
    const trendElement = document.getElementById(trendId);
    const numValue = parseFloat(value);

    element.textContent = numValue.toFixed(1);

    const key = elementId.replace('Value', '');
    const previousValue = previousValues[key];

    if (previousValue !== null) {
        if (numValue > previousValue) {
            trendElement.setAttribute('data-lucide', 'arrow-up');
            trendElement.classList.add('up');
            trendElement.classList.remove('down');
        } else if (numValue < previousValue) {
            trendElement.setAttribute('data-lucide', 'arrow-down');
            trendElement.classList.add('down');
            trendElement.classList.remove('up');
        }
    }

    previousValues[key] = numValue;
    lucide.createIcons();
}

function updateSensorHistory(data) {
    const maxPoints = 20;

    sensorHistory.temperature.push(parseFloat(data.temperature));
    sensorHistory.humidity.push(parseFloat(data.humidity));
    sensorHistory.soilMoisture.push(parseFloat(data.soil_moisture));
    sensorHistory.timestamps.push(new Date(data.timestamp).toLocaleTimeString());

    if (sensorHistory.temperature.length > maxPoints) {
        sensorHistory.temperature.shift();
        sensorHistory.humidity.shift();
        sensorHistory.soilMoisture.shift();
        sensorHistory.timestamps.shift();
    }
}

function initializeCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    charts.overview = new Chart(document.getElementById('overviewChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: '#4facfe',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Soil Moisture (%)',
                    data: [],
                    borderColor: '#43e97b',
                    backgroundColor: 'rgba(67, 233, 123, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: commonOptions
    });

    charts.temperature = new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    charts.humidity = new Chart(document.getElementById('humidityChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: '#4facfe',
                backgroundColor: 'rgba(79, 172, 254, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    charts.soil = new Chart(document.getElementById('soilChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Soil Moisture (%)',
                data: [],
                borderColor: '#43e97b',
                backgroundColor: 'rgba(67, 233, 123, 0.2)',
                fill: true,
                tension: 0.4,
                segment: {
                    borderColor: (ctx) => {
                        const value = ctx.p1.parsed.y;
                        if (value >= 50 && value <= 70) return '#27ae60';
                        if (value >= 30 && value < 50) return '#f39c12';
                        return '#e74c3c';
                    },
                    backgroundColor: (ctx) => {
                        const value = ctx.p1.parsed.y;
                        if (value >= 50 && value <= 70) return 'rgba(39, 174, 96, 0.2)';
                        if (value >= 30 && value < 50) return 'rgba(243, 156, 18, 0.2)';
                        return 'rgba(231, 76, 60, 0.2)';
                    }
                }
            }]
        },
        options: commonOptions
    });
}

function updateCharts() {
    charts.overview.data.labels = sensorHistory.timestamps;
    charts.overview.data.datasets[0].data = sensorHistory.temperature;
    charts.overview.data.datasets[1].data = sensorHistory.humidity;
    charts.overview.data.datasets[2].data = sensorHistory.soilMoisture;
    charts.overview.update();

    charts.temperature.data.labels = sensorHistory.timestamps;
    charts.temperature.data.datasets[0].data = sensorHistory.temperature;
    charts.temperature.update();

    charts.humidity.data.labels = sensorHistory.timestamps;
    charts.humidity.data.datasets[0].data = sensorHistory.humidity;
    charts.humidity.update();

    charts.soil.data.labels = sensorHistory.timestamps;
    charts.soil.data.datasets[0].data = sensorHistory.soilMoisture;
    charts.soil.update();
}

function updateAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.update();
    });
}

async function fetchWeatherData() {
    try {
        const location = await fetch('https://ipapi.co/json/').then(r => r.json());
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location.city}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        updateWeatherDisplay(data);
        fetchWeatherForecast(location.city);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showMockWeather();
    }
}

function showMockWeather() {
    document.getElementById('weatherTempLarge').textContent = '24°C';
    document.getElementById('weatherCondition').textContent = 'Partly Cloudy';
    document.getElementById('feelsLike').textContent = '22°C';
    document.getElementById('weatherHumidity').textContent = '65%';
    document.getElementById('weatherPressure').textContent = '1013 hPa';
    document.getElementById('weatherWind').textContent = '3.5 m/s';
}

function updateWeatherDisplay(data) {
    document.getElementById('weatherTempLarge').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('weatherCondition').textContent = data.weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('weatherHumidity').textContent = `${data.main.humidity}%`;
    document.getElementById('weatherPressure').textContent = `${data.main.pressure} hPa`;
    document.getElementById('weatherWind').textContent = `${data.wind.speed} m/s`;

    updateWeatherIcon(data.weather[0].main);
}

function updateWeatherIcon(condition) {
    const iconElement = document.querySelector('#weatherIconLarge i');
    const iconMap = {
        'Clear': 'sun',
        'Clouds': 'cloud',
        'Rain': 'cloud-rain',
        'Snow': 'cloud-snow',
        'Thunderstorm': 'cloud-lightning',
        'Drizzle': 'cloud-drizzle',
        'Mist': 'cloud-fog'
    };

    const iconName = iconMap[condition] || 'cloud';
    iconElement.setAttribute('data-lucide', iconName);
    lucide.createIcons();
}

async function fetchWeatherForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();

        updateForecastChart(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        showMockForecast();
    }
}

function showMockForecast() {
    const mockDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const mockTemps = [24, 26, 25, 23, 22, 24, 25];
    const mockHumidity = [65, 70, 68, 72, 75, 70, 68];

    if (!charts.forecast) {
        charts.forecast = new Chart(document.getElementById('forecastChart'), {
            type: 'line',
            data: {
                labels: mockDays,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: mockTemps,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Humidity (%)',
                        data: mockHumidity,
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

function updateForecastChart(data) {
    const dailyData = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyData[date]) {
            dailyData[date] = {
                temps: [],
                humidity: []
            };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidity.push(item.main.humidity);
    });

    const labels = Object.keys(dailyData).slice(0, 7);
    const temps = labels.map(day => {
        const dayTemps = dailyData[day].temps;
        return (dayTemps.reduce((a, b) => a + b, 0) / dayTemps.length).toFixed(1);
    });
    const humidity = labels.map(day => {
        const dayHumidity = dailyData[day].humidity;
        return (dayHumidity.reduce((a, b) => a + b, 0) / dayHumidity.length).toFixed(0);
    });

    if (!charts.forecast) {
        charts.forecast = new Chart(document.getElementById('forecastChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temps,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4
                    },
                    {
                        label: 'Humidity (%)',
                        data: humidity,
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    } else {
        charts.forecast.data.labels = labels;
        charts.forecast.data.datasets[0].data = temps;
        charts.forecast.data.datasets[1].data = humidity;
        charts.forecast.update();
    }
}

function setupFormListeners() {
    const form = document.getElementById('footprintForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            crop: document.getElementById('cropName').value,
            daily_usage: parseFloat(document.getElementById('dailyUsage').value),
            area: parseFloat(document.getElementById('area').value),
            area_unit: document.getElementById('areaUnit').value
        };

        await calculateFootprint(formData);
    });
}

async function calculateFootprint(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/calculate-footprint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        displayFootprintResult(result);
    } catch (error) {
        console.error('Error calculating footprint:', error);
        showMockCalculation(formData);
    }
}

function showMockCalculation(formData) {
    const areaInSqm = formData.area_unit === 'acre' ? formData.area * 4046.86 : formData.area;
    const totalFootprint = formData.daily_usage * 30 * (areaInSqm / 100);

    const currentTemp = parseFloat(document.getElementById('tempValue').textContent);
    const currentHumidity = parseFloat(document.getElementById('humidityValue').textContent);
    const currentSoil = parseFloat(document.getElementById('soilValue').textContent);

    const result = {
        total_footprint: totalFootprint,
        unit: 'liters',
        efficiency: totalFootprint < 15000 ? 'efficient' : totalFootprint < 30000 ? 'normal' : 'overuse',
        ideal_usage: totalFootprint * 0.8,
        sensor_data: {
            temperature: currentTemp,
            humidity: currentHumidity,
            soil_moisture: currentSoil
        }
    };

    displayFootprintResult(result);
}

function displayFootprintResult(result) {
    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'block';

    document.getElementById('footprintResult').textContent = result.total_footprint.toLocaleString();
    document.getElementById('footprintUnit').textContent = result.unit;

    const badge = document.getElementById('efficiencyBadge');
    const efficiencyText = document.getElementById('efficiencyText');

    badge.className = 'efficiency-badge';
    if (result.efficiency === 'efficient') {
        badge.classList.add('efficient');
        efficiencyText.textContent = 'Efficient Usage';
    } else if (result.efficiency === 'normal') {
        badge.classList.add('normal');
        efficiencyText.textContent = 'Normal Usage';
    } else {
        badge.classList.add('overuse');
        efficiencyText.textContent = 'Overuse Warning';
    }

    document.getElementById('calcTemp').textContent = `${result.sensor_data.temperature}°C`;
    document.getElementById('calcHumidity').textContent = `${result.sensor_data.humidity}%`;
    document.getElementById('calcSoil').textContent = `${result.sensor_data.soil_moisture}%`;

    updateComparisonChart(result.total_footprint, result.ideal_usage || result.total_footprint * 0.8);

    lucide.createIcons();
}

function updateComparisonChart(actual, ideal) {
    if (charts.comparison) {
        charts.comparison.destroy();
    }

    charts.comparison = new Chart(document.getElementById('comparisonChart'), {
        type: 'bar',
        data: {
            labels: ['Actual Usage', 'Ideal Usage'],
            datasets: [{
                label: 'Water Usage (liters)',
                data: [actual, ideal],
                backgroundColor: [
                    'rgba(0, 153, 204, 0.7)',
                    'rgba(39, 174, 96, 0.7)'
                ],
                borderColor: [
                    '#0099cc',
                    '#27ae60'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Liters'
                    }
                }
            }
        }
    });
}

function saveToHistory(data) {
    const historyEntry = {
        timestamp: new Date(data.timestamp).toLocaleString(),
        temperature: parseFloat(data.temperature).toFixed(1),
        humidity: parseFloat(data.humidity).toFixed(1),
        soil_moisture: parseFloat(data.soil_moisture).toFixed(1),
        footprint: (Math.random() * 5000 + 10000).toFixed(0)
    };

    historicalData.unshift(historyEntry);

    if (historicalData.length > 100) {
        historicalData = historicalData.slice(0, 100);
    }

    localStorage.setItem('waterFootprintHistory', JSON.stringify(historicalData));
    updateHistoryTable();
}

function loadHistoricalData() {
    const stored = localStorage.getItem('waterFootprintHistory');
    if (stored) {
        historicalData = JSON.parse(stored);
        updateHistoryTable();
    }
}

function updateHistoryTable() {
    const tbody = document.getElementById('historyTableBody');

    if (historicalData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No historical data available</td></tr>';
        return;
    }

    tbody.innerHTML = historicalData.map(entry => `
        <tr>
            <td>${entry.timestamp}</td>
            <td>${entry.temperature}</td>
            <td>${entry.humidity}</td>
            <td>${entry.soil_moisture}</td>
            <td>${entry.footprint}</td>
        </tr>
    `).join('');
}

function setupTableListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        filterHistoryTable(e.target.value);
    });

    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', exportToCSV);

    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortHistoryTable(column);
        });
    });
}

function filterHistoryTable(searchTerm) {
    const filtered = historicalData.filter(entry => {
        return Object.values(entry).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = filtered.map(entry => `
        <tr>
            <td>${entry.timestamp}</td>
            <td>${entry.temperature}</td>
            <td>${entry.humidity}</td>
            <td>${entry.soil_moisture}</td>
            <td>${entry.footprint}</td>
        </tr>
    `).join('');
}

function sortHistoryTable(column) {
    historicalData.sort((a, b) => {
        const aVal = column === 'timestamp' ? new Date(a[column]) : parseFloat(a[column]);
        const bVal = column === 'timestamp' ? new Date(b[column]) : parseFloat(b[column]);
        return bVal - aVal;
    });

    updateHistoryTable();
}

function exportToCSV() {
    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Soil Moisture (%)', 'Footprint (L)'];
    const csvContent = [
        headers.join(','),
        ...historicalData.map(entry =>
            `${entry.timestamp},${entry.temperature},${entry.humidity},${entry.soil_moisture},${entry.footprint}`
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water-footprint-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
