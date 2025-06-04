// Professional Morocco Adventure App
// Main application controller with advanced features

class ProfessionalMoroccoApp {
  constructor() {
    this.components = new ProfessionalComponents();
    this.isInitialized = false;
    this.updateInterval = null;
    this.weatherService = null;
    this.locationWatcher = null;
  }

  // Initialize the professional application
  async init() {
    try {
      console.log("🚀 Initializing Professional Morocco Adventure App...");

      // Show loading state
      this.showLoadingState();

      // Initialize core services
      await this.initializeServices();

      // Request location permission (non-blocking)
      this.requestLocation();

      // Render the complete interface
      this.renderApplication();

      // Load dynamic content
      await this.loadDynamicContent();

      // Setup event listeners and interactions
      this.setupEventListeners();

      // Start real-time updates
      this.startRealTimeUpdates();

      // Initialize PWA features
      this.initializePWA();

      this.isInitialized = true;
      console.log(
        "✅ Professional Morocco Adventure App initialized successfully!"
      );

      // Hide loading and show app
      this.hideLoadingState();

      // Force hide loading after 2 seconds as fallback
      setTimeout(() => {
        this.forceHideLoading();
      }, 2000);
    } catch (error) {
      console.error("❌ Error initializing professional app:", error);
      this.showErrorState(error.message);
      // Force hide loading even on error
      this.forceHideLoading();
    }
  }

  // Initialize core services
  async initializeServices() {
    try {
      // Initialize weather service with API key
      const weatherApiKey = API_KEYS?.OPENWEATHER || "demo-mode";
      this.weatherService = new WeatherService(weatherApiKey);

      // Initialize maps service with API key
      const mapsApiKey = API_KEYS?.GOOGLE_MAPS || "demo-mode";
      this.mapsService = new MapsService(mapsApiKey);

      console.log("🌤️ Weather service initialized");
      console.log("🗺️ Maps service initialized");
    } catch (error) {
      console.warn("⚠️ Services initialization error:", error);
    }
  }

  // Request and track user location (completely non-blocking)
  requestLocation() {
    console.log("📍 Starting background location request...");

    // Start location request in background - don't await it
    setTimeout(async () => {
      try {
        // Make location request with very short timeout
        const locationPromise = this.components.initializeLocation();
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(() => resolve(null), 1000)
        );

        const location = await Promise.race([locationPromise, timeoutPromise]);

        if (location) {
          console.log("✅ Location obtained:", location);
          // Update location-dependent features in background
          this.updateLocationBasedFeatures().catch((e) =>
            console.warn("Location features error:", e)
          );
          this.startLocationTracking();
        } else {
          console.log("ℹ️ Location not available - using fallback features");
        }
      } catch (error) {
        console.warn("⚠️ Location request failed:", error);
      }
    }, 100);

