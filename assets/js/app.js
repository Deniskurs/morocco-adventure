// Component-Based Morocco Adventure Dashboard
class MoroccoAdventureApp {
  constructor() {
    this.weatherService = null;
    this.weatherWidget = null;
    this.mapsService = null;
    this.isInitialized = false;
    this.updateInterval = null;
  }

  // Initialize the application
  async init() {
    try {
      console.log("🚀 Initializing Morocco Adventure Dashboard...");

      // Initialize services
      await this.initializeServices();

      // Render all components
      this.renderComponents();

      // Load enhanced sections
      await this.loadEnhancedSections();

      // Setup event listeners
      this.setupEventListeners();

      // Initialize PWA features
      this.initializePWA();

      // Start real-time updates
      this.startRealTimeUpdates();

      this.isInitialized = true;
      console.log("✅ Morocco Adventure Dashboard initialized successfully!");

      // Hide loading screen
      this.hideLoadingScreen();
    } catch (error) {
      console.error("❌ Error initializing app:", error);
      this.showErrorMessage(
        "Failed to initialize dashboard. Some features may not work."
      );
    }
  }

  // Initialize services with API keys
  async initializeServices() {
    const googleMapsKey = API_KEYS.GOOGLE_MAPS || "demo-mode";
    const weatherKey = API_KEYS.OPENWEATHER || "demo-mode";

    // Initialize weather service
    this.weatherService = new WeatherService(weatherKey);
    this.weatherWidget = new WeatherWidget(
      "weather-container",
      this.weatherService
    );

    // Initialize maps service
    this.mapsService = new MapsService(googleMapsKey);

    // Make services globally available for onclick handlers
    window.weatherService = this.weatherService;
    window.mapsService = this.mapsService;
  }

  // Render all components from data
  renderComponents() {
    this.renderStatsGrid();
    this.renderRouteMap();
    this.renderTimeline();
    this.renderCostBreakdown();
    this.renderTransportSchedule();
    this.renderWorkSchedule();
    this.renderAlerts();
    this.renderProgressTracker();
    this.renderCountdownTimers();
  }

  // Render stats grid
  renderStatsGrid() {
    const statsData = [
      {
        value: TripData.trip.totalDays,
        label: "Total Days",
        section: "journey",
      },
      {
        value: TripData.trip.cities,
        label: "Cities",
        section: "map",
      },
      {
        value: TripData.trip.estimatedCost,
        label: "Accommodation",
        section: "cost",
      },
      {
        value: `~${TripData.trip.workDays}`,
        label: "Work Days",
        section: "work",
      },
    ];

    const statsHtml = statsData
      .map((stat) => Components.StatsCard(stat))
      .join("");

    renderComponent("stats-grid", statsHtml);
  }

  // Render route map
  renderRouteMap() {
    const cityNodesHtml = TripData.locations
      .map((location) => Components.CityNode(location))
      .join("");

    const routeMapHtml = `
      <div class="route-line"></div>
      ${cityNodesHtml}
    `;

    renderComponent("route-map", routeMapHtml);
  }

  // Render journey timeline
  renderTimeline() {
    const timelineHtml = `
      <div class="timeline-line"></div>
      ${TripData.itinerary.map((day) => Components.DayCard(day)).join("")}
    `;

    renderComponent("timeline", timelineHtml);
  }

  // Render cost breakdown
  renderCostBreakdown() {
    // Add total calculation
    const costsWithTotal = [
      ...TripData.costs,
      {
        item: "TOTAL (estimate)",
        amount: TripData.trip.estimatedCost,
        status: "total",
      },
    ];

    const costHtml = costsWithTotal
      .map((cost) => Components.CostItem(cost))
      .join("");

    renderComponent("cost-breakdown", costHtml);
  }

  // Render transport schedule
  renderTransportSchedule() {
    const transportHtml = TripData.transport
      .map((transport) => Components.TransportItem(transport))
      .join("");

    renderComponent("transport-schedule", transportHtml);
  }

  // Render work schedule
  renderWorkSchedule() {
    // Add total to work schedule
    const workWithTotal = [
      ...TripData.workSchedule,
      {
        date: "TOTAL",
        location: "All locations",
        duration: `~${TripData.trip.workDays} work days`,
        details: "",
      },
    ];

    const workHtml = workWithTotal
      .map((work) => Components.WorkPeriod(work))
      .join("");

    renderComponent("work-schedule", workHtml);
  }

