import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-danger bg-danger sticky-top">
      <div className="container">
        <a className="navbar-brand text-white fw-bold" href="#">
          Find Your Next Meal
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Place for future nav links or buttons */}
        </div>
      </div>
    </nav>
  );
}
