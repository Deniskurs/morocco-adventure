// Main Application Controller
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

      // Setup UI components
      this.setupUIComponents();

      // Load enhanced sections
      await this.loadEnhancedSections();

      // Start real-time updates
      this.startRealTimeUpdates();

      // Setup event listeners
      this.setupEventListeners();

      // Initialize PWA features
      this.initializePWA();

      // Setup offline/online detection
      this.setupNetworkDetection();

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
    // Note: In production, these should come from environment variables
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

  // Setup UI components and interactions
  setupUIComponents() {
    // Enhanced stats cards with live data
    this.enhanceStatsCards();

    // Dynamic countdown timers
    this.setupCountdownTimers();

    // Enhanced day cards with real-time features
    this.enhanceDayCards();

    // Smart notifications
    this.setupSmartNotifications();

    // Currency converter
    this.setupCurrencyConverter();

    // Emergency info modal
    this.setupEmergencyInfo();

    // Language helper
    this.setupLanguageHelper();
  }

  // Load enhanced sections
  async loadEnhancedSections() {
    // Load weather dashboard
    await this.loadWeatherDashboard();

    // Load interactive map
    await this.loadInteractiveMap();

    // Load real-time travel updates
    this.loadTravelUpdates();

    // Load smart recommendations
    this.loadSmartRecommendations();

    // Load collaboration features
    this.loadCollaborationFeatures();
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
      multiCityContainer.innerHTML = "";
      multiCityWidgets.forEach((widget) =>
        multiCityContainer.appendChild(widget)
      );

      // Load current location weather (first location for demo)
      const currentLocation = TripData.locations[0];
      const currentWeatherWidget =
        await this.weatherWidget.renderCurrentWeather(
          currentLocation.name,
          currentLocation.coordinates.lat,
          currentLocation.coordinates.lng
        );
      document.getElementById("current-weather-content").innerHTML = "";
      document
        .getElementById("current-weather-content")
        .appendChild(currentWeatherWidget);

      // Load forecast for main destination
      const forecastWidget = await this.weatherWidget.renderForecast(
        "Marrakesh",
        31.6295,
        -7.9811
      );
      document.getElementById("forecast-content").innerHTML = "";
      document.getElementById("forecast-content").appendChild(forecastWidget);

      // Load weather recommendations
      const marrakeshWeather = await this.weatherService.getCurrentWeather(
        "Marrakesh",
        31.6295,
        -7.9811
      );
      const recommendations =
        this.weatherService.getWeatherRecommendations(marrakeshWeather);
      this.displayWeatherRecommendations(recommendations);
    } catch (error) {
      console.error("Error loading weather data:", error);
      document.getElementById("current-weather-content").innerHTML =
        "⚠️ Weather data temporarily unavailable";
    }
  }

  // Display weather recommendations
  displayWeatherRecommendations(recommendations) {
    const container = document.getElementById("recommendations-content");
    if (recommendations.length === 0) {
      container.innerHTML =
        "<p>✅ Current conditions look good for travel!</p>";
      return;
    }

    container.innerHTML = recommendations
      .map(
        (rec) => `
      <div class="recommendation-item ${rec.type}">
        <span class="rec-icon">${rec.icon}</span>
        <span class="rec-message">${rec.message}</span>
      </div>
    `
      )
      .join("");
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

        // Highlight current location if trip is active
        setTimeout(() => this.mapsService.highlightCurrentLocation(), 2000);
      } catch (error) {
        console.error("Error loading interactive map:", error);
        interactiveMapContainer.innerHTML = `
          <div class="map-error">
            <p>🗺️ Interactive map temporarily unavailable</p>
            <button onclick="mapsService.openInGoogleMaps()" class="map-action-btn">
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

  // Enhanced stats cards
  enhanceStatsCards() {
    const statsCards = document.querySelectorAll(".stat-card");
    statsCards.forEach((card, index) => {
      // Add real-time data updates
      const valueElement = card.querySelector(".stat-value");
      const originalValue = valueElement.textContent;

      // Add animation on hover
      card.addEventListener("mouseenter", () => {
        if (index === 0) {
          // Days remaining animation
          const tripStart = new Date("2025-06-18");
          const today = new Date();
          const daysUntil = Math.ceil(
            (tripStart - today) / (1000 * 60 * 60 * 24)
          );
          if (daysUntil > 0) {
            TravelUtils.animateValue(valueElement, 0, daysUntil, 1000);
            card.querySelector(".stat-label").textContent = "Days Until Trip";
          }
        }
      });

      card.addEventListener("mouseleave", () => {
        valueElement.textContent = originalValue;
        card.querySelector(".stat-label").textContent =
          card.querySelector(".stat-label").getAttribute("data-original") ||
          card.querySelector(".stat-label").textContent;
      });

      // Store original label text
      const label = card.querySelector(".stat-label");
      label.setAttribute("data-original", label.textContent);
    });
  }

  // Setup countdown timers
  setupCountdownTimers() {
    const tripStart = new Date("2025-06-18T00:00:00");
    const omarDeparture = new Date("2025-07-11T00:00:00");

    // Create countdown section
    const countdownSection = document.createElement("section");
    countdownSection.className = "countdown-section";
    countdownSection.innerHTML = `
      <h2 class="section-title">⏰ Live Countdown</h2>
      <div class="countdown-grid">
        <div class="countdown-card">
          <h3>🛫 Trip Departure</h3>
          <div id="trip-countdown" class="countdown-display">
            <div class="countdown-item">
              <span class="countdown-number" id="trip-days">0</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number" id="trip-hours">0</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number" id="trip-minutes">0</span>
              <span class="countdown-label">Minutes</span>
            </div>
          </div>
        </div>
        <div class="countdown-card">
          <h3>✈️ Omar's NYC Flight</h3>
          <div id="omar-countdown" class="countdown-display">
            <div class="countdown-item">
              <span class="countdown-number" id="omar-days">0</span>
              <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number" id="omar-hours">0</span>
              <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number" id="omar-minutes">0</span>
              <span class="countdown-label">Minutes</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert after header
    const header = document.querySelector(".header");
    header.parentNode.insertBefore(countdownSection, header.nextSibling);

    // Update countdowns every minute
    this.updateCountdowns(tripStart, omarDeparture);
    setInterval(() => this.updateCountdowns(tripStart, omarDeparture), 60000);
  }

  // Update countdown displays
  updateCountdowns(tripStart, omarDeparture) {
    const tripTime = TravelUtils.getTimeUntil(tripStart);
    const omarTime = TravelUtils.getTimeUntil(omarDeparture);

    if (!tripTime.expired) {
      document.getElementById("trip-days").textContent = tripTime.days;
      document.getElementById("trip-hours").textContent = tripTime.hours;
      document.getElementById("trip-minutes").textContent = tripTime.minutes;
    } else {
      document.getElementById("trip-countdown").innerHTML =
        "<p>🎉 Trip in progress!</p>";
    }

    if (!omarTime.expired) {
      document.getElementById("omar-days").textContent = omarTime.days;
      document.getElementById("omar-hours").textContent = omarTime.hours;
      document.getElementById("omar-minutes").textContent = omarTime.minutes;
    } else {
      document.getElementById("omar-countdown").innerHTML =
        "<p>✈️ Omar has departed!</p>";
    }
  }

  // Enhanced day cards with real-time features
  enhanceDayCards() {
    const dayCards = document.querySelectorAll(".day-card");
    dayCards.forEach((card, index) => {
      const dayData = TripData.itinerary[index];
      if (!dayData) return;

      // Add QR code for bookings
      if (dayData.accommodation && dayData.accommodation.bookingRef) {
        const qrButton = document.createElement("button");
        qrButton.className = "qr-btn";
        qrButton.innerHTML = "📱 QR Code";
        qrButton.onclick = () =>
          this.showQRCode(
            dayData.accommodation.bookingRef,
            dayData.accommodation.name
          );

        const accommodationInfo = card.querySelector(".accommodation-info");
        if (accommodationInfo) {
          accommodationInfo.appendChild(qrButton);
        }
      }

      // Add real-time updates for current day
      const today = new Date();
      const dayDate = new Date(dayData.date);
      const isToday = dayDate.toDateString() === today.toDateString();

      if (isToday) {
        card.classList.add("current-day");
        const currentIndicator = document.createElement("div");
        currentIndicator.className = "current-day-indicator";
        currentIndicator.innerHTML = "📍 TODAY";
        card.insertBefore(currentIndicator, card.firstChild);
      }

      // Add time zone display for international locations
      if (dayData.location.includes("→")) {
        const timeZoneDisplay = document.createElement("div");
        timeZoneDisplay.className = "timezone-display";
        timeZoneDisplay.innerHTML = `🕐 Local time: ${TravelUtils.getCurrentTimeInTimezone(
          "Africa/Casablanca"
        )}`;
        card.appendChild(timeZoneDisplay);
      }
    });
  }

  // Show QR code modal
  showQRCode(bookingRef, accommodationName) {
    const qrUrl = TravelUtils.generateQRCode(
      `Booking: ${accommodationName} - Ref: ${bookingRef}`
    );

    const modal = document.createElement("div");
    modal.className = "qr-modal";
    modal.innerHTML = `
      <div class="qr-modal-content">
        <div class="qr-modal-header">
          <h3>📱 Booking QR Code</h3>
          <button class="qr-modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="qr-modal-body">
          <img src="${qrUrl}" alt="QR Code" class="qr-code-image">
          <p><strong>${accommodationName}</strong></p>
          <p>Booking Reference: ${bookingRef}</p>
          <p class="qr-instructions">Scan with your phone camera to save booking details</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 10000);
  }

  // Setup smart notifications
  setupSmartNotifications() {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Check for urgent alerts
    const urgentAlerts = TripData.alerts.filter(
      (alert) => alert.priority === "high"
    );
    if (urgentAlerts.length > 0) {
      urgentAlerts.forEach((alert) => {
        TravelUtils.showNotification(`🚨 ${alert.title}`, {
          body: alert.description,
          icon: "⚠️",
          tag: alert.title,
        });
      });
    }

    // Setup reminder notifications for upcoming events
    this.setupReminderNotifications();
  }

  // Setup reminder notifications
  setupReminderNotifications() {
    const now = new Date();
    const tripStart = new Date("2025-06-18");

    // 7 days before trip
    const sevenDaysBefore = new Date(tripStart);
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7);

    if (now >= sevenDaysBefore && now < tripStart) {
      TravelUtils.showNotification("🎒 Pack Soon!", {
        body: "Your Morocco adventure starts in less than a week!",
        icon: "🧳",
      });
    }

    // Day before trip
    const dayBefore = new Date(tripStart);
    dayBefore.setDate(dayBefore.getDate() - 1);

    if (now.toDateString() === dayBefore.toDateString()) {
      TravelUtils.showNotification("✈️ Tomorrow's the Day!", {
        body: "Final preparations for your Morocco adventure!",
        icon: "🎉",
      });
    }
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
        document.getElementById(
          "convertedAmount"
        ).textContent = `${result} ${toCurrency}`;
        document.getElementById(
          "exchangeRateInfo"
        ).textContent = `1 ${fromCurrency} = ${(result / amount).toFixed(
          4
        )} ${toCurrency}`;
      } catch (error) {
        document.getElementById("convertedAmount").textContent = "Error";
        document.getElementById("exchangeRateInfo").textContent =
          "Rate unavailable";
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

  // Setup emergency info
  setupEmergencyInfo() {
    const emergencySection = document.createElement("section");
    emergencySection.className = "emergency-section";
    emergencySection.innerHTML = `
      <h2 class="section-title">🚨 Emergency Information</h2>
      <div class="emergency-grid">
        <div class="emergency-card" onclick="app.toggleEmergencyDetails('police')">
          <div class="emergency-icon">👮</div>
          <h3>Police</h3>
          <p class="emergency-number">19</p>
        </div>
        <div class="emergency-card" onclick="app.toggleEmergencyDetails('medical')">
          <div class="emergency-icon">🚑</div>
          <h3>Medical</h3>
          <p class="emergency-number">15</p>
        </div>
        <div class="emergency-card" onclick="app.toggleEmergencyDetails('embassy')">
          <div class="emergency-icon">🏛️</div>
          <h3>Embassy</h3>
          <p class="emergency-number">UK/US</p>
        </div>
        <div class="emergency-card" onclick="app.toggleEmergencyDetails('tourist')">
          <div class="emergency-icon">ℹ️</div>
          <h3>Tourist Police</h3>
          <p class="emergency-number">+212 537...</p>
        </div>
      </div>
      <div id="emergency-details" class="emergency-details hidden"></div>
    `;

    // Insert before alerts section
    const alertsSection = document.querySelector(".alerts-section");
    alertsSection.parentNode.insertBefore(emergencySection, alertsSection);
  }

  // Toggle emergency details
  toggleEmergencyDetails(type) {
    const detailsDiv = document.getElementById("emergency-details");
    const emergencyInfo = TravelUtils.getEmergencyInfo();

    let content = "";
    switch (type) {
      case "police":
        content = `
          <h4>🚔 Police Services</h4>
          <p><strong>Emergency:</strong> ${emergencyInfo.morocco.police}</p>
          <p><strong>Tourist Police:</strong> ${emergencyInfo.morocco.tourist_police}</p>
        `;
        break;
      case "medical":
        content = `
          <h4>🏥 Medical Services</h4>
          <p><strong>Ambulance:</strong> ${emergencyInfo.morocco.ambulance}</p>
          <p><strong>Marrakech:</strong> ${emergencyInfo.hospitals.marrakech}</p>
          <p><strong>Agadir:</strong> ${emergencyInfo.hospitals.agadir}</p>
          <p><strong>Casablanca:</strong> ${emergencyInfo.hospitals.casablanca}</p>
        `;
        break;
      case "embassy":
        content = `
          <h4>🏛️ Embassy Contacts</h4>
          <p><strong>UK Embassy:</strong> ${emergencyInfo.embassies.uk}</p>
          <p><strong>US Embassy:</strong> ${emergencyInfo.embassies.us}</p>
        `;
        break;
      case "tourist":
        content = `
          <h4>ℹ️ Tourist Information</h4>
          <p><strong>Tourist Police:</strong> ${emergencyInfo.morocco.tourist_police}</p>
          <p>Available 24/7 for tourist assistance</p>
        `;
        break;
    }

    detailsDiv.innerHTML = content;
    detailsDiv.classList.toggle("hidden");
  }

  // Setup language helper
  setupLanguageHelper() {
    const phrases = TravelUtils.getLocalPhrases();

    const languageSection = document.createElement("section");
    languageSection.className = "language-section";
    languageSection.innerHTML = `
      <h2 class="section-title">🗣️ Language Helper</h2>
      <div class="language-tabs">
        <button class="language-tab active" onclick="app.switchLanguage('arabic')">العربية Arabic</button>
        <button class="language-tab" onclick="app.switchLanguage('french')">Français French</button>
      </div>
      <div id="phrases-container" class="phrases-container">
        ${this.generatePhrasesHTML(phrases.arabic)}
      </div>
    `;

    // Insert before Omar departure section
    const omarSection = document.querySelector(".omar-section");
    omarSection.parentNode.insertBefore(languageSection, omarSection);
  }

  // Generate phrases HTML
  generatePhrasesHTML(phrases) {
    return Object.entries(phrases)
      .map(
        ([key, phrase]) => `
      <div class="phrase-item">
        <div class="phrase-english">${
          key.charAt(0).toUpperCase() + key.slice(1)
        }</div>
        <div class="phrase-translation">${phrase}</div>
        <button class="phrase-play" onclick="app.playPhrase('${phrase
          .split("(")[0]
          .trim()}')">🔊</button>
      </div>
    `
      )
      .join("");
  }

  // Switch language in helper
  switchLanguage(language) {
    const phrases = TravelUtils.getLocalPhrases();
    const container = document.getElementById("phrases-container");
    const tabs = document.querySelectorAll(".language-tab");

    // Update active tab
    tabs.forEach((tab) => tab.classList.remove("active"));
    document
      .querySelector(`[onclick="app.switchLanguage('${language}')"]`)
      .classList.add("active");

    // Update phrases
    container.innerHTML = this.generatePhrasesHTML(phrases[language]);
  }

  // Play phrase using speech synthesis
  playPhrase(text) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar"; // Arabic
      speechSynthesis.speak(utterance);
    }
  }

  // Load collaboration features
  loadCollaborationFeatures() {
    // Add collaborative notes
    this.addCollaborativeNotes();

    // Add shared packing list
    this.addSharedPackingList();

    // Add photo sharing
    this.addPhotoSharing();
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

    // Insert before alerts
    const alertsSection = document.querySelector(".alerts-section");
    alertsSection.parentNode.insertBefore(notesSection, alertsSection);

    // Load saved notes
    this.loadSavedNotes();
  }

  // Load saved notes
  loadSavedNotes() {
    const savedNotes = TravelUtils.loadFromStorage("shared-notes", "");
    const timestamp = TravelUtils.loadFromStorage("notes-timestamp", "Never");

    document.getElementById("shared-notes").value = savedNotes;
    document.getElementById("notes-timestamp").textContent = timestamp;
  }

  // Save notes
  saveNotes() {
    const notes = document.getElementById("shared-notes").value;
    const timestamp = new Date().toLocaleString();

    TravelUtils.saveToStorage("shared-notes", notes);
    TravelUtils.saveToStorage("notes-timestamp", timestamp);

    document.getElementById("notes-timestamp").textContent = timestamp;

    TravelUtils.showNotification("Notes Saved", {
      body: "Your shared notes have been saved locally",
      icon: "📝",
    });
  }

  // Export notes
  exportNotes() {
    const notes = document.getElementById("shared-notes").value;
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
          <div class="packing-category">
            <h3>👕 Clothing</h3>
            <div id="clothing-list" class="packing-list"></div>
            <div class="add-item">
              <input type="text" id="clothing-input" placeholder="Add clothing item...">
              <button onclick="app.addPackingItem('clothing')">Add</button>
            </div>
          </div>
          <div class="packing-category">
            <h3>🧴 Toiletries</h3>
            <div id="toiletries-list" class="packing-list"></div>
            <div class="add-item">
              <input type="text" id="toiletries-input" placeholder="Add toiletry item...">
              <button onclick="app.addPackingItem('toiletries')">Add</button>
            </div>
          </div>
          <div class="packing-category">
            <h3>📱 Electronics</h3>
            <div id="electronics-list" class="packing-list"></div>
            <div class="add-item">
              <input type="text" id="electronics-input" placeholder="Add electronic item...">
              <button onclick="app.addPackingItem('electronics')">Add</button>
            </div>
          </div>
          <div class="packing-category">
            <h3>📋 Other</h3>
            <div id="other-list" class="packing-list"></div>
            <div class="add-item">
              <input type="text" id="other-input" placeholder="Add other item...">
              <button onclick="app.addPackingItem('other')">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert before language section
    const languageSection = document.querySelector(".language-section");
    languageSection.parentNode.insertBefore(packingSection, languageSection);

    // Load saved packing list
    this.loadPackingList();
  }

  // Load packing list from storage
  loadPackingList() {
    const categories = ["clothing", "toiletries", "electronics", "other"];
    categories.forEach((category) => {
      const items = TravelUtils.loadFromStorage(`packing-${category}`, []);
      const container = document.getElementById(`${category}-list`);
      container.innerHTML = "";
      items.forEach((item) => this.renderPackingItem(category, item));
    });
  }

  // Add packing item
  addPackingItem(category) {
    const input = document.getElementById(`${category}-input`);
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

  // Add photo sharing
  addPhotoSharing() {
    const photoSection = document.createElement("section");
    photoSection.className = "photo-section";
    photoSection.innerHTML = `
      <h2 class="section-title">📸 Trip Photos</h2>
      <div class="photo-container">
        <div class="photo-upload">
          <input type="file" id="photo-input" accept="image/*" multiple style="display: none;">
          <button onclick="document.getElementById('photo-input').click()" class="upload-btn">
            📷 Add Photos
          </button>
        </div>
        <div id="photo-gallery" class="photo-gallery"></div>
      </div>
    `;

    // Insert before notes section
    const notesSection = document.querySelector(".notes-section");
    notesSection.parentNode.insertBefore(photoSection, notesSection);

    // Setup photo upload
    this.setupPhotoUpload();
  }

  // Setup photo upload
  setupPhotoUpload() {
    const photoInput = document.getElementById("photo-input");
    photoInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => this.processPhoto(file));
    });

    // Load existing photos
    this.loadPhotos();
  }

  // Process uploaded photo
  processPhoto(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photo = {
        id: Date.now() + Math.random(),
        src: e.target.result,
        name: file.name,
        timestamp: new Date().toISOString(),
      };

      // Save to storage
      const photos = TravelUtils.loadFromStorage("trip-photos", []);
      photos.push(photo);
      TravelUtils.saveToStorage("trip-photos", photos);

      // Render photo
      this.renderPhoto(photo);
    };
    reader.readAsDataURL(file);
  }

  // Load photos from storage
  loadPhotos() {
    const photos = TravelUtils.loadFromStorage("trip-photos", []);
    const gallery = document.getElementById("photo-gallery");
    gallery.innerHTML = "";
    photos.forEach((photo) => this.renderPhoto(photo));
  }

  // Render photo in gallery
  renderPhoto(photo) {
    const gallery = document.getElementById("photo-gallery");
    const photoElement = document.createElement("div");
    photoElement.className = "photo-item";
    photoElement.innerHTML = `
      <img src="${photo.src}" alt="${photo.name}" onclick="app.showPhotoModal('${photo.id}')">
      <div class="photo-info">
        <span class="photo-name">${photo.name}</span>
        <button class="delete-photo" onclick="app.deletePhoto('${photo.id}')">🗑️</button>
      </div>
    `;
    gallery.appendChild(photoElement);
  }

  // Show photo in modal
  showPhotoModal(photoId) {
    const photos = TravelUtils.loadFromStorage("trip-photos", []);
    const photo = photos.find((p) => p.id == photoId);
    if (!photo) return;

    const modal = document.createElement("div");
    modal.className = "photo-modal";
    modal.innerHTML = `
      <div class="photo-modal-content">
        <button class="photo-modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
        <img src="${photo.src}" alt="${photo.name}">
        <div class="photo-modal-info">
          <h3>${photo.name}</h3>
          <p>Added: ${new Date(photo.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Delete photo
  deletePhoto(photoId) {
    if (!confirm("Delete this photo?")) return;

    const photos = TravelUtils.loadFromStorage("trip-photos", []);
    const filteredPhotos = photos.filter((p) => p.id != photoId);
    TravelUtils.saveToStorage("trip-photos", filteredPhotos);
    this.loadPhotos();
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

      // Update time displays
      this.updateTimeDisplays();

      // Update trip progress
      this.updateTripProgress();
    } catch (error) {
      console.error("Error updating real-time data:", error);
    }
  }

  // Update time displays
  updateTimeDisplays() {
    const timeElements = document.querySelectorAll(".timezone-display");
    timeElements.forEach((element) => {
      element.innerHTML = `🕐 Local time: ${TravelUtils.getCurrentTimeInTimezone(
        "Africa/Casablanca"
      )}`;
    });
  }

  // Update trip progress
  updateTripProgress() {
    const progress = TravelUtils.calculateTripProgress();

    // Update progress indicators if they exist
    const progressElements = document.querySelectorAll(".trip-progress");
    progressElements.forEach((element) => {
      element.textContent = `${progress.progress}% complete`;
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Route calculation listener
    window.addEventListener("routeCalculated", (event) => {
      console.log("Route calculated:", event.detail);
      // Update UI with route information
    });

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
            this.mapsService?.openInGoogleMaps();
            break;
        }
      }
    });

    // Scroll animations
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

    // Observe new sections
    document
      .querySelectorAll(
        ".weather-dashboard, .countdown-section, .currency-converter-section"
      )
      .forEach((section) => {
        observer.observe(section);
      });
  }

  // Initialize PWA features
  initializePWA() {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
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

  // Setup network detection
  setupNetworkDetection() {
    const updateOnlineStatus = () => {
      const statusIndicator = document.createElement("div");
      statusIndicator.className = `network-status ${
        navigator.onLine ? "online" : "offline"
      }`;
      statusIndicator.innerHTML = navigator.onLine ? "🟢 Online" : "🔴 Offline";

      // Remove existing indicator
      const existing = document.querySelector(".network-status");
      if (existing) existing.remove();

      // Add new indicator
      document.body.appendChild(statusIndicator);

      // Auto-remove online indicator after 3 seconds
      if (navigator.onLine) {
        setTimeout(() => statusIndicator.remove(), 3000);
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }

  // Load travel updates
  loadTravelUpdates() {
    // This would integrate with travel APIs for real-time updates
    console.log("Travel updates feature ready");
  }

  // Load smart recommendations
  loadSmartRecommendations() {
    // This would provide AI-powered recommendations
    console.log("Smart recommendations feature ready");
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
