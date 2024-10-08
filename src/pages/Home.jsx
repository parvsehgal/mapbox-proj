import React, { useContext, useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { cartContext } from "../context/sidebarContext";

const MAPBOX_TOKEN = "<YOUR TOKEN>";

const Home = () => {
  const [viewport, setViewport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [restraunts, setRes] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const apiKey = "<YOUR API KEY>";

  const { dataForCart, setCartData, isDrawerOpen, setDrawerOpen } =
    useContext(cartContext);

  const getResInfo = async (placeId) => {
    //make the api call to get detaild information about a specific place
    const apiUrl = `https://places.googleapis.com/v1/${placeId}`;
    const { data } = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "<YOUR KEY>",
        "X-Goog-FieldMask":
          "id,displayName,formattedAddress,regularOpeningHours,businessStatus,nationalPhoneNumber,rating,reviews,delivery,dineIn",
      },
    });
    setCartData(data);
    setDrawerOpen(true);
  };

  const fetchNearbyRestaurants = async (lat, lon) => {
    const { data } = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["restaurant"],
        maxResultCount: 15,
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
            zoom: 16,
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
                    color={"blue"}
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
                      onClick={() => getResInfo(restaurant.name)}
                    />
                  </Marker>
                  {isHovered && (
                    <Popup
                      latitude={restaurant.viewport.high.latitude}
                      longitude={restaurant.viewport.high.longitude}
                      closeButton={false}
                      anchor="bottom"
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