  // Render alerts
  renderAlerts() {
    const alertsHtml = TripData.alerts
      .map((alert) => Components.AlertItem(alert))
      .join("");

    renderComponent("alerts-list", alertsHtml);
  }

  // Render progress tracker
  renderProgressTracker() {
    const progressHtml = Components.ProgressTracker(TripData);

    // Insert after header
    const header = document.querySelector(".header");
    const progressDiv = document.createElement("div");
    progressDiv.innerHTML = progressHtml;
    header.parentNode.insertBefore(progressDiv, header.nextSibling);
  }

  // Render countdown timers
  renderCountdownTimers() {
    const countdownSection = document.createElement("section");
    countdownSection.className = "countdown-section";
    countdownSection.innerHTML = `
      <h2 class="section-title">⏰ Live Countdown</h2>
      <div class="countdown-grid">
        ${Components.CountdownTimer("2025-06-18T00:00:00", "🛫 Trip Departure")}
        ${Components.CountdownTimer(
          "2025-07-11T00:00:00",
          "✈️ Omar's NYC Flight"
        )}
      </div>
    `;

    // Insert after progress tracker
    const header = document.querySelector(".header");
    header.parentNode.insertBefore(countdownSection, header.nextSibling);

    // Start countdown updates
    this.updateCountdowns();
    setInterval(() => this.updateCountdowns(), 60000);
  }

  // Update countdown displays
  updateCountdowns() {
    const countdownElements = document.querySelectorAll(".countdown-timer");

    countdownElements.forEach((element) => {
      const targetDate = new Date(element.dataset.target);
      const timeUntil = TravelUtils.getTimeUntil(targetDate);

      if (!timeUntil.expired) {
        const daysElement = element.querySelector(".countdown-days");
        const hoursElement = element.querySelector(".countdown-hours");

        if (daysElement) daysElement.textContent = timeUntil.days;
        if (hoursElement) hoursElement.textContent = timeUntil.hours;
      } else {
        element.querySelector(".countdown-display").innerHTML =
          "<p>🎉 Event has occurred!</p>";
      }
    });
  }

  // Load enhanced sections
  async loadEnhancedSections() {
    await this.loadWeatherDashboard();
    await this.loadInteractiveMap();
    this.loadCollaborationFeatures();
    this.loadUtilityFeatures();
  }

  // Load weather dashboard
  async loadWeatherDashboard() {
    const weatherSection = document.createElement("section");
    weatherSection.className = "weather-dashboard";
    weatherSection.id = "weather-dashboard";
    weatherSection.innerHTML = `
      <h2 class="section-title">🌤️ Weather Center</h2>
      <div class="weather-grid">
        <div id="current-weather" class="weather-section">
          <h3>Current Conditions</h3>
          <div id="current-weather-content" class="weather-loading">Loading...</div>
        </div>
        <div id="multi-city-weather" class="weather-section">
          <h3>All Destinations</h3>
          <div id="multi-city-content" class="weather-grid-cities"></div>
        </div>
        <div id="forecast-weather" class="weather-section forecast-section">
          <h3>7-Day Forecast</h3>
          <div id="forecast-content" class="forecast-container"></div>
        </div>
        <div id="weather-recommendations" class="weather-section">
          <h3>Smart Recommendations</h3>
          <div id="recommendations-content" class="recommendations-list"></div>
        </div>
      </div>
    `;

    // Insert after the route map section
    const mapSection = document.getElementById("map");
    mapSection.parentNode.insertBefore(weatherSection, mapSection.nextSibling);

    // Load weather data
    await this.loadWeatherData();
  }

  // Load weather data for all cities
  async loadWeatherData() {
    try {
      // Load multi-city weather
      const multiCityWidgets = await this.weatherWidget.renderMultiCityWeather(
        TripData.locations
      );
      const multiCityContainer = document.getElementById("multi-city-content");
      if (multiCityContainer) {
        multiCityContainer.innerHTML = "";
        multiCityWidgets.forEach((widget) =>
          multiCityContainer.appendChild(widget)
        );
      }

      // Load current location weather (first location for demo)
      const currentLocation = TripData.locations[0];
      const currentWeatherWidget =
        await this.weatherWidget.renderCurrentWeather(
          currentLocation.name,
          currentLocation.coordinates.lat,
          currentLocation.coordinates.lng
        );
      const currentWeatherContent = document.getElementById(
        "current-weather-content"
      );
      if (currentWeatherContent) {
        currentWeatherContent.innerHTML = "";
        currentWeatherContent.appendChild(currentWeatherWidget);
      }
    } catch (error) {
      console.error("Error loading weather data:", error);
      const currentWeatherContent = document.getElementById(
        "current-weather-content"
      );
      if (currentWeatherContent) {
        currentWeatherContent.innerHTML =
          "⚠️ Weather data temporarily unavailable";
      }
    }
  }

