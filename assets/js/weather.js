// Weather Integration Module
class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org/data/2.5";
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
  }

  // Get current weather for a city
  async getCurrentWeather(city, lat, lng) {
    const cacheKey = `current_${city}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const weatherData = this.formatCurrentWeather(data);

      this.setCache(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error("Error fetching current weather:", error);
      return this.getFallbackWeather(city);
    }
  }

  // Get 7-day forecast
  async getForecast(city, lat, lng) {
    const cacheKey = `forecast_${city}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      const forecastData = this.formatForecast(data);

      this.setCache(cacheKey, forecastData);
      return forecastData;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return this.getFallbackForecast(city);
    }
  }

  // Format current weather data
  formatCurrentWeather(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert to km
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      condition: this.mapWeatherCondition(data.weather[0].main),
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(),
    };
  }

  // Format forecast data
  formatForecast(data) {
    const dailyData = {};

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();

      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000),
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: [],
          descriptions: [],
          icons: [],
        };
      }

      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].main);
      dailyData[date].humidity.push(item.main.humidity);
      dailyData[date].windSpeed.push(item.wind.speed * 3.6);
      dailyData[date].descriptions.push(item.weather[0].description);
      dailyData[date].icons.push(item.weather[0].icon);
    });

    return Object.values(dailyData)
      .slice(0, 7)
      .map((day) => ({
        date: day.date,
        maxTemp: Math.round(Math.max(...day.temps)),
        minTemp: Math.round(Math.min(...day.temps)),
        avgHumidity: Math.round(
          day.humidity.reduce((a, b) => a + b) / day.humidity.length
        ),
        avgWindSpeed: Math.round(
          day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length
        ),
        condition: this.getMostFrequent(day.conditions),
        description: this.getMostFrequent(day.descriptions),
        icon: this.getMostFrequent(day.icons),
        dayName: day.date.toLocaleDateString("en-US", { weekday: "short" }),
      }));
  }

  // Map OpenWeather conditions to our internal system
  mapWeatherCondition(condition) {
    const conditionMap = {
      Clear: "clear",
      Clouds: "cloudy",
      Rain: "rain",
      Drizzle: "rain",
      Thunderstorm: "thunderstorm",
      Snow: "snow",
      Mist: "mist",
      Fog: "mist",
      Haze: "mist",
      Dust: "mist",
      Sand: "mist",
      Ash: "mist",
      Squall: "wind",
      Tornado: "wind",
    };

    return conditionMap[condition] || "partly-cloudy";
  }

  // Get most frequent item from array
  getMostFrequent(arr) {
    const frequency = {};
    let maxCount = 0;
    let mostFrequent = arr[0];

    arr.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxCount) {
        maxCount = frequency[item];
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  // Fallback weather data when API fails
  getFallbackWeather(city) {
    const fallbackData = {
      Ouarzazate: { temp: 25, condition: "clear", description: "sunny" },
      Marrakesh: { temp: 28, condition: "clear", description: "hot" },
      Sahara: { temp: 35, condition: "clear", description: "very hot" },
      Agafay: { temp: 30, condition: "clear", description: "warm" },
      Agadir: { temp: 22, condition: "partly-cloudy", description: "mild" },
      Casablanca: { temp: 20, condition: "cloudy", description: "cool" },
      Kenitra: { temp: 18, condition: "cloudy", description: "mild" },
      Tangier: { temp: 19, condition: "partly-cloudy", description: "cool" },
    };

    const fallback = fallbackData[city] || {
      temp: 25,
      condition: "clear",
      description: "pleasant",
    };

    return {
      city,
      temperature: fallback.temp,
      condition: fallback.condition,
      description: fallback.description,
      offline: true,
      timestamp: new Date(),
    };
  }

  getFallbackForecast(city) {
    const baseTemp = this.getFallbackWeather(city).temperature;
    const forecast = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      forecast.push({
        date,
        maxTemp: baseTemp + Math.random() * 5,
        minTemp: baseTemp - Math.random() * 8,
        condition: "clear",
        description: "pleasant",
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        offline: true,
      });
    }

    return forecast;
  }

  // Get weather recommendations
  getWeatherRecommendations(weatherData) {
    const recommendations = [];

    if (weatherData.temperature > 35) {
      recommendations.push({
        type: "warning",
        message: "Extremely hot! Stay hydrated and seek shade.",
        icon: "🥵",
      });
    } else if (weatherData.temperature > 30) {
      recommendations.push({
        type: "info",
        message: "Very warm. Light, breathable clothing recommended.",
        icon: "☀️",
      });
    }

    if (weatherData.condition === "rain") {
      recommendations.push({
        type: "info",
        message: "Rain expected. Pack an umbrella or raincoat.",
        icon: "🌧️",
      });
    }

    if (weatherData.windSpeed > 20) {
      recommendations.push({
        type: "info",
        message: "Windy conditions. Secure loose items.",
        icon: "💨",
      });
    }

    if (weatherData.humidity > 80) {
      recommendations.push({
        type: "info",
        message: "High humidity. Stay cool and hydrated.",
        icon: "💧",
      });
    }

    return recommendations;
  }

  // Get packing suggestions based on weather
  getPackingSuggestions(forecastData) {
    const suggestions = {
      clothing: [],
      accessories: [],
      general: [],
    };

    const avgTemp =
      forecastData.reduce(
        (sum, day) => sum + (day.maxTemp + day.minTemp) / 2,
        0
      ) / forecastData.length;
    const hasRain = forecastData.some((day) => day.condition === "rain");
    const hasHot = forecastData.some((day) => day.maxTemp > 30);
    const hasCool = forecastData.some((day) => day.minTemp < 15);

    // Clothing suggestions
    if (hasHot) {
      suggestions.clothing.push("Light, breathable shirts");
      suggestions.clothing.push("Shorts and light pants");
      suggestions.clothing.push("Sun hat");
    }

    if (hasCool) {
      suggestions.clothing.push("Light jacket or sweater");
      suggestions.clothing.push("Long pants");
    }

    if (avgTemp > 25) {
      suggestions.clothing.push("Sandals or breathable shoes");
    } else {
      suggestions.clothing.push("Comfortable walking shoes");
    }

    // Accessories
    suggestions.accessories.push("Sunglasses");
    suggestions.accessories.push("Sunscreen (SPF 30+)");

    if (hasRain) {
      suggestions.accessories.push("Umbrella or raincoat");
    }

    if (hasHot) {
      suggestions.accessories.push("Water bottle");
      suggestions.accessories.push("Cooling towel");
    }

    // General suggestions
    suggestions.general.push("Check weather updates regularly");
    suggestions.general.push("Pack layers for temperature changes");

    return suggestions;
  }
}