    console.log("📍 Location request started in background");
  }

  // Start tracking location changes
  startLocationTracking() {
    if ("geolocation" in navigator) {
      this.locationWatcher = navigator.geolocation.watchPosition(
        (position) => {
          this.components.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          this.updateLocationBasedFeatures();
        },
        (error) => console.warn("Location tracking error:", error),
        {
          enableHighAccuracy: false,
          maximumAge: 600000, // 10 minutes
          timeout: 10000,
        }
      );
    }
  }

  // Update features that depend on user location
  async updateLocationBasedFeatures() {
    try {
      if (this.components.userLocation && this.weatherService) {
        // Update current location weather
        await this.loadCurrentLocationWeather();

        // Update travel distances
        this.updateTravelDistances();

        // Update timezone information
        this.updateTimezoneInfo();
      }
    } catch (error) {
      console.warn("Error updating location-based features:", error);
    }
  }

  // Render the complete application
  renderApplication() {
    try {
      console.log("🔧 Starting application rendering...");

      const appContainer = document.querySelector(".app-container");
      const mainContent = document.querySelector(".main-content");

      if (!appContainer || !mainContent) {
        throw new Error("Required app containers not found");
      }

      console.log("✅ App containers found");

      // Render navigation header
      console.log("🧭 Rendering navigation header...");
      const headerHTML = this.components.renderNavigationHeader();
      appContainer.insertAdjacentHTML("afterbegin", headerHTML);
      console.log("✅ Navigation header rendered");

      // Render main sections one by one with error handling
      console.log("🏠 Rendering hero section...");
      const heroHTML = this.components.renderHeroSection();
      console.log("✅ Hero section created");

      console.log("⏰ Rendering countdown section...");
      const countdownHTML = this.components.renderCountdownSection();
      console.log("✅ Countdown section created");

      console.log("🌤️ Rendering weather dashboard...");
      const weatherHTML = this.components.renderWeatherDashboard();
      console.log("✅ Weather dashboard created");

      console.log("📅 Rendering timeline section...");
      const timelineHTML = this.components.renderTimelineSection();
      console.log("✅ Timeline section created");

      console.log("🚌 Rendering logistics section...");
      const logisticsHTML = this.components.renderLogisticsSection();
      console.log("✅ Logistics section created");

      console.log("🛠️ Rendering tools section...");
      const toolsHTML = this.components.renderToolsSection();
      console.log("✅ Tools section created");

      // Add interactive map section
      console.log("🗺️ Rendering interactive map section...");
      const mapHTML = this.components.renderInteractiveMapSection();
      console.log("✅ Interactive map section created");

      // Combine all sections
      const sectionsHTML = `
        ${heroHTML}
        ${countdownHTML}
        ${mapHTML}
        ${weatherHTML}
        ${timelineHTML}
        ${logisticsHTML}
        ${toolsHTML}
      `;

      console.log("📝 Setting main content HTML...");
      mainContent.innerHTML = sectionsHTML;

      console.log("🎨 Application interface rendered successfully!");
    } catch (error) {
      console.error("❌ Error rendering application:", error);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }

  // Load dynamic content and data
  async loadDynamicContent() {
    try {
      // Load weather data for all destinations
      await this.loadWeatherData();

      // Initialize Google Maps
      await this.initializeGoogleMaps();

      // Load real-time countdown updates
      this.updateCountdowns();

      // Load saved user data
      this.loadUserData();

      console.log("📊 Dynamic content loaded");
    } catch (error) {
      console.warn("⚠️ Some dynamic content failed to load:", error);
    }
  }

  // Initialize Google Maps
  async initializeGoogleMaps() {
    try {
      if (!this.mapsService) {
        console.warn("Maps service not available");
        return;
      }

      console.log("🗺️ Initializing Google Maps...");

      // Initialize the map with Morocco locations
      await this.mapsService.initializeMap("google-map", TripData.locations);

      console.log("✅ Google Maps initialized successfully");

      // Make maps service globally available for onclick handlers
      window.mapsService = this.mapsService;
    } catch (error) {
      console.warn("⚠️ Google Maps initialization failed:", error);
      this.showMapFallback();
    }
  }

  // Show fallback map when Google Maps fails
  showMapFallback() {
    const mapContainer = document.getElementById("google-map");
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="map-fallback" style="height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 16px;">
          <div style="text-align: center; padding: 40px;">
            <h3>🗺️ Morocco Route Map</h3>
            <p style="margin: 16px 0; opacity: 0.8;">Interactive map temporarily unavailable</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              ${TripData.locations
                .map(
                  (loc) => `
                <div style="background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 20px; margin: 4px;">
                  ${loc.emoji} ${loc.name}
                </div>
              `
                )
                .join("")}
            </div>
            <button class="btn btn-primary btn-sm" onclick="professionalApp.openGoogleMaps()" style="margin-top: 20px;">
              🗺️ Open in Google Maps
            </button>
          </div>
        </div>
      `;
    }
  }

  // Add map interaction method
  highlightCurrentLocation() {
    if (this.mapsService && this.mapsService.highlightCurrentLocation) {
      this.mapsService.highlightCurrentLocation();
    } else {
      this.showNotification("Map feature temporarily unavailable", "info");
    }
  }

  // Load weather data for current location and destinations
  async loadWeatherData() {
    try {
      if (!this.weatherService) return;

      // Load current location weather
      await this.loadCurrentLocationWeather();

      // Load destination weather
      await this.loadDestinationWeather();

      // Generate and display recommendations
      this.updateWeatherRecommendations();

      // Load 7-day forecast
      await this.loadWeatherForecast();
    } catch (error) {
      console.warn("Weather data loading failed:", error);
      this.showWeatherError();
    }
  }

  // Load current location weather
  async loadCurrentLocationWeather() {
    const container = document.getElementById("current-location-weather");
    if (!container || !this.components.userLocation) return;

    try {
      // Mock weather data (replace with real API call)
      const weatherData = await this.generateMockWeather(
        this.components.userLocation.lat,
        this.components.userLocation.lng,
        "Your Location"
      );

      container.innerHTML = this.renderWeatherDisplay(weatherData);
    } catch (error) {
      container.innerHTML =
        '<p class="text-sm opacity-75">Weather unavailable</p>';
    }
  }

  // Load destination weather for all Morocco locations
  async loadDestinationWeather() {
    const weatherCards = document.querySelectorAll(".weather-mini-card");

    for (const card of weatherCards) {
      const locationName = card.dataset.location;
      const location = TripData.locations.find(
        (loc) => loc.name === locationName
      );

      if (location) {
        try {
          const weatherData = await this.generateMockWeather(
            location.coordinates.lat,
            location.coordinates.lng,
            location.name
          );

          const tempElement = card.querySelector(".weather-temp");
          const descElement = card.querySelector(".weather-desc");

          if (tempElement) tempElement.textContent = `${weatherData.temp}°C`;
          if (descElement) descElement.textContent = weatherData.description;
        } catch (error) {
          console.warn(`Weather failed for ${locationName}:`, error);
        }
      }
    }
  }

  // Generate mock weather data (replace with real API)
  async generateMockWeather(lat, lng, location) {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    return {
      location: location,
      temp: Math.round(20 + Math.random() * 15), // 20-35°C
      description: ["sunny", "partly cloudy", "clear", "warm"][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.round(40 + Math.random() * 30), // 40-70%
      windSpeed: Math.round(5 + Math.random() * 10), // 5-15 km/h
      icon: ["☀️", "⛅", "🌤️", "🌞"][Math.floor(Math.random() * 4)],
    };
  }

  // Render weather display
  renderWeatherDisplay(weather) {
    return `
      <div class="weather-display">
        <div class="flex items-center justify-between mb-3">
          <span class="text-lg">${weather.icon}</span>
          <span class="text-2xl font-bold">${weather.temp}°C</span>
        </div>
        <p class="text-sm opacity-75 mb-2">${weather.description}</p>
        <div class="flex justify-between text-xs opacity-75">
          <span>💧 ${weather.humidity}%</span>
          <span>💨 ${weather.windSpeed} km/h</span>
        </div>
      </div>
    `;
  }

  // Update weather recommendations
  updateWeatherRecommendations() {
    const container = document.getElementById("weather-recommendations");
    if (!container) return;

    const recommendations = [
      {
        icon: "🌞",
        message: "Perfect weather for desert tours",
        type: "success",
      },
      {
        icon: "💧",
        message: "Stay hydrated - carry extra water",
        type: "info",
      },
      { icon: "🕶️", message: "Strong UV - bring sunscreen", type: "warning" },
    ];

    const html = recommendations
      .map(
        (rec) => `
      <div class="recommendation-item ${rec.type} mb-2 p-2 rounded-lg">
        <span class="rec-icon mr-2">${rec.icon}</span>
        <span class="rec-message text-sm">${rec.message}</span>
      </div>
    `
      )
      .join("");

    container.innerHTML = html;
  }

  // Load 7-day weather forecast
  async loadWeatherForecast() {
    const container = document.getElementById("weather-forecast");
    if (!container) return;

    const forecast = this.generateMockForecast();

    const html = forecast
      .map(
        (day) => `
      <div class="forecast-day text-center p-2">
        <div class="text-xs opacity-75 mb-1">${day.date}</div>
        <div class="text-lg mb-1">${day.icon}</div>
        <div class="text-sm font-bold">${day.maxTemp}°/${day.minTemp}°</div>
      </div>
    `
      )
      .join("");

    container.innerHTML = `<div class="flex gap-2 overflow-x-auto">${html}</div>`;
  }

  // Generate mock 7-day forecast
  generateMockForecast() {
    const days = ["Today", "Tomorrow", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const icons = ["☀️", "⛅", "🌤️", "☀️", "🌤️", "⛅", "☀️"];

    return days.map((day, index) => ({
      date: day,
      icon: icons[index],
      maxTemp: Math.round(28 + Math.random() * 8), // 28-36°C
      minTemp: Math.round(18 + Math.random() * 5), // 18-23°C
    }));
  }

  // Update countdown timers
  updateCountdowns() {
    this.components.updateCountdowns();
  }

  // Update travel distances based on user location
  updateTravelDistances() {
    if (!this.components.userLocation) return;

    // Calculate distances to Morocco destinations
    TripData.locations.forEach((location) => {
      const distance = this.calculateDistance(
        this.components.userLocation.lat,
        this.components.userLocation.lng,
        location.coordinates.lat,
        location.coordinates.lng
      );

      // Update UI with distance information
      console.log(`Distance to ${location.name}: ${distance.toFixed(0)} km`);
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Update timezone information
  updateTimezoneInfo() {
    const userTZ = this.components.timeZones.user;
    const moroccoTZ = this.components.timeZones.morocco;

    console.log(`User timezone: ${userTZ}, Morocco timezone: ${moroccoTZ}`);

    // Update any timezone-dependent UI elements
    this.updateCountdowns();
  }

  // Load saved user data from localStorage
  loadUserData() {
    try {
      // Load saved notes
      const savedNotes = localStorage.getItem("morocco-notes");
      const notesTextarea = document.querySelector(".notes-textarea");
      if (savedNotes && notesTextarea) {
        notesTextarea.value = savedNotes;
      }

      // Load other saved preferences
      const preferences = localStorage.getItem("morocco-preferences");
      if (preferences) {
        const prefs = JSON.parse(preferences);
        console.log("Loaded user preferences:", prefs);
      }
    } catch (error) {
      console.warn("Error loading user data:", error);
    }
  }

  // Setup event listeners and interactions
  setupEventListeners() {
    // Navigation links
    this.setupNavigationListeners();

    // Interactive elements
    this.setupInteractiveElements();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Scroll animations
    this.setupScrollAnimations();

    console.log("🎮 Event listeners configured");
  }

  // Setup navigation listeners
  setupNavigationListeners() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active state
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        // Smooth scroll to section
        const targetSection = link.dataset.section;
        const section = document.getElementById(targetSection);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Setup interactive elements
  setupInteractiveElements() {
    // Currency converter functionality
    this.setupCurrencyConverter();

    // Notes saving
    this.setupNotesSystem();

    // Expandable details
    this.setupExpandableElements();
  }

  // Setup currency converter
  setupCurrencyConverter() {
    const currencyInput = document.querySelector(".currency-input");
    const currencySelect = document.querySelector(".currency-select");
    const currencyResult = document.querySelector(".currency-result");

    if (currencyInput && currencySelect && currencyResult) {
      const updateConversion = () => {
        const amount = parseFloat(currencyInput.value) || 0;
        const currency = currencySelect.value;

        // Simple conversion rates (use real API in production)
        const rates = {
          GBP: 12.0,
          EUR: 10.5,
          USD: 9.8,
        };

        const madAmount = Math.round(amount * (rates[currency] || 10));
        currencyResult.innerHTML = `
          <div class="text-2xl font-bold">~${madAmount.toLocaleString()} MAD</div>
          <div class="text-xs opacity-75">Moroccan Dirham</div>
        `;
      };

      currencyInput.addEventListener("input", updateConversion);
      currencySelect.addEventListener("change", updateConversion);

      // Initial conversion
      updateConversion();
    }
  }

  // Setup notes system
  setupNotesSystem() {
    const notesTextarea = document.querySelector(".notes-textarea");

    if (notesTextarea) {
      // Auto-save on input
      let saveTimeout;
      notesTextarea.addEventListener("input", () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          this.saveNotes();
        }, 1000); // Auto-save after 1 second of inactivity
      });
    }
  }

  // Save notes to localStorage
  saveNotes() {
    const notesTextarea = document.querySelector(".notes-textarea");
    if (notesTextarea) {
      localStorage.setItem("morocco-notes", notesTextarea.value);
      console.log("📝 Notes saved");

      // Show brief save indicator
      this.showNotification("Notes saved", "success");
    }
  }

  // Setup expandable elements
  setupExpandableElements() {
    const expandButtons = document.querySelectorAll(".expand-details-btn");

    expandButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const details = button.nextElementSibling;
        if (details) {
          details.classList.toggle("hidden");
          button.textContent = details.classList.contains("hidden")
            ? "View Details"
            : "Hide Details";
        }
      });
    });
  }

  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + S to save notes
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        this.saveNotes();
      }

      // Ctrl/Cmd + L to request location
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        this.requestLocation();
      }
    });
  }

  // Setup scroll animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-on-scroll", "visible");
        }
      });
    }, observerOptions);

    // Observe all cards and sections
    setTimeout(() => {
      document
        .querySelectorAll(".card, .section, .countdown-card")
        .forEach((element) => {
          element.classList.add("animate-on-scroll");
          observer.observe(element);
        });
    }, 500);
  }

  // Start real-time updates
  startRealTimeUpdates() {
    // Update countdowns every minute
    this.updateInterval = setInterval(() => {
      if (this.isInitialized) {
        this.updateCountdowns();
      }
    }, 60000);

    // Update weather every 10 minutes
    setInterval(() => {
      if (this.isInitialized && this.weatherService) {
        this.loadWeatherData();
      }
    }, 600000);

    console.log("⏱️ Real-time updates started");
  }

  // Initialize PWA features
  initializePWA() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registered:", registration);
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed:", error);
        });
    }

    // Handle install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.showInstallPrompt(e);
    });
  }

  // Show install prompt
  showInstallPrompt(deferredPrompt) {
    const installBanner = document.createElement("div");
    installBanner.className = "install-banner";
    installBanner.innerHTML = `
      <div class="install-content">
        <span>📱 Install Morocco Adventure for offline access!</span>
        <button class="install-btn" onclick="professionalApp.installPWA()">Install</button>
        <button class="dismiss-btn" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(installBanner);

    this.deferredPrompt = deferredPrompt;
  }

  // Install PWA
  async installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const result = await this.deferredPrompt.userChoice;
      console.log("Install result:", result);
      this.deferredPrompt = null;

      const banner = document.querySelector(".install-banner");
      if (banner) banner.remove();
    }
  }

  // Utility methods
  showLoadingState() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.remove("hidden");
    }
  }

  hideLoadingState() {
    console.log("🎯 Attempting to hide loading state...");
    const loader = document.getElementById("loader");
    if (loader) {
      console.log("✅ Loader element found, adding hidden class");
      loader.classList.add("hidden");
      setTimeout(() => {
        if (loader.parentNode) {
          loader.remove();
        }
      }, 500);
    } else {
      console.warn("⚠️ Loader element not found");
    }
  }

  forceHideLoading() {
    console.log("🚨 Force hiding loading screen...");
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
      if (loader.parentNode) {
        loader.remove();
      }
      console.log("✅ Loading screen forcefully hidden");
    }
  }

  showErrorState(message) {
    console.error("App Error:", message);
    this.showNotification(`Error: ${message}`, "error");
  }

  showWeatherError() {
    const weatherSections = document.querySelectorAll('[id*="weather"]');
    weatherSections.forEach((section) => {
      if (section.querySelector(".loading-shimmer")) {
        section.innerHTML =
          '<p class="text-sm opacity-75">Weather data unavailable</p>';
      }
    });
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("notification-show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  // Public methods for external access
  openCurrencyConverter() {
    const toolsSection = document.getElementById("tools");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  openPackingList() {
    console.log("Opening packing list (feature to be implemented)");
  }

  // Map interaction functions
  openGoogleMaps() {
    const moroccoUrl =
      "https://www.google.com/maps/place/Morocco/@31.7917,-7.0926,6z/data=!3m1!4b1!4m5!3m4!1s0xd0b88619651c58d:0xd9d39381c42cffc3!8m2!3d31.791702!4d-7.09262";
    window.open(moroccoUrl, "_blank");
    console.log("🗺️ Opened Morocco in Google Maps");
  }

  downloadOfflineMap() {
    this.showNotification(
      "Offline map info: Download Google Maps offline for Morocco before traveling",
      "info"
    );
    console.log("📱 Offline map info provided");
  }

  showLocationInfo(locationName) {
    const location = TripData.locations.find(
      (loc) => loc.name === locationName
    );
    if (location) {
      const message = `${location.emoji} ${location.name}: ${location.description}`;
      this.showNotification(message, "info");
      console.log(`📍 Showing info for ${locationName}`);
    }
  }

  // Cleanup method
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    if (this.locationWatcher) {
      navigator.geolocation.clearWatch(this.locationWatcher);
    }

    console.log("🧹 App cleanup completed");
  }
}

// Initialize the professional app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.professionalApp = new ProfessionalMoroccoApp();
  window.professionalApp.init();
});

