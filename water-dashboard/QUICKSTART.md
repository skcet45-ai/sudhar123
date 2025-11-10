# Quick Start Guide

Get the Smart Water Footprint Calculator running in 5 minutes!

## Step 1: Start the Backend (Optional)

If you want to test with the example backend:

```bash
cd water-dashboard

# Install Python dependencies
pip install -r backend_requirements.txt

# Run the Flask backend
python backend_example.py
```

The backend will start on `http://localhost:5000`

## Step 2: Configure OpenWeatherMap API

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open `static/js/app.js`
3. Find line 2 and replace:
   ```javascript
   const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
   ```
   with:
   ```javascript
   const OPENWEATHER_API_KEY = 'your_actual_key_here';
   ```

## Step 3: Open the Dashboard

### Option A: Direct File Access
Simply open `index.html` in your browser

### Option B: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## What to Expect

### Dashboard Page
- 4 metric cards showing real-time sensor data
- Updates automatically every 5 seconds
- Line chart with all sensor trends

### Weather Page
- Current weather conditions
- 7-day forecast chart
- Detailed weather metrics

### Sensors Page
- Individual charts for each sensor type
- Color-coded soil moisture levels
- Auto-refreshing data

### Calculator Page
- Enter crop details and water usage
- Get instant footprint calculation
- See efficiency rating and recommendations

### History Page
- View all past readings
- Search and sort data
- Export to CSV

## Testing Without Backend

The dashboard includes mock data generation, so it works even without a backend connection. You'll see simulated sensor readings and can test all features.

## Customization Tips

### Change Colors
Edit `static/css/styles.css`:
- Line 12: Main background color
- Lines 15-20: Sidebar gradient
- Lines 200-220: Metric card colors

### Adjust Update Intervals
Edit `static/js/app.js`:
- Line 28: Sensor data refresh (currently 5000ms = 5 seconds)
- Line 29: Chart updates (currently 30000ms = 30 seconds)

### Modify API Endpoint
Edit `static/js/app.js`:
- Line 1: Change backend URL if needed

## Troubleshooting

**Backend not connecting?**
- Check if Flask is running on port 5000
- Look for CORS errors in browser console
- Try opening `http://localhost:5000/api/sensor-data` directly

**Weather not loading?**
- Verify your API key is correct
- Check you haven't exceeded API rate limits
- Ensure you have internet connection

**Charts not showing?**
- Check browser console for errors
- Ensure Chart.js CDN is accessible
- Try hard refresh (Ctrl+Shift+R)

## Next Steps

1. Connect to real IoT sensors by updating the backend
2. Add database storage for historical data
3. Implement user authentication
4. Add more crop types and calculation models
5. Create alerts for abnormal readings

Enjoy monitoring your water footprint!
