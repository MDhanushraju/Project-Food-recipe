import React, { useEffect, useState } from "react";

export default function Main() {
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);

  // Fetch cuisines on mount
  useEffect(() => {
    async function fetchCuisines() {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        const data = await response.json();
        const areas = data.meals.map((m) => m.strArea).filter(Boolean);
        setCuisines(areas);
      } catch (error) {
        console.error("Failed to fetch cuisines", error);
      }
    }
    fetchCuisines();
  }, []);

  // Fetch meals for selected cuisine
  useEffect(() => {
    if (!selectedCuisine) return;

    async function fetchMeals() {
      setLoadingMeals(true);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
            selectedCuisine
          )}`
        );
        const data = await response.json();
        setMeals(data.meals || []);
      } catch (error) {
        console.error("Failed to fetch meals", error);
        setMeals([]);
      } finally {
        setLoadingMeals(false);
      }
    }
    fetchMeals();
  }, [selectedCuisine]);

  return (
    <>
      <nav className="bg-danger text-center p-2">
        <h5>"Even the tired find comfort in good food."</h5>
      </nav>

      <div className="container py-4">
        <h3>Select a Cuisine:</h3>
        <div className="mb-4">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              className={`btn me-2 mb-2 ${
                selectedCuisine === cuisine ? "btn-danger" : "btn-outline-danger"
              }`}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {loadingMeals && <p>Loading meals...</p>}

        <div className="row g-3">
          {meals.map((meal) => (
            <div key={meal.idMeal} className="col-md-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="card-img-top"
                  style={{ height: 140, objectFit: "cover" }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title text-truncate">{meal.strMeal}</h6>
                </div>
              </div>
            </div>
          ))}
          {!loadingMeals && meals.length === 0 && selectedCuisine && (
            <p>No meals found for {selectedCuisine}</p>
          )}
        </div>
      </div>
    </>
  );
}
