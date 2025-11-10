# Getting Started with Smart Water Footprint Calculator

Welcome! This guide will help you get the dashboard running in minutes.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Modern web browser (Chrome 90+, Firefox 88+, Edge 90+, or Safari 14+)
- [ ] Python 3.7+ installed (if running the backend)
- [ ] Text editor (VS Code, Sublime, or any editor)
- [ ] Internet connection (for CDN resources and weather API)

## Step-by-Step Setup

### Step 1: Get OpenWeatherMap API Key (2 minutes)

1. Visit https://openweathermap.org/api
2. Click "Sign Up" or "Get API Key"
3. Create a free account
4. Navigate to API Keys section
5. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Configure the Frontend (1 minute)

1. Open `static/js/app.js` in your text editor
2. Find line 2:
   ```javascript
   const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace with your actual key:
   ```javascript
   const OPENWEATHER_API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```
4. Save the file

### Step 3: Start the Backend (Optional - 2 minutes)

**Option A: Using the Example Backend**

```bash
# Navigate to project directory
cd water-dashboard

# Install Python dependencies
pip install -r backend_requirements.txt

# Start Flask server
python backend_example.py
```

You should see:
```
Starting Flask backend on http://localhost:5000
Available endpoints:
  GET  /api/sensor-data
  POST /api/calculate-footprint
```

**Option B: Skip Backend (Test with Mock Data)**

The dashboard includes built-in mock data, so you can test without a backend!

### Step 4: Open the Dashboard (30 seconds)

**Option A: Direct Open**
- Double-click `index.html`
- Your browser will open the dashboard

**Option B: Local Server (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

## First-Time Usage Guide

### 1. Dashboard Page (Default View)

You'll see 4 metric cards:
- Temperature
- Humidity
- Soil Moisture
- Weather Condition

**What to expect:**
- Cards update every 5 seconds
- Trend arrows show if values are increasing/decreasing
- Real-time chart displays all sensor data

**Action:** Watch the cards update for 10-15 seconds

### 2. Weather Page

Click "Weather" in the sidebar.

**What to expect:**
- Current weather for your location (auto-detected)
- 4 detailed metrics (feels like, humidity, pressure, wind)
- 7-day forecast chart

**Action:** Verify weather matches your actual location

### 3. Sensors Page

Click "Sensors" in the sidebar.

**What to expect:**
- 3 individual charts (Temperature, Humidity, Soil Moisture)
- Color-coded zones on soil moisture chart
- Charts auto-refresh every 30 seconds

**Action:** Observe the different chart styles and colors

### 4. Calculator Page

Click "Calculator" in the sidebar.

**Try this example:**
1. Crop Name: `Rice`
2. Daily Water Usage: `500` liters
3. Area: `100` sq.m
4. Click "Calculate Footprint"

**What to expect:**
- Result card appears on the right
- Total footprint displayed
- Efficiency badge (Efficient/Normal/Overuse)
- Comparison chart shows actual vs ideal usage

### 5. History Page

Click "History" in the sidebar.

**What to expect:**
- Table of all past sensor readings
- Search box to filter data
- Sortable columns (click headers)
- Export CSV button

**Action:**
1. Type something in search box
2. Click "Export CSV" to download data

## Verification Checklist

After setup, verify these work:

- [ ] Dashboard loads without errors
- [ ] Metric cards show numbers (not `--`)
- [ ] Charts display lines (not empty)
- [ ] Weather page shows your location
- [ ] Calculator accepts input and shows result
- [ ] History table has entries
- [ ] CSV export downloads a file
- [ ] No errors in browser console (F12 → Console tab)

## Common First-Time Issues

### Issue: Metric cards show `--`

**Cause:** Backend not running or URL incorrect

**Fix:**
1. Check Flask is running on port 5000
2. Verify `API_BASE_URL` in `app.js` line 1
3. Check browser console for errors

### Issue: Weather not loading

**Cause:** Invalid or missing API key

**Fix:**
1. Verify API key is correct in `app.js`
2. Check you didn't exceed API rate limit (60 calls/minute)
3. Ensure internet connection is active

### Issue: Charts not visible

**Cause:** Chart.js CDN not loading

**Fix:**
1. Check internet connection
2. Try hard refresh (Ctrl + Shift + R)
3. Check browser console for CDN errors

### Issue: "Location unavailable"

**Cause:** Location detection API issue

**Fix:**
1. Ignore - weather will still work
2. Or manually update location in `app.js`

## Quick Reference: File Locations

**Need to change API key?**
→ `static/js/app.js` line 2

**Need to change backend URL?**
→ `static/js/app.js` line 1

**Need to change colors?**
→ `static/css/styles.css` search for color codes (#0099cc, etc.)

**Need to change update intervals?**
→ `static/js/app.js` lines 27-29

## Testing the Backend

Test your Flask backend independently:

### Test Sensor Data Endpoint
```bash
curl http://localhost:5000/api/sensor-data
```

Expected response:
```json
{
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 58.3,
  "timestamp": "2025-11-10T12:34:56Z"
}
```

### Test Calculator Endpoint
```bash
curl -X POST http://localhost:5000/api/calculate-footprint \
  -H "Content-Type: application/json" \
  -d '{"crop":"Rice","daily_usage":500,"area":100,"area_unit":"sqm"}'