  // Load interactive map
  async loadInteractiveMap() {
    const mapContainer = document.getElementById("map");
    const existingRouteMap = mapContainer.querySelector(".route-map");

    if (existingRouteMap) {
      // Create new interactive map container
      const interactiveMapContainer = document.createElement("div");
      interactiveMapContainer.id = "interactive-map";
      interactiveMapContainer.style.height = "500px";
      interactiveMapContainer.style.width = "100%";
      interactiveMapContainer.style.borderRadius = "20px";
      interactiveMapContainer.style.overflow = "hidden";
      interactiveMapContainer.style.marginTop = "20px";

      // Insert after existing route map
      existingRouteMap.parentNode.insertBefore(
        interactiveMapContainer,
        existingRouteMap.nextSibling
      );

      // Initialize Google Maps
      try {
        await this.mapsService.initializeMap(
          "interactive-map",
          TripData.locations
        );

        // Add map controls
        this.addMapControls(mapContainer);
      } catch (error) {
        console.error("Error loading interactive map:", error);
        interactiveMapContainer.innerHTML = `
          <div class="map-error">
            <p>🗺️ Interactive map temporarily unavailable</p>
            <button onclick="window.open('https://goo.gl/maps/morocco')" class="map-action-btn">
              Open in Google Maps
            </button>
          </div>
        `;
      }
    }
  }

  // Add map controls
  addMapControls(container) {
    const controls = document.createElement("div");
    controls.className = "map-controls";
    controls.innerHTML = `
      <div class="map-control-buttons">
        <button onclick="mapsService.highlightCurrentLocation()" class="map-control-btn">
          📍 Current Location
        </button>
        <button onclick="mapsService.openInGoogleMaps()" class="map-control-btn">
          🗺️ Full Map
        </button>
        <button onclick="mapsService.downloadOfflineMap()" class="map-control-btn">
          📱 Offline Info
        </button>
      </div>
    `;
    container.appendChild(controls);
  }

  // Load collaboration features
  loadCollaborationFeatures() {
    this.addCollaborativeNotes();
    this.addSharedPackingList();
    this.addPhotoSharing();
  }

  // Load utility features
  loadUtilityFeatures() {
    this.setupCurrencyConverter();
    this.setupEmergencyInfo();
    this.setupLanguageHelper();
  }

  // Add collaborative notes
  addCollaborativeNotes() {
    const notesSection = document.createElement("section");
    notesSection.className = "notes-section";
    notesSection.innerHTML = `
      <h2 class="section-title">📝 Shared Notes</h2>
      <div class="notes-container">
        <textarea id="shared-notes" placeholder="Add shared notes, ideas, or reminders here..."></textarea>
        <div class="notes-actions">
          <button onclick="app.saveNotes()" class="save-notes-btn">💾 Save Notes</button>
          <button onclick="app.exportNotes()" class="export-notes-btn">📄 Export</button>
        </div>
        <div class="notes-info">
          <p>Last updated: <span id="notes-timestamp">Never</span></p>
        </div>
      </div>
    `;

    // Insert before alerts section
    const alertsSection = document.querySelector(".alerts-section");
    alertsSection.parentNode.insertBefore(notesSection, alertsSection);

    // Load saved notes
    this.loadSavedNotes();
  }

  // Load saved notes
  loadSavedNotes() {
    const savedNotes = TravelUtils.loadFromStorage("shared-notes", "");
    const timestamp = TravelUtils.loadFromStorage("notes-timestamp", "Never");

    const notesElement = document.getElementById("shared-notes");
    const timestampElement = document.getElementById("notes-timestamp");

    if (notesElement) notesElement.value = savedNotes;
    if (timestampElement) timestampElement.textContent = timestamp;
  }

  // Save notes
  saveNotes() {
    const notesElement = document.getElementById("shared-notes");
    const timestampElement = document.getElementById("notes-timestamp");

    if (!notesElement) return;

    const notes = notesElement.value;
    const timestamp = new Date().toLocaleString();

    TravelUtils.saveToStorage("shared-notes", notes);
    TravelUtils.saveToStorage("notes-timestamp", timestamp);

    if (timestampElement) {
      timestampElement.textContent = timestamp;
    }

    TravelUtils.showNotification("Notes Saved", {
      body: "Your shared notes have been saved locally",
      icon: "📝",
    });
  }

