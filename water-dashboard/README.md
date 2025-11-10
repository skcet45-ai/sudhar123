# Smart Water Footprint Calculator

A desktop-only web dashboard application for monitoring real-time temperature, humidity, and soil moisture readings from sensors, fetching weather data, and calculating total water footprint dynamically.

## Features

- **Real-time Sensor Monitoring**: Display live temperature, humidity, and soil moisture readings
- **Weather Integration**: Current weather conditions and 7-day forecast using OpenWeatherMap API
- **Interactive Charts**: Real-time visualization of sensor data with Chart.js
- **Water Footprint Calculator**: Calculate water usage based on crop type, daily usage, and cultivation area
- **Historical Data**: Track and export sensor readings and footprint calculations
- **Desktop-Optimized**: Clean, academic-grade interface designed for desktop PCs

## Prerequisites

- Python 3.7+ (for Flask backend)
- Modern web browser (Chrome, Firefox, Edge)
- OpenWeatherMap API key (free tier available)

## Setup Instructions

### 1. Backend Setup (Flask)

Your Flask backend should expose the following endpoints:

#### GET `/api/sensor-data`
Returns current sensor readings:
```json
{
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 58.3,
  "timestamp": "2025-11-10T12:34:56Z"
}
```

#### POST `/api/calculate-footprint`
Accepts:
```json
{
  "crop": "Rice",
  "daily_usage": 500,
  "area": 100,
  "area_unit": "sqm"
}
```

Returns:
```json
{
  "total_footprint": 15000,
  "unit": "liters",
  "efficiency": "efficient",
  "ideal_usage": 12000,
  "sensor_data": {
    "temperature": 24.5,
    "humidity": 65.2,
    "soil_moisture": 58.3
  }
}
```

### 2. Frontend Setup

1. **Configure OpenWeatherMap API**:
   - Get your free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Open `static/js/app.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key:
     ```javascript
     const OPENWEATHER_API_KEY = 'your_actual_api_key_here';
     ```

2. **Update Backend URL** (if different):
   - In `static/js/app.js`, update the base URL if your Flask backend runs on a different port:
     ```javascript
     const API_BASE_URL = 'http://localhost:5000';
     ```

3. **Open the Dashboard**:
   - Simply open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     python -m http.server 8000
     ```
   - Navigate to `http://localhost:8000`

## Dashboard Modules

### Dashboard
- 4 metric cards displaying real-time sensor data
- Automatic updates every 5 seconds
- Real-time overview chart with all sensors

### Weather
- Current weather conditions with icons
- Temperature, humidity, pressure, and wind speed
- 7-day forecast trend chart

### Sensors
- Individual charts for temperature, humidity, and soil moisture
- Color-coded soil moisture zones:
  - Green: 50-70% (Optimal)
  - Yellow: 30-50% (Moderate)
  - Red: <30% (Low/Dry)
- Auto-refresh every 30 seconds

### Calculator
- Input crop name, daily water usage, and cultivation area
- Real-time calculation via Flask backend
- Efficiency rating (Efficient/Normal/Overuse)
- Comparison chart: Actual vs Ideal usage

### History
- Table of historical sensor readings and footprint calculations
- Search and sort functionality
- Export to CSV capability
- Data persisted in browser localStorage

## Customization

### Colors
Main colors defined in `static/css/styles.css`:
- **Background**: `#f7fbff`
- **Accent**: `#0099cc` (buttons, highlights)
- **Success**: `#27ae60` (optimal readings)
- **Text**: `#333333`

### Data Refresh Intervals
In `static/js/app.js`:
- Sensor data: 5 seconds
- Charts auto-refresh: 30 seconds
- DateTime update: 1 second

### Chart Configuration
Charts are configured using Chart.js. Modify the `initializeCharts()` function in `app.js` to customize appearance and behavior.

## Browser Compatibility

Tested and optimized for:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Notes

- The dashboard operates in desktop mode only
- Mock data is displayed if backend connection fails
- Historical data is stored in browser localStorage (max 100 entries)
- Weather data requires internet connection

## Troubleshooting

**Sensor data not updating:**
- Ensure Flask backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Verify backend endpoints are responding correctly

**Weather not loading:**
- Verify OpenWeatherMap API key is valid
- Check API rate limits (60 calls/minute for free tier)
- Ensure internet connection is active

**Charts not displaying:**
- Check browser console for JavaScript errors
- Ensure Chart.js CDN is accessible
- Clear browser cache and reload

## License

This project is open source and available for educational purposes.
