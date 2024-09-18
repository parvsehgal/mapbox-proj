import { Drawer, Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "../context/sidebarContext";

function Bar() {
  let { dataForCart, setCartData, isDrawerOpen, setDrawerOpen } =
    useContext(cartContext);

  const styles = {
    restaurantContainer: {
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      backgroundColor: "#f9f9f9",
      maxWidth: "700px",
      margin: "20px auto",
      fontFamily: "Arial, sans-serif",
    },
    infoContainer: {
      textAlign: "left", // Align the content to the left
      marginBottom: "20px",
    },
    restaurantName: {
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    restaurantAddress: {
      fontSize: "16px",
      color: "#666",
      marginBottom: "5px",
    },
    restaurantRating: {
      fontSize: "18px",
      marginBottom: "15px",
    },
    serviceOptions: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    serviceTagAvailable: {
      padding: "5px 12px",
      backgroundColor: "#4caf50", // Green for available services
      color: "#fff",
      borderRadius: "6px",
      fontWeight: "bold",
    },
    serviceTagUnavailable: {
      padding: "5px 12px",
      backgroundColor: "#ff4c4c", // Red for unavailable services
      color: "#fff",
      borderRadius: "6px",
      fontWeight: "bold",
    },
    reviewsContainer: {
      marginTop: "20px",
    },
    reviewCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "15px",
      backgroundColor: "#f0f4ff", // Light blue shade background
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)", // Soft shadow
    },
    reviewHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    authorPhoto: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      marginRight: "10px",
    },
    authorName: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#007bff",
      textDecoration: "none",
    },
    reviewTime: {
      fontSize: "12px",
      color: "#999",
    },
    reviewText: {
      fontSize: "14px",
      marginBottom: "10px",
    },
    reviewRating: {
      fontSize: "14px",
      fontWeight: "bold",
    },
  };
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box width="700px" textAlign="center">
        <div style={styles.restaurantContainer}>
          <div style={styles.infoContainer}>
            <h2 style={styles.restaurantName}>
              {dataForCart?.displayName?.text || "Restaurant Name"}
            </h2>
            <p style={styles.restaurantAddress}>
              {dataForCart?.formattedAddress || "Address not available"}
            </p>
            <p>
              Status:{" "}
              <strong>{dataForCart?.businessStatus || "Unknown"}</strong>
            </p>
            <p style={styles.restaurantRating}>
              Rating: {dataForCart?.rating || "N/A"} ⭐
            </p>
          </div>

          <div style={styles.serviceOptions}>
            {dataForCart?.delivery ? (
              <span style={styles.serviceTagAvailable}>Delivery Available</span>
            ) : (
              <span style={styles.serviceTagUnavailable}>
                No Delivery Available
              </span>
            )}
            {dataForCart?.dineIn ? (
              <span style={styles.serviceTagAvailable}>Dine-in Available</span>
            ) : (
              <span style={styles.serviceTagUnavailable}>
                No Dine-in Available
              </span>
            )}
          </div>

          <h3>Reviews</h3>
          <div style={styles.reviewsContainer}>
            {dataForCart?.reviews?.length > 0 ? (
              dataForCart.reviews.map((review, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <img
                      src={
                        review?.authorAttribution?.photoUri ||
                        "https://via.placeholder.com/40"
                      }
                      alt={
                        review?.authorAttribution?.displayName || "Anonymous"
                      }
                      style={styles.authorPhoto}
                    />
                    <div>
                      <a
                        href={review?.authorAttribution?.uri || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.authorName}
                      >
                        {review?.authorAttribution?.displayName || "Anonymous"}
                      </a>
                      <p style={styles.reviewTime}>
                        {review?.relativePublishTimeDescription ||
                          "Some time ago"}
                      </p>
                    </div>
                  </div>
                  <p style={styles.reviewText}>
                    {review?.text?.text || "No review text"}
                  </p>
                  <p style={styles.reviewRating}>
                    Rating: {review?.rating || "N/A"} ⭐
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews available</p>
            )}
          </div>
        </div>
        );{" "}
      </Box>
    </Drawer>
  );
}
export default Bar;
