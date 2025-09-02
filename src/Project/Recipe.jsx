

import React from "react";

export default function RecipeModal({ meal, details, loading, error, onClose }) {
  if (!meal) return null;

  const getIngredientsList = (details) => {
    if (!details) return [];
    let list = [];
    for (let i = 1; i <= 20; i++) {
      if (details[`strIngredient${i}`]) {
        list.push(`${details[`strMeasure${i}`] || ""} ${details[`strIngredient${i}`]}`);
      }
    }
    return list;
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999,
      display: "flex", justifyContent: "center", alignItems: "center", padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        backgroundColor: "#fff", borderRadius: 12, maxWidth: 600,
        width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 24,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
      }}>
        <h2>{meal.strMeal}</h2>
        {loading && <p>Loading recipe...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {details && (
          <>
            <img src={details.strMealThumb} alt={details.strMeal} className="img-fluid rounded mb-3" />
            <h5>Ingredients:</h5>
            <ul>
              {getIngredientsList(details).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <h5>How to Make:</h5>
            <p style={{ whiteSpace: "pre-wrap" }}>{details.strInstructions}</p>
            <button onClick={onClose} className="btn btn-secondary mt-3">Close</button>
          </>
        )}
      </div>
    </div>
  );
}
