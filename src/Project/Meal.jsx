// MealGrid.js
import React from "react";

export default function MealGrid({ meals, loading, error, onSelect }) {
  if (loading) return <p className="text-center">Loading meals...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  if (!meals.length) return <p className="text-center">Please select the menu</p>;

  return (
    <div className="row g-3">
      {meals.map((meal) => (
        <div key={meal.idMeal} className="col-sm-6 col-md-4 col-lg-3">
          <div className="card h-100 shadow rounded" onClick={() => onSelect(meal)} style={{ cursor: "pointer" }}>
            <img src={meal.strMealThumb} alt={meal.strMeal} className="card-img-top" style={{ objectFit: "cover", height: 160 }} />
            <div className="card-body p-2 d-flex flex-column">
              <h6 className="card-title text-truncate mb-2">{meal.strMeal}</h6>
              <button className="btn btn-outline-primary mt-auto">Show Recipe</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