// Create weather widget HTML
class WeatherWidget {
  constructor(containerId, weatherService) {
    this.container = document.getElementById(containerId);
    this.weatherService = weatherService;
  }

  async renderCurrentWeather(city, lat, lng) {
    const weather = await this.weatherService.getCurrentWeather(city, lat, lng);

    const widget = document.createElement("div");
    widget.className = "weather-widget current-weather";
    widget.innerHTML = `
      <div class="weather-header">
        <h3>${weather.city}</h3>
        <span class="weather-time">${weather.timestamp.toLocaleTimeString()}</span>
      </div>
      <div class="weather-main">
        <div class="temperature">
          <span class="temp-value">${weather.temperature}</span>
          <span class="temp-unit">°C</span>
        </div>
        <div class="weather-icon">
          ${TravelUtils.getWeatherIcon(weather.condition)}
        </div>
        <div class="weather-description">
          ${weather.description}
        </div>
      </div>
      <div class="weather-details">
        <div class="detail-item">
          <span class="detail-label">Feels like</span>
          <span class="detail-value">${weather.feelsLike}°C</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${weather.humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${weather.windSpeed} km/h</span>
        </div>
      </div>
      ${
        weather.offline
          ? '<div class="offline-indicator">📱 Offline Data</div>'
          : ""
      }
    `;

    return widget;
  }

  async renderForecast(city, lat, lng) {
    const forecast = await this.weatherService.getForecast(city, lat, lng);

    const widget = document.createElement("div");
    widget.className = "weather-widget forecast-weather";

    const forecastHTML = forecast
      .map(
        (day) => `
      <div class="forecast-day">
        <div class="forecast-date">${day.dayName}</div>
        <div class="forecast-icon">${TravelUtils.getWeatherIcon(
          day.condition
        )}</div>
        <div class="forecast-temps">
          <span class="forecast-high">${day.maxTemp}°</span>
          <span class="forecast-low">${day.minTemp}°</span>
        </div>
        <div class="forecast-description">${day.description}</div>
      </div>
    `
      )
      .join("");

    widget.innerHTML = `
      <div class="forecast-header">
        <h3>7-Day Forecast - ${city}</h3>
      </div>
      <div class="forecast-grid">
        ${forecastHTML}
      </div>
      ${
        forecast[0]?.offline
          ? '<div class="offline-indicator">📱 Offline Data</div>'
          : ""
      }
    `;

    return widget;
  }

  async renderMultiCityWeather(locations) {
    const widgets = [];

    for (const location of locations) {
      const weather = await this.weatherService.getCurrentWeather(
        location.name,
        location.coordinates.lat,
        location.coordinates.lng
      );

      const widget = document.createElement("div");
      widget.className = "weather-card city-weather";
      widget.innerHTML = `
        <div class="city-weather-header">
          <span class="city-name">${location.emoji} ${location.name}</span>
          <span class="weather-icon">${TravelUtils.getWeatherIcon(
            weather.condition
          )}</span>
        </div>
        <div class="city-temperature">${weather.temperature}°C</div>
        <div class="city-description">${weather.description}</div>
        <div class="city-details">
          <span>💧 ${weather.humidity}%</span>
          <span>💨 ${weather.windSpeed} km/h</span>
        </div>
      `;

      widgets.push(widget);
    }

    return widgets;
  }
}

// Export classes
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WeatherService, WeatherWidget };
}
