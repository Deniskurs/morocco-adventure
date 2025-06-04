// Google Maps Integration Module
class MapsService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.map = null;
    this.markers = [];
    this.infoWindows = [];
    this.directionsService = null;
    this.directionsRenderer = null;
    this.isLoaded = false;
  }

  // Load Google Maps API
  async loadGoogleMaps() {
    if (this.isLoaded) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });
  }

  // Initialize the main map
  async initializeMap(containerId, locations) {
    try {
      await this.loadGoogleMaps();

      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) {
        throw new Error(`Map container ${containerId} not found`);
      }

      // Calculate center point of all locations
      const center = this.calculateCenter(locations);

      // Map options
      const mapOptions = {
        zoom: 6,
        center: center,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: this.getCustomMapStyles(),
        gestureHandling: "cooperative",
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
      };

      this.map = new google.maps.Map(mapContainer, mapOptions);

      // Initialize services
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#ff6b6b",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });

      this.directionsRenderer.setMap(this.map);

      // Add markers for each location
      this.addLocationMarkers(locations);

      // Draw route between locations
      await this.drawRoute(locations);

      return this.map;
    } catch (error) {
      console.error("Error initializing map:", error);
      this.showFallbackMap(containerId, locations);
    }
  }

  // Add markers for each location
  addLocationMarkers(locations) {
    locations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: location.coordinates,
        map: this.map,
        title: location.name,
        icon: this.createCustomMarker(location, index),
        animation: google.maps.Animation.DROP,
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createInfoWindowContent(location),
      });

      // Add click listener
      marker.addListener("click", () => {
        // Close other info windows
        this.infoWindows.forEach((iw) => iw.close());
        infoWindow.open(this.map, marker);
      });

      // Store references
      this.markers.push(marker);
      this.infoWindows.push(infoWindow);

      // Add hover effects
      marker.addListener("mouseover", () => {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
      });
    });
  }

  // Create custom marker icon
  createCustomMarker(location, index) {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#ffe66d",
      "#a8e6cf",
      "#ff8b94",
      "#ffaaa5",
      "#ff677d",
      "#d4a4eb",
    ];

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[index % colors.length],
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 3,
      scale: 12,
    };
  }

  // Create info window content
  createInfoWindowContent(location) {
    return `
      <div class="map-info-window">
        <div class="info-header">
          <h3>${location.emoji} ${location.name}</h3>
          <p class="info-description">${location.description}</p>
        </div>
        <div class="info-actions">
          <button onclick="mapsService.showDirections('${location.name}')" class="info-btn">
            🧭 Directions
          </button>
          <button onclick="mapsService.showNearbyPlaces('${location.name}')" class="info-btn">
            📍 Nearby Places
          </button>
        </div>
      </div>
    `;
  }

  // Draw route between locations
  async drawRoute(locations) {
    if (locations.length < 2) return;

    const waypoints = locations.slice(1, -1).map((location) => ({
      location: location.coordinates,
      stopover: true,
    }));

    const request = {
      origin: locations[0].coordinates,
      destination: locations[locations.length - 1].coordinates,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: false,
    };

    try {
      const result = await this.directionsService.route(request);
      this.directionsRenderer.setDirections(result);

      // Calculate and display route information
      this.displayRouteInfo(result);
    } catch (error) {
      console.error("Error drawing route:", error);
      // Fallback: draw simple polyline
      this.drawSimpleRoute(locations);
    }
  }

  // Draw simple polyline if directions fail
  drawSimpleRoute(locations) {
    const routePath = new google.maps.Polyline({
      path: locations.map((loc) => loc.coordinates),
      geodesic: true,
      strokeColor: "#ff6b6b",
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    routePath.setMap(this.map);
  }

  // Display route information
  displayRouteInfo(result) {
    const route = result.routes[0];
    let totalDistance = 0;
    let totalDuration = 0;

    route.legs.forEach((leg) => {
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;
    });

    const routeInfo = {
      distance: Math.round(totalDistance / 1000) + " km",
      duration: Math.round(totalDuration / 3600) + " hours",
      legs: route.legs.map((leg) => ({
        start: leg.start_address,
        end: leg.end_address,
        distance: leg.distance.text,
        duration: leg.duration.text,
      })),
    };

    // Dispatch custom event with route info
    window.dispatchEvent(
      new CustomEvent("routeCalculated", { detail: routeInfo })
    );
  }

  // Show directions to a specific location
  showDirections(locationName) {
    const location = TripData.locations.find(
      (loc) => loc.name === locationName
    );
    if (!location) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}&travelmode=driving`;
    window.open(url, "_blank");
  }

  // Show nearby places
  async showNearbyPlaces(locationName) {
    const location = TripData.locations.find(
      (loc) => loc.name === locationName
    );
    if (!location) return;

    const service = new google.maps.places.PlacesService(this.map);
    const request = {
      location: location.coordinates,
      radius: 5000,
      type: ["tourist_attraction", "restaurant", "lodging"],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.displayNearbyPlaces(results, location);
      }
    });
  }

  // Display nearby places
  displayNearbyPlaces(places, location) {
    // Clear existing nearby markers
    this.clearNearbyMarkers();

    places.slice(0, 10).forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: this.map,
        title: place.name,
        icon: {
          url: place.icon,
          scaledSize: new google.maps.Size(25, 25),
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="nearby-place-info">
            <h4>${place.name}</h4>
            <p>Rating: ${place.rating || "N/A"} ⭐</p>
            <p>Type: ${place.types[0].replace(/_/g, " ")}</p>
            ${
              place.photos
                ? `<img src="${place.photos[0].getUrl({
                    maxWidth: 200,
                  })}" style="width: 100%; max-width: 200px; border-radius: 5px;">`
                : ""
            }
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(this.map, marker);
      });

      // Store as nearby marker
      this.nearbyMarkers = this.nearbyMarkers || [];
      this.nearbyMarkers.push(marker);
    });
  }

  // Clear nearby markers
  clearNearbyMarkers() {
    if (this.nearbyMarkers) {
      this.nearbyMarkers.forEach((marker) => marker.setMap(null));
      this.nearbyMarkers = [];
    }
  }

  // Calculate center point of locations
  calculateCenter(locations) {
    let lat = 0;
    let lng = 0;

    locations.forEach((location) => {
      lat += location.coordinates.lat;
      lng += location.coordinates.lng;
    });

    return {
      lat: lat / locations.length,
      lng: lng / locations.length,
    };
  }

  // Custom map styles (dark theme to match website)
  getCustomMapStyles() {
    return [
      {
        elementType: "geometry",
        stylers: [{ color: "#1d2c4d" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#8ec3b9" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1a3646" }],
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [{ color: "#4b6878" }],
      },
      {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative.neighborhood",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0e1626" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4e6d70" }],
      },
    ];
  }

  // Show fallback static map when Google Maps fails
  showFallbackMap(containerId, locations) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="fallback-map">
        <div class="fallback-header">
          <h3>🗺️ Morocco Route Map</h3>
          <p>Interactive map temporarily unavailable</p>
        </div>
        <div class="fallback-route">
          ${locations
            .map(
              (location, index) => `
            <div class="fallback-location">
              <div class="location-marker">${location.emoji}</div>
              <div class="location-info">
                <h4>${location.name}</h4>
                <p>${location.description}</p>
              </div>
              ${
                index < locations.length - 1
                  ? '<div class="route-arrow">↓</div>'
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
        <div class="fallback-actions">
          <button onclick="mapsService.openInGoogleMaps()" class="map-action-btn">
            🗺️ Open in Google Maps
          </button>
          <button onclick="mapsService.downloadOfflineMap()" class="map-action-btn">
            📱 Offline Map Info
          </button>
        </div>
      </div>
    `;
  }

  // Open route in Google Maps
  openInGoogleMaps() {
    const locations = TripData.locations;
    const waypoints = locations
      .slice(1, -1)
      .map((loc) => `${loc.coordinates.lat},${loc.coordinates.lng}`)
      .join("|");

    const url = `https://www.google.com/maps/dir/${
      locations[0].coordinates.lat
    },${locations[0].coordinates.lng}/${waypoints}/${
      locations[locations.length - 1].coordinates.lat
    },${locations[locations.length - 1].coordinates.lng}`;

    window.open(url, "_blank");
  }

  // Provide offline map information
  downloadOfflineMap() {
    const mapInfo = `
      📱 OFFLINE MAP INSTRUCTIONS:
      
      1. Download Google Maps offline:
         - Open Google Maps app
         - Search for "Morocco"
         - Tap "Download"
      
      2. Alternative apps:
         - Maps.me (offline maps)
         - HERE WeGo
         - Sygic Travel
      
      3. GPS Coordinates:
      ${TripData.locations
        .map(
          (loc) =>
            `   ${loc.emoji} ${loc.name}: ${loc.coordinates.lat}, ${loc.coordinates.lng}`
        )
        .join("\n")}
    `;

    // Create downloadable file
    const blob = new Blob([mapInfo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "morocco-offline-map-info.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show notification
    TravelUtils.showNotification("Map Info Downloaded", {
      body: "Offline map instructions have been downloaded",
      icon: "🗺️",
    });
  }

  // Highlight current location based on date
  highlightCurrentLocation() {
    const today = new Date();
    const tripStart = new Date("2025-06-18");
    const tripEnd = new Date("2025-07-20");

    if (today < tripStart || today > tripEnd) {
      return; // Trip not active
    }

    // Find current location based on itinerary
    const currentDay = TripData.itinerary.find((day) => {
      const dayDate = new Date(day.date);
      const dayAfter = new Date(dayDate);
      dayAfter.setDate(dayAfter.getDate() + 1);
      return today >= dayDate && today < dayAfter;
    });

    if (currentDay && this.markers.length > 0) {
      const locationIndex = TripData.locations.findIndex((loc) =>
        currentDay.location.includes(loc.name)
      );

      if (locationIndex >= 0 && this.markers[locationIndex]) {
        // Highlight current location marker
        this.markers[locationIndex].setAnimation(google.maps.Animation.BOUNCE);

        // Pan to current location
        this.map.panTo(TripData.locations[locationIndex].coordinates);

        // Show info window
        this.infoWindows[locationIndex].open(
          this.map,
          this.markers[locationIndex]
        );

        setTimeout(() => {
          this.markers[locationIndex].setAnimation(null);
        }, 3000);
      }
    }
  }

  // Get traffic information
  async getTrafficInfo(from, to) {
    try {
      const service = new google.maps.DistanceMatrixService();
      const result = await service.getDistanceMatrix({
        origins: [from],
        destinations: [to],
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
          departureTime: new Date(),
          trafficModel: google.maps.TrafficModel.BEST_GUESS,
        },
        avoidHighways: false,
        avoidTolls: false,
      });

      return result.rows[0].elements[0];
    } catch (error) {
      console.error("Error getting traffic info:", error);
      return null;
    }
  }

  // Cleanup method
  cleanup() {
    if (this.markers) {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    }
    if (this.infoWindows) {
      this.infoWindows.forEach((infoWindow) => infoWindow.close());
      this.infoWindows = [];
    }
    if (this.nearbyMarkers) {
      this.nearbyMarkers.forEach((marker) => marker.setMap(null));
      this.nearbyMarkers = [];
    }
  }
}

// Export the class
if (typeof module !== "undefined" && module.exports) {
  module.exports = MapsService;
}