// Global functions for onclick handlers in HTML
window.scrollToSection = function (sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

window.toggleExpand = function (button) {
  const expandable = button.nextElementSibling;
  if (expandable) {
    expandable.classList.toggle("hidden");
    button.textContent = expandable.classList.contains("hidden")
      ? "View Details"
      : "Hide Details";
  }
};

window.openPackingList = function () {
  if (window.professionalApp) {
    window.professionalApp.showNotification(
      "Opening packing list feature...",
      "info"
    );
    scrollToSection("tools");
  }
};

window.viewAllTransport = function () {
  scrollToSection("logistics");
  const transportSection = document.querySelector(".transport-card");
  if (transportSection) {
    transportSection.style.transform = "scale(1.02)";
    transportSection.style.transition = "transform 0.3s ease";
    setTimeout(() => {
      transportSection.style.transform = "scale(1)";
    }, 2000);
  }
};

window.openCurrencyConverter = function () {
  if (window.professionalApp) {
    window.professionalApp.openCurrencyConverter();
  }
};

window.requestLocation = function () {
  if (window.professionalApp) {
    window.professionalApp.requestLocation();
  }
};

window.saveNotes = function () {
  if (window.professionalApp) {
    window.professionalApp.saveNotes();
  }
};

window.openGoogleMaps = function () {
  if (window.professionalApp) {
    window.professionalApp.openGoogleMaps();
  }
};

window.downloadOfflineMap = function () {
  if (window.professionalApp) {
    window.professionalApp.downloadOfflineMap();
  }
};

window.highlightCurrentLocation = function () {
  if (window.professionalApp) {
    window.professionalApp.highlightCurrentLocation();
  }
};

window.showLocationInfo = function (locationName) {
  if (window.professionalApp) {
    window.professionalApp.showLocationInfo(locationName);
  }
};

window.handleViewAllTransport = function () {
  viewAllTransport();
  if (window.professionalApp) {
    window.professionalApp.showNotification(
      "Viewing all transport options",
      "info"
    );
  }
};

window.handleManagePackingList = function () {
  openPackingList();
  if (window.professionalApp) {
    window.professionalApp.showNotification(
      "Packing list feature coming soon!",
      "info"
    );
  }
};

window.toggleTimelineDetails = function (button, detailsId) {
  const details = document.getElementById(detailsId);
  if (details) {
    const isHidden =
      details.style.display === "none" ||
      getComputedStyle(details).display === "none";

    if (isHidden) {
      details.style.display = "block";
      details.style.opacity = "0";
      details.style.maxHeight = "0";
      details.style.overflow = "hidden";
      details.style.transition = "all 0.3s ease";

      // Force reflow
      details.offsetHeight;

      details.style.opacity = "1";
      details.style.maxHeight = "500px";
      button.textContent = "Hide Details";
    } else {
      details.style.opacity = "0";
      details.style.maxHeight = "0";
      button.textContent = "View Details";

      setTimeout(() => {
        details.style.display = "none";
      }, 300);
    }
  }
};

window.showAllTransport = function () {
  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  `;

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.style.cssText = `
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 24px;
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
    color: white;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  `;

  // Transport list HTML
  const transportListHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2 style="margin: 0; font-size: 1.5rem;">🚌 All Transport Details</h2>
      <button onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
    </div>
    <div class="transport-list">
      ${TripData.transport
        .map(
          (transport) => `
        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span style="font-size: 1.5rem;">${transport.icon}</span>
            <div style="flex: 1;">
              <div style="font-weight: 600;">${transport.route}</div>
              <div style="font-size: 0.875rem; opacity: 0.8;">${
                transport.date
              }</div>
            </div>
            <div style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; background: ${
              transport.booked ? "#00b894" : "#fdcb6e"
            }; color: white;">
              ${transport.booked ? "✅ BOOKED" : "⏳ PENDING"}
            </div>
          </div>
          <div style="font-size: 0.875rem; opacity: 0.9; margin-left: 44px;">
            ${transport.details}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  modalContent.innerHTML = transportListHTML;
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Close on overlay click
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
};

window.openPackingListManager = function () {
  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  `;

  // Load existing packing list from localStorage
  const packingList = JSON.parse(
    localStorage.getItem("morocco-packing-list") || "[]"
  );

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.style.cssText = `
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 20px;
    padding: 24px;
    max-width: 90%;
    max-height: 80%;
    overflow-y: auto;
    color: white;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    min-width: 400px;
  `;

  // Packing list HTML
  const packingListHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <h2 style="margin: 0; font-size: 1.5rem;">🎒 Packing List Manager</h2>
      <button onclick="this.closest('.modal-overlay').remove()" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; font-size: 1.2rem;">×</button>
    </div>
    
    <div style="margin-bottom: 20px;">
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input type="text" id="newPackingItem" placeholder="Add new item..." style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
        <button onclick="addPackingItem()" style="padding: 8px 16px; background: #007AFF; border: none; border-radius: 8px; color: white; cursor: pointer;">Add</button>
      </div>
    </div>

    <div id="packingListContainer">
      ${
        packingList.length === 0
          ? '<p style="text-align: center; opacity: 0.7; margin: 40px 0;">No items yet. Add your first item above!</p>'
          : packingList
              .map(
                (item, index) => `
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
            <input type="checkbox" ${
              item.packed ? "checked" : ""
            } onchange="togglePackingItem(${index})" style="cursor: pointer;">
            <span style="flex: 1; ${
              item.packed ? "text-decoration: line-through; opacity: 0.6;" : ""
            }">${item.name}</span>
            <button onclick="removePackingItem(${index})" style="background: rgba(255,255,255,0.2); border: none; border-radius: 4px; width: 24px; height: 24px; color: white; cursor: pointer; font-size: 0.875rem;">×</button>
          </div>
        `
              )
              .join("")
      }
    </div>
  `;

  modalContent.innerHTML = packingListHTML;
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Close on overlay click
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  });
};

