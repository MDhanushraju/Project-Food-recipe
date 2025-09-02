import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RecipeApp() {
  const [ingredientInventory, setIngredientInventory] = useState("");
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [errorMeals, setErrorMeals] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealDetails, setMealDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");

  const [moodFilter, setMoodFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cuisines, setCuisines] = useState([]);
  const [dietPreferences, setDietPreferences] = useState({
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
    nonVeg: false,
  });

  // Get all available cuisines at component mount
  useEffect(() => {
    async function fetchCuisines() {
      try {
        const res = await axios.get(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
        );
        if (res.data.meals) {
          setCuisines(res.data.meals.map(m => m.strArea).filter(Boolean));
        }
      } catch {}
    }
    fetchCuisines();
  }, []);

  // Helper: fetch meals by cuisine (area)
  const fetchMealsByCuisine = async (area) => {
    let allMeals = [];
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
      );
      if (res.data.meals) {
        allMeals = res.data.meals;
      }
    } catch {}
    return allMeals;
  };

  // Helper: fetch meals from multiple non-veg categories
  const fetchNonVegMeals = async () => {
    const categories = ["Beef", "Chicken", "Pork", "Lamb", "Seafood", "Goat"];
    let allMeals = [];
    for (const cat of categories) {
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
        );
        if (res.data.meals) {
          allMeals = allMeals.concat(res.data.meals);
        }
      } catch {}
    }
    return allMeals;
  };

  // Helper: fetch meals from vegetarian category
  const fetchVegetarianMeals = async () => {
    let allMeals = [];
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`
      );
      if (res.data.meals) {
        allMeals = res.data.meals;
      }
    } catch {}
    return allMeals;
  };

  const fetchMealsByInventory = async () => {
    setLoadingMeals(true);
    setErrorMeals("");
    setMeals([]);
    setSelectedMeal(null);
    setMealDetails(null);

    try {
      let filteredMeals = [];

      if (cuisine) {
        // If a cuisine is chosen, fetch those meals first
        filteredMeals = await fetchMealsByCuisine(cuisine);

        // Filter locally for veg/non-veg, ingredients if needed
        if (dietPreferences.vegetarian && !dietPreferences.nonVeg) {
          filteredMeals = filteredMeals.filter(
            (meal) =>
              meal.strCategory && meal.strCategory.toLowerCase().includes("vegetarian")
          );
        } else if (dietPreferences.nonVeg && !dietPreferences.vegetarian) {
          filteredMeals = filteredMeals.filter(
            (meal) =>
              meal.strCategory &&
              ["beef","chicken","pork","lamb","seafood","goat"].some(cat =>
                meal.strCategory.toLowerCase().includes(cat)
              )
          );
        }

        if (ingredientInventory.trim()) {
          const ingredientsSet = new Set(
            ingredientInventory
              .toLowerCase()
              .split(",")
              .map((i) => i.trim())
          );
          filteredMeals = filteredMeals.filter((meal) => {
            const mealNameLower = meal.strMeal.toLowerCase();
            return [...ingredientsSet].some((ing) => mealNameLower.includes(ing));
          });
        }
      } else if (dietPreferences.vegetarian && !dietPreferences.nonVeg) {
        filteredMeals = await fetchVegetarianMeals();
        if (ingredientInventory.trim()) {
          const ingredientsSet = new Set(
            ingredientInventory
              .toLowerCase()
              .split(",")
              .map((i) => i.trim())
          );
          filteredMeals = filteredMeals.filter((meal) => {
            const mealNameLower = meal.strMeal.toLowerCase();
            return [...ingredientsSet].some((ing) => mealNameLower.includes(ing));
          });
        }
      } else if (dietPreferences.nonVeg && !dietPreferences.vegetarian) {
        filteredMeals = await fetchNonVegMeals();
        if (ingredientInventory.trim()) {
          const ingredientsSet = new Set(
            ingredientInventory
              .toLowerCase()
              .split(",")
              .map((i) => i.trim())
          );
          filteredMeals = filteredMeals.filter((meal) => {
            const mealNameLower = meal.strMeal.toLowerCase();
            return [...ingredientsSet].some((ing) => mealNameLower.includes(ing));
          });
        }
      } else if (
        dietPreferences.vegetarian &&
        dietPreferences.nonVeg &&
        ingredientInventory.trim()
      ) {
        let vegMeals = await fetchVegetarianMeals();
        let nonVegMeals = await fetchNonVegMeals();
        filteredMeals = vegMeals.concat(nonVegMeals);
        const ingredientsSet = new Set(
          ingredientInventory.toLowerCase().split(",").map((i) => i.trim())
        );
        filteredMeals = filteredMeals.filter((meal) => {
          const mealNameLower = meal.strMeal.toLowerCase();
          return [...ingredientsSet].some((ing) => mealNameLower.includes(ing));
        });
      } else if (ingredientInventory.trim()) {
        const query = ingredientInventory
          .trim()
          .split(",")
          .map((i) => i.trim())
          .join(",");
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
            query
          )}`
        );
        if (res.data.meals) filteredMeals = res.data.meals;
      } else {
        setErrorMeals(
          "Please select a Cuisine, Vegetarian, Non-Veg, or enter ingredient(s) to search."
        );
        setLoadingMeals(false);
        return;
      }

      if (filteredMeals.length === 0) {
        setErrorMeals("No meals found matching your filters.");
      }
      setMeals(filteredMeals);
    } catch {
      setErrorMeals("Failed to fetch meals.");
    } finally {
      setLoadingMeals(false);
    }
  };

  const fetchMealDetails = async (id) => {
    setLoadingDetails(true);
    setErrorDetails("");
    setMealDetails(null);
    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      if (res.data.meals && res.data.meals.length > 0) {
        setMealDetails(res.data.meals[0]);
      } else {
        setErrorDetails("Recipe details not found.");
      }
    } catch {
      setErrorDetails("Failed to fetch recipe details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const openRecipeModal = (meal) => {
    setSelectedMeal(meal);
    fetchMealDetails(meal.idMeal);
  };

  const handleDietChange = (e) => {
    const { name, checked } = e.target;
    setDietPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const filteredMeals = meals.filter((meal) => {
    if (!mealType) return true;
    const name = meal.strMeal.toLowerCase();
    if (mealType === "Breakfast")
      return name.includes("breakfast") || name.includes("morning");
    if (mealType === "Lunch")
      return name.includes("lunch") || name.includes("salad");
    if (mealType === "Dinner")
      return (
        name.includes("dinner") ||
        name.includes("steak") ||
        name.includes("roast")
      );
    return true;
  });

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <h1 className="mb-4 text-center">Find Your Next Meal</h1>
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <label className="form-label fw-semibold">Cuisine</label>
          <select
            className="form-select"
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisines.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Mood (Type of Meal)</label>
          <select
            className="form-select"
            value={moodFilter}
            onChange={e => setMoodFilter(e.target.value)}
          >
            <option value="">-- Select Mood --</option>
            <option value="Quick">Quick</option>
            <option value="Comfort">Comfort</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">
            Max Cooking Time (minutes)
          </label>
          <select
            className="form-select"
            value={timeFilter}
            onChange={e => setTimeFilter(e.target.value)}
          >
            <option value="">No Limit</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Meal Type</label>
          <select
            className="form-select"
            value={mealType}
            onChange={e => setMealType(e.target.value)}
          >
            <option value="">Select Meal Type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Diet Preferences</label>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="vegetarian"
            id="vegetarian"
            checked={dietPreferences.vegetarian}
            onChange={handleDietChange}
          />
          <label className="form-check-label" htmlFor="vegetarian">
            Vegetarian
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="glutenFree"
            id="glutenFree"
            checked={dietPreferences.glutenFree}
            onChange={handleDietChange}
          />
          <label className="form-check-label" htmlFor="glutenFree">
            Gluten-Free
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="dairyFree"
            id="dairyFree"
            checked={dietPreferences.dairyFree}
            onChange={handleDietChange}
          />
          <label className="form-check-label" htmlFor="dairyFree">
            Dairy-Free
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="nonVeg"
            id="nonVeg"
            checked={dietPreferences.nonVeg}
            onChange={handleDietChange}
          />
          <label className="form-check-label" htmlFor="nonVeg">
            Non-Veg
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="inventory-input" className="form-label fw-semibold">
          Ingredients You Have (comma separated)
        </label>
        <div className="input-group">
          <input
            type="text"
            id="inventory-input"
            className="form-control"
            placeholder="e.g. chicken, tomato, onion"
            value={ingredientInventory}
            onChange={e => setIngredientInventory(e.target.value)}
            aria-label="Ingredient inventory"
            onKeyDown={e =>
              e.key === "Enter" && fetchMealsByInventory()
            }
          />
          <button
            className="btn btn-primary"
            onClick={fetchMealsByInventory}
          >
            Find Recipes With My Ingredients
          </button>
        </div>
      </div>

      {errorMeals && (
        <div className="alert alert-danger text-center" role="alert">
          {errorMeals}
        </div>
      )}
      {loadingMeals && <p className="text-center">Loading meals...</p>}

      <div className="row g-3">
        {filteredMeals.length > 0 ? (
          filteredMeals.map(meal => (
            <div key={meal.idMeal} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow rounded">
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: 160 }}
                />
                <div className="card-body p-2 d-flex flex-column">
                  <h6 className="card-title text-truncate mb-2">{meal.strMeal}</h6>
                  <button
                    className="btn btn-outline-primary mt-auto"
                    onClick={() => openRecipeModal(meal)}
                  >
                    Show Recipe
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-center fs-5 text-muted">
              Sorry, no meals match your filters. Try adjusting your ingredients or preferences.
            </p>
          </div>
        )}
      </div>

      {selectedMeal && (
        <div
          onClick={() => setSelectedMeal(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              maxWidth: 600,
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: 24,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <h2 className="mb-3">{selectedMeal.strMeal}</h2>
            {loadingDetails && <p>Loading recipe...</p>}
            {errorDetails && <div className="alert alert-danger">{errorDetails}</div>}
            {mealDetails && (
              <>
                <img
                  src={mealDetails.strMealThumb}
                  alt={mealDetails.strMeal}
                  className="img-fluid rounded mb-3"
                />
                <h5>Ingredients:</h5>
                <ul>
                  {getIngredientsList(mealDetails).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
                <h5>How to Make:</h5>
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {mealDetails.strInstructions}
                </p>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={() => setSelectedMeal(null)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getIngredientsList(meal) {
  if (!meal) return [];
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      list.push(`${measure ? measure.trim() : ""} ${ingredient.trim()}`);
    }
  }
  return list;
}
