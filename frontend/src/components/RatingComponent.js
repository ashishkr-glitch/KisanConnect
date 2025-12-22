import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import "./RatingComponent.css";

function RatingComponent({ 
  rating = 0, 
  onRate = null,
  readOnly = false,
  size = "medium",
  showCount = true,
  reviewCount = 0
}) {
  const [hoverRating, setHoverRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState("");
  const [tempRating, setTempRating] = useState(0);
  const [displayRating, setDisplayRating] = useState(rating);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleRate = (value) => {
    if (readOnly) return;
    setTempRating(value);
    setShowForm(true);
  };

  const handleSubmitReview = () => {
    if (tempRating === 0) {
      alert("Please select a rating");
      return;
    }
    if (onRate) {
      onRate({ rating: tempRating, review: review.trim() });
    }
    // show the submitted rating immediately even if parent hasn't refreshed
    setDisplayRating(tempRating);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2200);

    setTempRating(0);
    setReview("");
    setShowForm(false);
  };

  const sizeClass = `size-${size}`;

  return (
    <div className={`rating-component ${sizeClass} ${justSubmitted ? "submitted" : ""}`}>
      {/* Display Stars */}
      <div className="rating-stars" style={{ padding: "4px 0" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${star <= (hoverRating || tempRating || displayRating) ? "active" : ""}`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={readOnly}
            title={`Rate ${star} stars`}
            aria-label={`${star} stars`}
            style={{
              fontSize: size === "small" ? "16px" : size === "large" ? "28px" : "20px",
              opacity: star <= (hoverRating || tempRating || displayRating) ? 1 : 0.3
            }}
          >
            <FaStar />
          </button>
        ))}
      </div>

      {/* Rating Count */}
      {showCount && (
        <span className="rating-count">
          {displayRating.toFixed(1)} ⭐ ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}

      {/* Review Form */}
      {!readOnly && showForm && (
        <div className="review-form">
          <h4>Your Review ({tempRating} stars)</h4>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 200))}
            placeholder="Write your review (optional, max 200 characters)"
            rows={3}
            className="review-textarea"
          />
          <div className="review-char-count">{review.length}/200</div>
          <div className="review-buttons">
            <button className="submit-review" onClick={handleSubmitReview}>
              Submit Review
            </button>
            <button className="cancel-review" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RatingComponent;
