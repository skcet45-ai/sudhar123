# Features Documentation

## Core Features

### 1. Real-time Sensor Dashboard

**Metric Cards:**
- Temperature monitoring with trend indicators
- Humidity tracking with visual feedback
- Soil moisture levels with status
- Weather condition integration

**Update Frequency:** 5 seconds

**Visual Indicators:**
- Trend arrows (up/down) for each metric
- Color-coded icons for different sensor types
- Hover effects with smooth transitions

### 2. Weather Module

**Current Weather Display:**
- Large temperature readout
- Weather condition with icon
- Feels like temperature
- Humidity percentage
- Atmospheric pressure
- Wind speed

**7-Day Forecast:**
- Dual-axis line chart
- Temperature trend (primary axis)
- Humidity trend (secondary axis)
- Interactive hover tooltips

**Data Source:** OpenWeatherMap API

### 3. Sensor Visualization

**Individual Charts:**
- Temperature chart (orange theme)
- Humidity chart (blue theme)
- Soil moisture chart (green theme)

**Soil Moisture Zones:**
- Green zone: 50-70% (Optimal for most crops)
- Yellow zone: 30-50% (Moderate, may need irrigation)
- Red zone: <30% (Low, irrigation needed)

**Chart Features:**
- Auto-scaling axes
- Smooth curve interpolation
- 20-point rolling window
- Auto-refresh every 30 seconds

### 4. Water Footprint Calculator

**Input Parameters:**
- Crop name (text input)
- Daily water usage in liters
- Cultivation area (sq.m or acres)

**Calculation Output:**
- Total monthly water footprint
- Efficiency rating badge
- Current sensor context
- Actual vs. Ideal comparison chart

**Efficiency Ratings:**
- Efficient: <15,000 L (Green badge)
- Normal: 15,000-30,000 L (Yellow badge)
- Overuse: >30,000 L (Red badge)

### 5. Historical Data Management

**Data Table Features:**
- Sortable columns
- Real-time search/filter
- Paginated view
- Timestamp tracking

**Export Functionality:**
- CSV export with headers
- Timestamped filename
- All historical records included

**Data Storage:**
- Browser localStorage
- Maximum 100 entries
- Automatic pruning of old data

## Design Features

### Color System

**Primary Palette:**
- Background: #f7fbff (Light blue-white)
- Primary accent: #0099cc (Cyan blue)
- Success: #27ae60 (Green)
- Warning: #f39c12 (Orange)
- Error: #e74c3c (Red)

**Gradients:**
- Sidebar: #e6f7ff → #cfe8f5
- Metric icons: Custom gradients per type
- Charts: Semi-transparent fills

### Typography

**Font Family:** Inter (Google Fonts)

**Sizes:**
- Page title: 24px bold
- Card titles: 18px semi-bold
- Metric values: 28px bold
- Body text: 16px medium
- Labels: 14px regular

### Interactions

**Hover Effects:**
- Metric cards: Lift and shadow glow
- Buttons: Scale and color shift
- Navigation: Slide-in effect
- Table rows: Background highlight

**Transitions:**
- Default duration: 0.3s
- Easing: ease-in-out
- Page transitions: fade-in animation

### Layout

**Grid System:**
- Dashboard: 4-column metrics grid
- Weather details: 4-column grid
- Sensor charts: 2-column layout
- Calculator: 2-column form/result

**Responsive Breakpoints:**
- 1400px: 2-column metrics
- 1200px: Single column layouts
- Desktop-optimized (>1024px minimum)

## Technical Features

### Data Fetching

**API Endpoints:**
- GET `/api/sensor-data` - Real-time readings
- POST `/api/calculate-footprint` - Calculations

**Error Handling:**
- Automatic fallback to mock data
- Console error logging
- User-friendly error messages

**Retry Logic:**
- Continuous polling
- Graceful degradation
- Visual connection status

### Chart Configuration

**Library:** Chart.js 4.4.0

**Chart Types:**
- Line charts for trends
- Bar charts for comparisons
- Multi-dataset displays

**Features:**
- Responsive sizing
- Interactive legends
- Tooltip customization
- Smooth animations

### Browser Storage

**localStorage Keys:**
- `waterFootprintHistory` - Sensor and footprint data

**Data Structure:**
```json
{
  "timestamp": "2025-11-10 12:34:56",
  "temperature": 24.5,
  "humidity": 65.2,
  "soil_moisture": 58.3,
  "footprint": 12500
}
```

## Performance Features

### Optimization

**Load Time:**
- Minimal dependencies
- CDN-hosted libraries
- Optimized CSS/JS
- No build step required

**Runtime:**
- Efficient DOM updates
- Chart reuse (no recreation)
- Debounced search
- Lazy data loading

**Data Management:**
- Rolling window for charts (20 points)
- Historical data limit (100 entries)
- Automatic cleanup
- Memory-efficient storage

## Accessibility

**Keyboard Navigation:**
- Tab-accessible controls
- Enter key form submission
- Arrow key chart interaction

**Visual Clarity:**
- High contrast ratios
- Large touch targets (48px minimum)
- Clear focus indicators
- Readable font sizes

**Icons:**
- Lucide icon library
- SVG-based for scaling
- Semantic naming
- ARIA labels supported

## Browser Compatibility

**Tested Browsers:**
- Chrome 90+ (Recommended)
- Firefox 88+
- Edge 90+
- Safari 14+

**Required Features:**
- ES6+ JavaScript
- CSS Grid & Flexbox
- LocalStorage API
- Fetch API
- Canvas API (for charts)

## Future Enhancement Possibilities

1. **Multi-user support** with authentication
2. **Database backend** for persistent storage
3. **Alert system** for threshold violations
4. **Mobile responsive** version
5. **PDF report generation**
6. **Email notifications**
7. **Advanced analytics** and ML predictions
8. **Multiple location** support
9. **Crop database** with optimal water ranges
10. **IoT device** configuration interface