  // Export notes
  exportNotes() {
    const notesElement = document.getElementById("shared-notes");
    if (!notesElement) return;

    const notes = notesElement.value;
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "morocco-adventure-notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Add shared packing list
  addSharedPackingList() {
    const packingSection = document.createElement("section");
    packingSection.className = "packing-section";
    packingSection.innerHTML = `
      <h2 class="section-title">🎒 Shared Packing List</h2>
      <div class="packing-container">
        <div class="packing-categories">
          ${this.createPackingCategory("clothing", "👕 Clothing")}
          ${this.createPackingCategory("toiletries", "🧴 Toiletries")}
          ${this.createPackingCategory("electronics", "📱 Electronics")}
          ${this.createPackingCategory("other", "📋 Other")}
        </div>
      </div>
    `;

    // Insert before notes section
    const notesSection = document.querySelector(".notes-section");
    notesSection.parentNode.insertBefore(packingSection, notesSection);

    // Load saved packing list
    this.loadPackingList();
  }

  // Create packing category HTML
  createPackingCategory(category, title) {
    return `
      <div class="packing-category">
        <h3>${title}</h3>
        <div id="${category}-list" class="packing-list"></div>
        <div class="add-item">
          <input type="text" id="${category}-input" placeholder="Add ${category} item...">
          <button onclick="app.addPackingItem('${category}')">Add</button>
        </div>
      </div>
    `;
  }

  // Load packing list from storage
  loadPackingList() {
    const categories = ["clothing", "toiletries", "electronics", "other"];
    categories.forEach((category) => {
      const items = TravelUtils.loadFromStorage(`packing-${category}`, []);
      const container = document.getElementById(`${category}-list`);
      if (container) {
        container.innerHTML = "";
        items.forEach((item) => this.renderPackingItem(category, item));
      }
    });
  }

  // Add packing item
  addPackingItem(category) {
    const input = document.getElementById(`${category}-input`);
    if (!input) return;

    const itemText = input.value.trim();
    if (!itemText) return;

    const item = {
      id: Date.now(),
      text: itemText,
      packed: false,
      addedBy: "User",
    };

    // Save to storage
    const items = TravelUtils.loadFromStorage(`packing-${category}`, []);
    items.push(item);
    TravelUtils.saveToStorage(`packing-${category}`, items);

    // Render item
    this.renderPackingItem(category, item);

    // Clear input
    input.value = "";
  }

  // Render packing item
  renderPackingItem(category, item) {
    const container = document.getElementById(`${category}-list`);
    if (!container) return;

    const itemElement = document.createElement("div");
    itemElement.className = `packing-item ${item.packed ? "packed" : ""}`;
    itemElement.innerHTML = `
      <input type="checkbox" ${
        item.packed ? "checked" : ""
      } onchange="app.togglePackingItem('${category}', ${item.id})">
      <span class="item-text">${item.text}</span>
      <button class="remove-item" onclick="app.removePackingItem('${category}', ${
      item.id
    })">×</button>
    `;
    container.appendChild(itemElement);
  }

  // Toggle packing item
  togglePackingItem(category, itemId) {
    const items = TravelUtils.loadFromStorage(`packing-${category}`, []);
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.packed = !item.packed;
      TravelUtils.saveToStorage(`packing-${category}`, items);
      this.loadPackingList();
    }
  }

  // Remove packing item
  removePackingItem(category, itemId) {
    const items = TravelUtils.loadFromStorage(`packing-${category}`, []);
    const filteredItems = items.filter((i) => i.id !== itemId);
    TravelUtils.saveToStorage(`packing-${category}`, filteredItems);
    this.loadPackingList();
  }

  // Add photo sharing (placeholder for future implementation)
  addPhotoSharing() {
    console.log("Photo sharing feature ready for implementation");
  }