```

Expected response:
```json
{
  "total_footprint": 15000,
  "unit": "liters",
  "efficiency": "efficient",
  ...
}
```

## Browser Developer Tools

Press `F12` to open developer tools:

**Console Tab:**
- See JavaScript logs
- Check for errors (red text)
- View API requests/responses

**Network Tab:**
- Monitor API calls
- Check response times
- Verify endpoints returning data

**Application Tab:**
- View localStorage data
- Clear stored history if needed

## Customization Quick Start

### Change Primary Color
1. Open `static/css/styles.css`
2. Find all instances of `#0099cc`
3. Replace with your color (e.g., `#ff6600`)

### Change Update Frequency
1. Open `static/js/app.js`
2. Find line 28: `setInterval(() => fetchSensorData(), 5000)`
3. Change `5000` to desired milliseconds (e.g., `10000` = 10 seconds)

### Add More Historical Data
1. Open `static/js/app.js`
2. Find line ~730: `if (historicalData.length > 100)`
3. Change `100` to desired limit (e.g., `500`)

## Next Steps

Once everything is running:

1. **Explore all 5 modules** - Get familiar with each page
2. **Read [FEATURES.md](FEATURES.md)** - Learn about all capabilities
3. **Check [INTERFACE_GUIDE.md](INTERFACE_GUIDE.md)** - Understand the UI
4. **Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical details
5. **Customize!** - Make it your own

## Getting Help

**Documentation:**
- [INDEX.md](INDEX.md) - Documentation index
- [README.md](README.md) - Detailed setup
- [QUICKSTART.md](QUICKSTART.md) - Fast setup
- [FEATURES.md](FEATURES.md) - Feature details

**Debugging:**
1. Check browser console (F12)
2. Verify backend is running
3. Test endpoints with curl
4. Review error messages

**Tips:**
- Keep browser console open while testing
- Use mock data mode if backend is down
- Clear localStorage if data seems corrupted
- Try different browsers if issues persist

## Success Indicators

You'll know it's working when:

✅ All 4 metric cards show numbers
✅ Overview chart displays 3 colored lines
✅ Weather page shows your city name
✅ Calculator produces results
✅ History table has at least one row
✅ No red errors in browser console

## What's Next?

After getting started:

- Connect to real IoT sensors
- Add authentication system
- Implement database storage
- Create custom crop profiles
- Set up alert thresholds
- Deploy to production server

Enjoy monitoring your water footprint!

---

**Need more help?**
- Check [QUICKSTART.md](QUICKSTART.md) for faster setup
- Read [README.md](README.md) for detailed instructions
- Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
