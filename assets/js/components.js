// Component System for Morocco Adventure Dashboard
// Reusable, data-driven components for flexible content management

const Components = {
  /**
   * Stats Card Component
   */
  StatsCard(data) {
    return `
      <div class="stat-card" onclick="scrollToSection('${data.section}')">
        <div class="stat-value">${data.value}</div>
        <div class="stat-label">${data.label}</div>
      </div>
    `;
  },

  /**
   * Day Card Component for Timeline
   */
  DayCard(dayData) {
    const tagsHtml = dayData.tags
      ? dayData.tags
          .map(
            (tag, index) =>
              `<span class="tag tag-${dayData.tagTypes[index]}">${tag}</span>`
          )
          .join("")
      : "";

    const detailsHtml = dayData.details
      ? `
        <button class="expand-btn" onclick="toggleExpand(this)">View Details</button>
        <div class="expandable">
          <p style="margin-top: 10px; color: #b2bec3;">
            ${dayData.details.join("<br/>")}
          </p>
        </div>
      `
      : "";

    const alertHtml = dayData.alert
      ? `
        <div style="
          background: rgba(255, 107, 107, 0.2);
          padding: 10px;
          border-radius: 10px;
          margin-top: 10px;
        ">
          ⚠️ <strong>ALERT:</strong> ${dayData.alert}
        </div>
      `
      : "";

    const highlightClass = dayData.highlight ? " highlight" : "";

    return `
      <div class="day-card${highlightClass}">
        <div class="day-number">${dayData.day}</div>
        <div class="day-header">
          <div class="date-info">${dayData.date}</div>
        </div>
        <div class="location-name">${dayData.emoji} ${dayData.title}</div>
        <div class="accommodation-info">
          <div class="accommodation-name">${dayData.accommodation.name}</div>
          <div class="booking-ref">
            ${
              dayData.accommodation.bookingRef
                ? `Booking: ${dayData.accommodation.bookingRef}`
                : ""
            } 
            ${
              dayData.accommodation.cost
                ? `• ${dayData.accommodation.cost}`
                : ""
            }
          </div>
        </div>
        <div class="tags">${tagsHtml}</div>
        ${detailsHtml}
        ${alertHtml}
      </div>
    `;
  },

  /**
   * City Node Component for Route Map
   */
  CityNode(location) {
    return `
      <div class="city-node" data-location="${location.name}">
        ${location.emoji} ${location.name}
      </div>
    `;
  },

  /**
   * Cost Item Component
   */
  CostItem(costData) {
    const totalClass = costData.status === "total" ? " cost-total" : "";
    return `
      <div class="cost-item${totalClass}">
        <span>${costData.item}</span>
        <span>${costData.amount}</span>
      </div>
    `;
  },

  /**
   * Transport Item Component
   */
  TransportItem(transportData) {
    const bookedClass = transportData.booked ? " transport-booked" : "";
    const statusColor = transportData.booked ? "#00b894" : "#b2bec3";
    const statusText = transportData.booked
      ? "✅ BOOKED - " + transportData.details
      : transportData.details;

    return `
      <div class="transport-item${bookedClass}">
        <div class="transport-icon">${transportData.icon}</div>
        <div>
          <strong>${transportData.date}:</strong> ${transportData.route}<br/>
          <span style="color: ${statusColor}">${statusText}</span>
        </div>
      </div>
    `;
  },

  /**
   * Work Period Component
   */
  WorkPeriod(workData) {
    const isTotal = workData.date.includes("TOTAL");
    const className = isTotal ? "work-total" : "work-period";

    return `
      <div class="${className}">
        <strong>${workData.date}:</strong> ${workData.location} 
        ${workData.details ? `(${workData.details})` : ""} - ${
      workData.duration
    }
      </div>
    `;
  },

  /**
   * Alert Item Component
   */
  AlertItem(alertData) {
    const priorityColors = {
      high: "#ff6b6b",
      medium: "#fdcb6e",
      low: "#00b894",
    };

    return `
      <li style="margin-bottom: 10px;">
        <strong style="color: ${priorityColors[alertData.priority]};">
          ${alertData.title}:
        </strong> ${alertData.description}
      </li>
    `;
  },

  /**
   * Weather Card Component
   */
  WeatherCard(weatherData) {
    return `
      <div class="weather-card">
        <div class="weather-location">${weatherData.location}</div>
        <div class="weather-temp">${weatherData.temp}°C</div>
        <div class="weather-desc">${weatherData.description}</div>
        <div class="weather-details">
          <span>💧 ${weatherData.humidity}%</span>
          <span>💨 ${weatherData.windSpeed} km/h</span>
        </div>
      </div>
    `;
  },

  /**
   * Navigation Component
   */
  Navigation() {
    const sections = [
      { id: "journey", label: "Journey", icon: "📅" },
      { id: "map", label: "Route", icon: "🗺️" },
      { id: "weather", label: "Weather", icon: "🌤️" },
      { id: "cost", label: "Costs", icon: "💰" },
      { id: "transport", label: "Transport", icon: "🚌" },
      { id: "work", label: "Work", icon: "💻" },
    ];

    const navItems = sections
      .map(
        (section) => `
        <a href="#${section.id}" class="nav-item" onclick="scrollToSection('${section.id}')">
          <span class="nav-icon">${section.icon}</span>
          <span class="nav-label">${section.label}</span>
        </a>
      `
      )
      .join("");

    return `
      <nav class="dashboard-nav">
        ${navItems}
      </nav>
    `;
  },

  /**
   * Progress Tracker Component
   */
  ProgressTracker(tripData) {
    const today = new Date();
    const tripStart = new Date("2025-06-18");
    const tripEnd = new Date("2025-07-20");

    let progressText = "Planning Phase";
    let progressPercent = 0;

    if (today < tripStart) {
      const daysUntil = Math.ceil((tripStart - today) / (1000 * 60 * 60 * 24));
      progressText = `${daysUntil} days until adventure begins!`;
      progressPercent = 0;
    } else if (today >= tripStart && today <= tripEnd) {
      const daysElapsed = Math.ceil(
        (today - tripStart) / (1000 * 60 * 60 * 24)
      );
      const totalDays = Math.ceil(
        (tripEnd - tripStart) / (1000 * 60 * 60 * 24)
      );
      progressPercent = (daysElapsed / totalDays) * 100;
      progressText = `Day ${daysElapsed} of ${totalDays} - Adventure in progress!`;
    } else {
      progressText = "Adventure completed! 🎉";
      progressPercent = 100;
    }

    return `
      <div class="progress-tracker">
        <div class="progress-text">${progressText}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      </div>
    `;
  },

  /**
   * Countdown Timer Component
   */
  CountdownTimer(targetDate, label) {
    return `
      <div class="countdown-timer" data-target="${targetDate}">
        <div class="countdown-label">${label}</div>
        <div class="countdown-display">
          <span class="countdown-days">--</span>
          <span class="countdown-unit">days</span>
          <span class="countdown-hours">--</span>
          <span class="countdown-unit">hours</span>
        </div>
      </div>
    `;
  },
};

// Helper function to render components to DOM
function renderComponent(containerId, componentHtml) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = componentHtml;
  }
}

// Helper function to render multiple components
function renderComponents(containerId, components) {
  renderComponent(containerId, components.join(""));
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = Components;
}
