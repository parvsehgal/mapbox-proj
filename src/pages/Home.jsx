import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MAPBOX_TOKEN = "<YOUR MAPBOX TOKEN>";

const Home = () => {
  const [viewport, setViewport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [restraunts, setRes] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fetchNearbyRestaurants = async (lat, lon) => {
    const apiKey = "<YOUR API KEY>";

    const { data } = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["restaurant"],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lon,
            },
            radius: 500.0,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.viewport,places.name,places.displayName",
        },
      },
    );
    return data;
  };

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          setUserLocation({ latitude: lat, longitude: lon });
          setViewport({
            latitude: lat,
            longitude: lon,
            zoom: 15,
          });

          const restaurantsData = await fetchNearbyRestaurants(lat, lon);
          console.log(restaurantsData);
          setRes(restaurantsData.places);
        },
        (error) => console.log(error),
      );
    }
  }, []);

  if (viewport == null) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <div>Above map</div>
      <Map
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {userLocation && (
          <>
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              color="red"
            />
            {showPopup && (
              <Popup
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                closeButton={false} // No close button since it disappears on hover out
                anchor="top"
              >
                <div>You are here!</div>
              </Popup>
            )}
            {restraunts.map((restaurant, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <React.Fragment key={index}>
                  <Marker
                    latitude={restaurant.viewport.high.latitude}
                    longitude={restaurant.viewport.high.longitude}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "blue",
                        borderRadius: "50%",
                        cursor: "pointer",
                        transform: isHovered ? "scale(1.5)" : "scale(1)",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </Marker>
                  {isHovered && (
                    <Popup
                      latitude={restaurant.viewport.high.latitude}
                      longitude={restaurant.viewport.high.longitude}
                      closeButton={false}
                      anchor="top"
                      onClose={() => setHoveredIndex(null)}
                    >
                      <div>{restaurant.displayName.text}</div>
                    </Popup>
                  )}
                </React.Fragment>
              );
            })}{" "}
          </>
        )}
      </Map>
    </div>
  );
};

export default Home;
