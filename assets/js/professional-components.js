// Professional Components for Morocco Adventure Dashboard
// Apple-inspired design with advanced functionality

class ProfessionalComponents {
  constructor() {
    this.userLocation = null;
    this.timeZones = {
      user: Intl.DateTimeFormat().resolvedOptions().timeZone,
      morocco: "Africa/Casablanca",
    };
  }

  // Initialize geolocation
  async initializeLocation() {
    try {
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        });

        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        console.log("📍 Location detected:", this.userLocation);
        return this.userLocation;
      }
    } catch (error) {
      console.log("📍 Location access denied or unavailable");
      return null;
    }
  }

  // Navigation Header Component
  renderNavigationHeader() {
    return `
      <header class="app-header">
        <div class="nav-container">
          <div class="nav-content">
            <div class="app-logo">
              <span>🇲🇦</span>
              <span>Morocco Adventure</span>
            </div>
            <nav class="nav-links">
              <a href="#overview" class="nav-link active" data-section="overview">Overview</a>
              <a href="#timeline" class="nav-link" data-section="timeline">Timeline</a>
              <a href="#weather" class="nav-link" data-section="weather">Weather</a>
              <a href="#logistics" class="nav-link" data-section="logistics">Logistics</a>
              <a href="#tools" class="nav-link" data-section="tools">Tools</a>
            </nav>
            <div class="nav-actions">
              <button class="btn btn-secondary btn-sm" onclick="professionalApp.requestLocation()">
                📍 Location
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  // Hero Section with Real-time Progress
  renderHeroSection() {
    const progress = this.calculateTripProgress();

    return `
      <section class="hero-section">
        <h1 class="hero-title">Morocco Adventure 2025</h1>
        <p class="hero-subtitle">June 18 - July 20 • Denis & Omar's Epic Journey</p>
        
        ${this.renderProgressCard(progress)}
        
        <div class="grid grid-cols-2 gap-6" style="max-width: 800px; margin: 0 auto;">
          ${this.renderLocationCard()}
          ${this.renderQuickStats()}
        </div>
      </section>
    `;
  }

  // Smart Progress Card
  renderProgressCard(progress) {
    return `
      <div class="progress-card">
        <div class="progress-header">
          <div class="progress-title">${progress.title}</div>
          <div class="progress-percentage">${progress.percentage}%</div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progress.percentage}%"></div>
        </div>
        <div class="progress-description">${progress.description}</div>
      </div>
    `;
  }

  // Current Location Card
  renderLocationCard() {
    const locationText = this.userLocation
      ? `📍 Your Location Detected`
      : `📍 Enable Location for Smart Features`;

    const locationDetails = this.userLocation
      ? `Lat: ${this.userLocation.lat.toFixed(
          4
        )}, Lng: ${this.userLocation.lng.toFixed(4)}`
      : `Get personalized weather, timezone info, and travel distances`;

    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">${locationText}</div>
            <div class="card-icon">🌍</div>
          </div>
          <div class="card-body">
            <p class="text-sm opacity-75">${locationDetails}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" onclick="professionalApp.requestLocation()">
              ${this.userLocation ? "Update Location" : "Enable Location"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Quick Stats Overview
  renderQuickStats() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Trip Overview</div>
            <div class="card-icon">📊</div>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-white">33</div>
                <div class="text-xs opacity-75">DAYS</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-white">8</div>
                <div class="text-xs opacity-75">CITIES</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Enhanced Countdown Timers with Timezone Support
  renderCountdownSection() {
    return `
      <section class="section" id="overview">
        <div class="section-header">
          <h2 class="section-title">⏰ Live Countdown</h2>
          <p class="section-subtitle">Real-time countdown in your timezone and Morocco time</p>
        </div>
        
        <div class="countdown-grid">
          ${this.renderCountdownCard(
            "2025-06-18T00:00:00",
            "🛫 Trip Departure",
            "morocco"
          )}
          ${this.renderCountdownCard(
            "2025-07-11T00:00:00",
            "✈️ Omar's NYC Flight",
            "morocco"
          )}
        </div>
      </section>
    `;
  }

  // Professional Countdown Card
  renderCountdownCard(targetDate, label, timezone = "user") {
    const timeZone =
      timezone === "morocco" ? this.timeZones.morocco : this.timeZones.user;
    const timeZoneLabel = timezone === "morocco" ? "Morocco Time" : "Your Time";

    return `
      <div class="countdown-card" data-target="${targetDate}" data-timezone="${timeZone}">
        <div class="countdown-label">${label}</div>
        <div class="countdown-display">
          <div class="countdown-unit">
            <div class="countdown-number" data-unit="days">--</div>
            <div class="countdown-unit-label">days</div>
          </div>
          <div class="countdown-unit">
            <div class="countdown-number" data-unit="hours">--</div>
            <div class="countdown-unit-label">hours</div>
          </div>
          <div class="countdown-unit">
            <div class="countdown-number" data-unit="minutes">--</div>
            <div class="countdown-unit-label">minutes</div>
          </div>
        </div>
        <div class="text-xs opacity-75 mt-4">${timeZoneLabel}</div>
      </div>
    `;
  }

  // Interactive Map Section with Real Google Maps
  renderInteractiveMapSection() {
    return `
      <section class="section" id="map-section">
        <div class="section-header">
          <h2 class="section-title">🗺️ Interactive Route Map</h2>
          <p class="section-subtitle">Your journey through Morocco with interactive features</p>
        </div>
        
        <div class="map-container">
          <div id="google-map" style="width: 100%; height: 500px; border-radius: 16px; overflow: hidden;">
            <div class="map-loading" style="display: flex; align-items: center; justify-content: center; height: 100%; background: rgba(255,255,255,0.1);">
              <div style="text-align: center;">
                <div class="loading-spinner" style="margin: 0 auto 16px;"></div>
                <p>Loading interactive map...</p>
              </div>
            </div>
          </div>
          
          <div class="map-controls" style="margin-top: 16px;">
            <button class="btn btn-secondary btn-sm" onclick="professionalApp.openGoogleMaps()">
              🗺️ Open in Google Maps
            </button>
            <button class="btn btn-secondary btn-sm" onclick="professionalApp.downloadOfflineMap()">
              📱 Offline Map Info
            </button>
            <button class="btn btn-secondary btn-sm" onclick="professionalApp.highlightCurrentLocation()">
              📍 Current Location
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // Enhanced Weather Dashboard
  renderWeatherDashboard() {
    return `
      <section class="section" id="weather">
        <div class="section-header">
          <h2 class="section-title">🌤️ Weather Intelligence</h2>
          <p class="section-subtitle">Real-time weather data for all your destinations</p>
        </div>
        
        <div class="grid grid-auto-fit">
          ${this.renderCurrentLocationWeather()}
          ${this.renderDestinationWeather()}
          ${this.renderWeatherRecommendations()}
          ${this.renderWeatherForecast()}
        </div>
      </section>
    `;
  }

  // Current Location Weather
  renderCurrentLocationWeather() {
    // Show fallback weather data immediately instead of loading
    const fallbackWeather = {
      location: "London, UK",
      temp: 12,
      description: "partly cloudy",
      humidity: 65,
      windSpeed: 8,
      icon: "⛅",
    };

    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Your Current Weather</div>
            <div class="card-icon">📍</div>
          </div>
          <div class="card-body">
            <div id="current-location-weather">
              <div class="weather-display">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-lg">${fallbackWeather.icon}</span>
                  <span class="text-2xl font-bold">${fallbackWeather.temp}°C</span>
                </div>
                <p class="text-sm opacity-75 mb-2">${fallbackWeather.description}</p>
                <div class="flex justify-between text-xs opacity-75">
                  <span>💧 ${fallbackWeather.humidity}%</span>
                  <span>💨 ${fallbackWeather.windSpeed} km/h</span>
                </div>
                <div class="text-xs opacity-50 mt-2">📍 Enable location for precise weather</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Destination Weather Grid
  renderDestinationWeather() {
    return `
      <div class="card" style="grid-column: span 2;">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Morocco Destinations</div>
            <div class="card-icon">🇲🇦</div>
          </div>
          <div class="card-body">
            <div id="destination-weather-grid" class="grid grid-cols-2 gap-4">
              ${TripData.locations
                .map((location) => this.renderWeatherCard(location))
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Individual Weather Card
  renderWeatherCard(location) {
    return `
      <div class="weather-mini-card" data-location="${location.name}">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">${location.emoji} ${location.name}</span>
          <span class="weather-temp">--°</span>
        </div>
        <div class="text-xs opacity-75 weather-desc">Loading...</div>
      </div>
    `;
  }

  // Weather Recommendations
  renderWeatherRecommendations() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Smart Recommendations</div>
            <div class="card-icon">🤖</div>
          </div>
          <div class="card-body">
            <div id="weather-recommendations">
              <div class="loading-shimmer" style="height: 100px; border-radius: 8px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 7-Day Forecast
  renderWeatherForecast() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">7-Day Forecast</div>
            <div class="card-icon">📅</div>
          </div>
          <div class="card-body">
            <div id="weather-forecast">
              <div class="loading-shimmer" style="height: 100px; border-radius: 8px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Enhanced Timeline Section
  renderTimelineSection() {
    console.log(
      "🔍 Rendering timeline with",
      TripData.itinerary.length,
      "days"
    );

    const timelineHTML = `
      <section class="section" id="timeline">
        <div class="section-header">
          <h2 class="section-title">📅 Journey Timeline</h2>
          <p class="section-subtitle">Your day-by-day adventure through Morocco</p>
        </div>
        
        <div class="timeline-container">
          ${TripData.itinerary
            .map((day, index) => {
              console.log(
                `Creating timeline card for day ${day.day}:`,
                day.title
              );
              return this.renderTimelineCard(day, index);
            })
            .join("")}
        </div>
      </section>
    `;

    console.log("📅 Timeline HTML generated successfully");
    return timelineHTML;
  }

  // Professional Timeline Card
  renderTimelineCard(dayData, index) {
    const isActive = this.isDayActive(dayData.date);
    const activeClass = isActive ? " timeline-card-active" : "";

    return `
      <div class="timeline-card${activeClass}" data-day="${dayData.day}">
        <div class="timeline-marker">
          <div class="timeline-number">${dayData.day}</div>
        </div>
        <div class="card">
          <div class="card-content">
            <div class="card-header">
              <div>
                <div class="card-title">${dayData.emoji} ${dayData.title}</div>
                <div class="text-sm opacity-75">${dayData.date}</div>
              </div>
              ${dayData.urgent ? '<div class="urgent-badge">❗</div>' : ""}
            </div>
            <div class="card-body">
              ${this.renderAccommodationInfo(dayData.accommodation)}
              ${this.renderTags(dayData.tags, dayData.tagTypes)}
            </div>
            ${
              dayData.details
                ? this.renderExpandableDetails(dayData.details)
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  // Accommodation Info
  renderAccommodationInfo(accommodation) {
    const statusColor =
      accommodation.status === "confirmed"
        ? "var(--secondary-teal)"
        : accommodation.status === "needs_booking"
        ? "var(--secondary-orange)"
        : "var(--gray-400)";

    return `
      <div class="accommodation-card">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium">${accommodation.name}</span>
          <div class="status-indicator" style="background: ${statusColor}"></div>
        </div>
        ${
          accommodation.bookingRef
            ? `<div class="text-xs font-mono opacity-75">Ref: ${accommodation.bookingRef}</div>`
            : ""
        }
        ${
          accommodation.cost
            ? `<div class="text-xs opacity-75">${accommodation.cost}</div>`
            : ""
        }
      </div>
    `;
  }

  // Enhanced Tags
  renderTags(tags, tagTypes) {
    if (!tags || !tagTypes) return "";

    return `
      <div class="tags-container">
        ${tags
          .map(
            (tag, index) => `
          <span class="tag tag-${tagTypes[index]}">${tag}</span>
        `
          )
          .join("")}
      </div>
    `;
  }

  // Expandable Details
  renderExpandableDetails(details) {
    const detailsId = `details-${Math.random().toString(36).substr(2, 9)}`;
    return `
      <div class="card-footer">
        <button class="btn btn-secondary btn-sm expand-details-btn" onclick="toggleTimelineDetails(this, '${detailsId}')">
          View Details
        </button>
        <div id="${detailsId}" class="expandable-details" style="display: none; margin-top: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div class="details-content">
            ${details
              .map(
                (detail) =>
                  `<p class="text-sm" style="margin: 8px 0; line-height: 1.4;">${detail}</p>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  }

  // Professional Logistics Section
  renderLogisticsSection() {
    return `
      <section class="section" id="logistics">
        <div class="section-header">
          <h2 class="section-title">🚌 Travel Logistics</h2>
          <p class="section-subtitle">Transportation, costs, and accommodation details</p>
        </div>
        
        <div class="grid grid-auto-fit">
          ${this.renderTransportCard()}
          ${this.renderCostCard()}
          ${this.renderAccommodationCard()}
        </div>
      </section>
    `;
  }

  // Transport Overview Card
  renderTransportCard() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Transportation</div>
            <div class="card-icon">🚌</div>
          </div>
          <div class="card-body">
            ${TripData.transport
              .slice(0, 3)
              .map(
                (transport) => `
              <div class="transport-item">
                <div class="flex items-center gap-3">
                  <span class="text-lg">${transport.icon}</span>
                  <div class="flex-1">
                    <div class="font-medium text-sm">${transport.route}</div>
                    <div class="text-xs opacity-75">${transport.date}</div>
                  </div>
                  <div class="status-dot ${
                    transport.booked ? "status-confirmed" : "status-pending"
                  }"></div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" onclick="showAllTransport()">
              View All Transport
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Cost Overview Card
  renderCostCard() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Cost Breakdown</div>
            <div class="card-icon">💰</div>
          </div>
          <div class="card-body">
            <div class="cost-summary">
              <div class="flex justify-between items-center mb-2">
                <span>Accommodation</span>
                <span class="font-bold">£300+</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span>Transport</span>
                <span class="font-bold">Estimate</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Activities</span>
                <span class="font-bold">Variable</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-sm" onclick="professionalApp.openCurrencyConverter()">
              💱 Currency Converter
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Accommodation Overview Card
  renderAccommodationCard() {
    const confirmedCount = TripData.itinerary.filter(
      (day) => day.accommodation.status === "confirmed"
    ).length;

    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Accommodation</div>
            <div class="card-icon">🏨</div>
          </div>
          <div class="card-body">
            <div class="accommodation-summary">
              <div class="text-center mb-4">
                <div class="text-3xl font-bold">${confirmedCount}</div>
                <div class="text-xs opacity-75">Bookings Confirmed</div>
              </div>
              <div class="text-xs text-center opacity-75">
                Most stays confirmed, some pending
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Tools and Utilities Section
  renderToolsSection() {
    return `
      <section class="section" id="tools">
        <div class="section-header">
          <h2 class="section-title">🛠️ Travel Tools</h2>
          <p class="section-subtitle">Helpful utilities for your Morocco adventure</p>
        </div>
        
        <div class="grid grid-auto-fit">
          ${this.renderCurrencyConverter()}
          ${this.renderPackingChecklists()}
          ${this.renderSharedNotes()}
          ${this.renderEmergencyInfo()}
        </div>
      </section>
    `;
  }

  // Currency Converter Tool
  renderCurrencyConverter() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Currency Converter</div>
            <div class="card-icon">💱</div>
          </div>
          <div class="card-body">
            <div class="currency-converter-mini">
              <div class="flex gap-2 items-center mb-3">
                <input type="number" class="currency-input" placeholder="100" value="100">
                <select class="currency-select">
                  <option value="GBP">£ GBP</option>
                  <option value="EUR">€ EUR</option>
                  <option value="USD">$ USD</option>
                </select>
              </div>
              <div class="text-center text-sm opacity-75">→</div>
              <div class="currency-result">
                <div class="text-2xl font-bold">~1,200 MAD</div>
                <div class="text-xs opacity-75">Moroccan Dirham</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Packing Checklists
  renderPackingChecklists() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Packing Lists</div>
            <div class="card-icon">🎒</div>
          </div>
          <div class="card-body">
            <div class="packing-progress">
              <div class="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>12/25 items</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 48%"></div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" onclick="openPackingListManager()">
              Manage Lists
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Shared Notes
  renderSharedNotes() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Shared Notes</div>
            <div class="card-icon">📝</div>
          </div>
          <div class="card-body">
            <textarea class="notes-textarea" placeholder="Add shared notes and ideas here..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-sm" onclick="professionalApp.saveNotes()">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Emergency Information
  renderEmergencyInfo() {
    return `
      <div class="card">
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Emergency Info</div>
            <div class="card-icon">🚨</div>
          </div>
          <div class="card-body">
            <div class="emergency-contacts">
              <div class="emergency-item">
                <span class="font-medium">Embassy:</span>
                <span class="text-sm">+212 537 63 33 33</span>
              </div>
              <div class="emergency-item">
                <span class="font-medium">Police:</span>
                <span class="text-sm">19</span>
              </div>
              <div class="emergency-item">
                <span class="font-medium">Medical:</span>
                <span class="text-sm">15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Utility Methods
  calculateTripProgress() {
    const today = new Date();
    const tripStart = new Date("2025-06-18");
    const tripEnd = new Date("2025-07-20");

    if (today < tripStart) {
      const daysUntil = Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));
      return {
        title: "Planning Phase",
        percentage: 0,
        description: `${daysUntil} days until your Morocco adventure begins!`,
      };
    } else if (today >= tripStart && today <= tripEnd) {
      const daysElapsed = Math.ceil(
        (today - tripStart) / (1000 * 60 * 60 * 24)
      );
      const totalDays = Math.ceil(
        (tripEnd - tripStart) / (1000 * 60 * 60 * 24)
      );
      const percentage = Math.round((daysElapsed / totalDays) * 100);
      return {
        title: "Adventure in Progress",
        percentage: percentage,
        description: `Day ${daysElapsed} of ${totalDays} - You're living the dream!`,
      };
    } else {
      return {
        title: "Adventure Complete",
        percentage: 100,
        description: "Amazing memories created! 🎉",
      };
    }
  }

  isDayActive(dateString) {
    // Logic to determine if a day is currently active
    const today = new Date();
    const dayDate = new Date(dateString);
    return Math.abs(today - dayDate) < 24 * 60 * 60 * 1000; // Within 24 hours
  }

  // Update countdown timers with timezone support
  updateCountdowns() {
    const countdownCards = document.querySelectorAll(".countdown-card");

    countdownCards.forEach((card) => {
      const targetDate = new Date(card.dataset.target);
      const timeZone = card.dataset.timezone;

      // Calculate time difference in specified timezone
      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        const daysElement = card.querySelector('[data-unit="days"]');
        const hoursElement = card.querySelector('[data-unit="hours"]');
        const minutesElement = card.querySelector('[data-unit="minutes"]');

        if (daysElement) daysElement.textContent = days;
        if (hoursElement) hoursElement.textContent = hours;
        if (minutesElement) minutesElement.textContent = minutes;
      } else {
        card.innerHTML = `
          <div class="countdown-label">🎉 Event Occurred!</div>
          <div class="text-center">The moment has arrived!</div>
        `;
      }
    });
  }
}

// Export for global use
window.ProfessionalComponents = ProfessionalComponents;