// Packing list management functions
window.addPackingItem = function () {
  const input = document.getElementById("newPackingItem");
  const itemName = input.value.trim();
  if (!itemName) return;

  const packingList = JSON.parse(
    localStorage.getItem("morocco-packing-list") || "[]"
  );
  packingList.push({ name: itemName, packed: false });
  localStorage.setItem("morocco-packing-list", JSON.stringify(packingList));

  input.value = "";
  updatePackingListDisplay();
};

window.togglePackingItem = function (index) {
  const packingList = JSON.parse(
    localStorage.getItem("morocco-packing-list") || "[]"
  );
  packingList[index].packed = !packingList[index].packed;
  localStorage.setItem("morocco-packing-list", JSON.stringify(packingList));
  updatePackingListDisplay();
};

window.removePackingItem = function (index) {
  const packingList = JSON.parse(
    localStorage.getItem("morocco-packing-list") || "[]"
  );
  packingList.splice(index, 1);
  localStorage.setItem("morocco-packing-list", JSON.stringify(packingList));
  updatePackingListDisplay();
};

window.updatePackingListDisplay = function () {
  const container = document.getElementById("packingListContainer");
  const packingList = JSON.parse(
    localStorage.getItem("morocco-packing-list") || "[]"
  );

  if (packingList.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; opacity: 0.7; margin: 40px 0;">No items yet. Add your first item above!</p>';
  } else {
    container.innerHTML = packingList
      .map(
        (item, index) => `
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;">
        <input type="checkbox" ${
          item.packed ? "checked" : ""
        } onchange="togglePackingItem(${index})" style="cursor: pointer;">
        <span style="flex: 1; ${
          item.packed ? "text-decoration: line-through; opacity: 0.6;" : ""
        }">${item.name}</span>
        <button onclick="removePackingItem(${index})" style="background: rgba(255,255,255,0.2); border: none; border-radius: 4px; width: 24px; height: 24px; color: white; cursor: pointer; font-size: 0.875rem;">×</button>
      </div>
    `
      )
      .join("");
  }
};

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProfessionalMoroccoApp;
}
