// Utility Functions for Morocco Adventure Dashboard

class TravelUtils {
  // Date and Time utilities
  static formatDate(dateString, options = {}) {
    const defaultOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", {
      ...defaultOptions,
      ...options,
    });
  }

  static getTimeUntil(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  }

  static getCurrentTimeInTimezone(timezone) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  }

  // Currency utilities
  static async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // Using a free exchange rate API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      return (amount * rate).toFixed(2);
    } catch (error) {
      console.error("Currency conversion error:", error);
      return amount; // Return original amount if conversion fails
    }
  }

  // QR Code generation
  static generateQRCode(text, size = 200) {
    // Using QR Server API (free)
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      text
    )}`;
  }

  // Weather utilities
  static getWeatherIcon(condition) {
    const iconMap = {
      clear: "☀️",
      "partly-cloudy": "⛅",
      cloudy: "☁️",
      rain: "🌧️",
      thunderstorm: "⛈️",
      snow: "❄️",
      mist: "🌫️",
      wind: "💨",
    };
    return iconMap[condition] || "🌤️";
  }

  // Distance calculations
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return Math.round(d);
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Local Storage utilities
  static saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Storage save error:", error);
      return false;
    }
  }

  static loadFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Storage load error:", error);
      return defaultValue;
    }
  }

  // URL utilities
  static createBookingUrl(bookingRef, platform = "booking") {
    const urlMap = {
      booking: `https://www.booking.com/mybooking?label=${bookingRef}`,
      airbnb: `https://www.airbnb.com/trips/v1/${bookingRef}`,
      expedia: `https://www.expedia.com/trips/${bookingRef}`,
    };
    return urlMap[platform] || `#booking-${bookingRef}`;
  }

  // Animation utilities
  static animateValue(element, start, end, duration, suffix = "") {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Notification utilities
  static showNotification(title, options = {}) {
    if ("Notification" in window && Notification.permission === "granted") {
      return new Notification(title, {
        icon: "/assets/images/icon-192.png",
        badge: "/assets/images/icon-72.png",
        ...options,
      });
    } else if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          return new Notification(title, options);
        }
      });
    }
  }

  // Device detection
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static isOnline() {
    return navigator.onLine;
  }

  // Color utilities for dynamic theming
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  // Template utilities
  static createElement(tag, className = "", innerHTML = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Progress tracking
  static calculateTripProgress() {
    const tripStart = new Date("2025-06-18");
    const tripEnd = new Date("2025-07-20");
    const now = new Date();

    if (now < tripStart) {
      return { phase: "before", progress: 0 };
    } else if (now > tripEnd) {
      return { phase: "after", progress: 100 };
    } else {
      const totalDuration = tripEnd - tripStart;
      const currentDuration = now - tripStart;
      const progress = Math.round((currentDuration / totalDuration) * 100);
      return { phase: "during", progress };
    }
  }

  // Arabic/French phrase helper
  static getLocalPhrases() {
    return {
      arabic: {
        hello: "مرحبا (Marhaba)",
        thankyou: "شكرا (Shukran)",
        please: "من فضلك (Min fadlik)",
        excuse: "عذرا (Udhran)",
        yes: "نعم (Na'am)",
        no: "لا (La)",
        howmuch: "بكم؟ (Bikam?)",
        water: "ماء (Ma')",
        bathroom: "حمام (Hammam)",
      },
      french: {
        hello: "Bonjour",
        thankyou: "Merci",
        please: "S'il vous plaît",
        excuse: "Excusez-moi",
        yes: "Oui",
        no: "Non",
        howmuch: "Combien?",
        water: "L'eau",
        bathroom: "Toilettes",
      },
    };
  }

  // Emergency contacts
  static getEmergencyInfo() {
    return {
      morocco: {
        police: "19",
        ambulance: "15",
        fire: "15",
        tourist_police: "+212 5 37 73 18 61",
      },
      embassies: {
        uk: "+212 5 37 63 33 33",
        us: "+212 5 37 76 22 65",
      },
      hospitals: {
        marrakech: "Polyclinique du Sud +212 5 24 44 79 99",
        agadir: "Clinique Atlas +212 5 28 84 00 60",
        casablanca: "Clinique Badr +212 5 22 25 25 25",
      },
    };
  }
}

// Export the utility class
if (typeof module !== "undefined" && module.exports) {
  module.exports = TravelUtils;
}