  // Setup currency converter
  setupCurrencyConverter() {
    const converterSection = document.createElement("section");
    converterSection.className = "currency-converter-section";
    converterSection.innerHTML = `
      <h2 class="section-title">💱 Currency Converter</h2>
      <div class="currency-converter">
        <div class="converter-input">
          <input type="number" id="amount" placeholder="Amount" value="100">
          <select id="fromCurrency">
            <option value="GBP" selected>GBP (£)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <div class="converter-arrow">→</div>
        <div class="converter-output">
          <div id="convertedAmount" class="converted-amount">0.00</div>
          <select id="toCurrency">
            <option value="MAD" selected>MAD (Dirham)</option>
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
        <button id="convertBtn" class="convert-btn">Convert</button>
      </div>
      <div class="exchange-rate-info">
        <p id="exchangeRateInfo">Click convert to see current rates</p>
        <p class="rate-disclaimer">Rates updated daily • For reference only</p>
      </div>
    `;

    // Insert before cost section
    const costSection = document.getElementById("cost");
    costSection.parentNode.insertBefore(converterSection, costSection);

    // Setup converter functionality
    this.setupCurrencyConverterEvents();
  }

  // Setup currency converter events
  setupCurrencyConverterEvents() {
    const convertBtn = document.getElementById("convertBtn");
    const amountInput = document.getElementById("amount");

    if (!convertBtn || !amountInput) return;

    const convertCurrency = async () => {
      const amount = parseFloat(amountInput.value) || 0;
      const fromCurrency = document.getElementById("fromCurrency").value;
      const toCurrency = document.getElementById("toCurrency").value;

      if (amount === 0) return;

      try {
        convertBtn.textContent = "Converting...";
        const result = await TravelUtils.convertCurrency(
          amount,
          fromCurrency,
          toCurrency
        );
        const convertedAmountElement =
          document.getElementById("convertedAmount");
        const exchangeRateInfoElement =
          document.getElementById("exchangeRateInfo");

        if (convertedAmountElement) {
          convertedAmountElement.textContent = `${result} ${toCurrency}`;
        }
        if (exchangeRateInfoElement) {
          exchangeRateInfoElement.textContent = `1 ${fromCurrency} = ${(
            result / amount
          ).toFixed(4)} ${toCurrency}`;
        }
      } catch (error) {
        const convertedAmountElement =
          document.getElementById("convertedAmount");
        const exchangeRateInfoElement =
          document.getElementById("exchangeRateInfo");

        if (convertedAmountElement)
          convertedAmountElement.textContent = "Error";
        if (exchangeRateInfoElement)
          exchangeRateInfoElement.textContent = "Rate unavailable";
      } finally {
        convertBtn.textContent = "Convert";
      }
    };

    convertBtn.addEventListener("click", convertCurrency);
    amountInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") convertCurrency();
    });

    // Auto-convert on page load
    setTimeout(convertCurrency, 1000);
  }

  // Setup emergency info (placeholder)
  setupEmergencyInfo() {
    console.log("Emergency info feature ready");
  }

  // Setup language helper (placeholder)
  setupLanguageHelper() {
    console.log("Language helper feature ready");
  }

  // Start real-time updates
  startRealTimeUpdates() {
    // Update every 5 minutes
    this.updateInterval = setInterval(() => {
      if (this.isInitialized) {
        this.updateRealTimeData();
      }
    }, 5 * 60 * 1000);
  }

  // Update real-time data
  async updateRealTimeData() {
    try {
      // Update weather data
      if (this.weatherService) {
        await this.loadWeatherData();
      }

      // Update countdowns
      this.updateCountdowns();
    } catch (error) {
      console.error("Error updating real-time data:", error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            this.saveNotes();
            break;
          case "m":
            e.preventDefault();
            if (this.mapsService?.openInGoogleMaps) {
              this.mapsService.openInGoogleMaps();
            }
            break;
        }
      }
    });

    // Setup scroll animations
    this.setupScrollAnimations();
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
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe sections for animations
    setTimeout(() => {
      document
        .querySelectorAll("section, .day-card, .stat-card")
        .forEach((section) => {
          observer.observe(section);
        });
    }, 1000);
  }

  // Initialize PWA features
  initializePWA() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.log("Service Worker not available:", error);
      });
    }

    // Add to home screen prompt
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
        <button onclick="app.installPWA()" class="install-btn">Install</button>
        <button onclick="this.parentElement.parentElement.remove()" class="dismiss-btn">×</button>
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

      // Remove install banner
      const banner = document.querySelector(".install-banner");
      if (banner) banner.remove();
    }
  }

  // Hide loading screen
  hideLoadingScreen() {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 500);
    }
  }

  // Show error message
  showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <div class="error-content">
        <span>⚠️ ${message}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    document.body.appendChild(errorDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 10000);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.app = new MoroccoAdventureApp();
  window.app.init();
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = MoroccoAdventureApp;
}
