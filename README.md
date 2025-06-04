# 🌟 Morocco Adventure 2025 - Ultimate Travel Dashboard

A world-class, agency-level travel dashboard for Denis & Omar's epic Morocco journey, featuring real-time weather, interactive maps, and collaborative planning tools.

## 🚀 Quick Start

### Option 1: Python Server (Recommended)

```bash
cd morocco-adventure
python3 start-server.py
```

### Option 2: Node.js Server

```bash
cd morocco-adventure
npx http-server -p 8000 -o
```

### Option 3: Simple Python (if script fails)

```bash
cd morocco-adventure
python3 -m http.server 8000
```

Then open: http://localhost:8000

## ✨ Features

### 🌤️ **Real-Time Weather**

- Live weather data for all 8 Morocco destinations
- 7-day forecasts with detailed conditions
- Smart weather recommendations and packing suggestions
- Offline fallback data when API is unavailable

### 🗺️ **Interactive Maps**

- Custom-styled Google Maps with route visualization
- Clickable markers with detailed location info
- Nearby places discovery and directions
- Offline map support

### 🎯 **Smart Travel Tools**

- Live countdown timers to trip milestones
- Real-time currency converter (GBP/EUR/USD ↔ MAD)
- QR codes for booking references
- Emergency contact information
- Arabic & French language helper with speech

### 👥 **Collaboration Features**

- Shared notes system for trip planning
- Interactive packing checklist (4 categories)
- Photo gallery with upload/sharing capabilities
- Export capabilities for itinerary and costs

### 📱 **Progressive Web App (PWA)**

- Install on mobile/desktop for offline access
- Push notifications for important reminders
- Works offline with cached data
- App-like experience

## 🔧 Technical Details

### File Structure

```
morocco-adventure/
├── index.html              # Main dashboard
├── manifest.json           # PWA configuration
├── start-server.py         # Python server launcher
├── README.md              # This file
└── assets/
    ├── css/
    │   └── enhanced.css    # Professional styling
    └── js/
        ├── data.js         # Trip data & API keys
        ├── utils.js        # Travel utilities
        ├── weather.js      # Weather integration
        ├── maps.js         # Google Maps integration
        └── app.js          # Main application
```

### API Configuration

The dashboard uses:

- **OpenWeatherMap API** for weather data
- **Google Maps JavaScript API** for interactive maps

API keys are configured in `assets/js/data.js`

### Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers

## 🛠️ Troubleshooting

### Loading Issues

If the dashboard shows a loading screen:

1. Make sure you're running via HTTP server (not file://)
2. Check browser console for API errors
3. Verify API keys in `assets/js/data.js`

### CORS Errors

Always run via local server, never open `index.html` directly in browser.

### API Limits

- OpenWeatherMap: 1000 calls/day (free tier)
- Google Maps: $200/month credit (free tier)

## 📋 Trip Overview

- **Duration**: 33 days (June 18 - July 20, 2025)
- **Destinations**: 8 cities across Morocco
- **Work Days**: ~14 days with 5G router
- **Estimated Cost**: £300+ for accommodation

### Key Dates

- **June 18**: Arrival in Ouarzazate
- **June 20-22**: 3-day Sahara Desert tour
- **June 23**: Agafay Desert experience
- **June 25-July 3**: Agadir beach base (main work period)
- **July 11**: Omar departs to NYC, Denis continues solo

## 🎨 Design Features

- Dark theme with animated starfield background
- Glass-morphism effects and smooth animations
- Responsive design for all screen sizes
- Print-friendly layouts for physical copies
- Agency-level visual polish

---

**🌍 Have an amazing adventure in Morocco! 🐪**
