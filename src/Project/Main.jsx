import React, { useState, useEffect } from "react";
import Filters from "./Filter"
import MealGrid from "./Meal";
import RecipeModal from "./Recipe";
import {
  fetchCuisines,
  fetchMealsByIngredient,
  fetchMealDetails,
  fetchMealsByCuisine,
  fetchVegetarianMeals,
  fetchNonVegMeals,
} from "./Api"


export default function RecipeApp() {
  const [cuisines, setCuisines] = useState([]);
  const [filters, setFilters] = useState({
    ingredientInventory: "",
    cuisine: "",
    moodFilter: "",
    timeFilter: "",
    mealType: "",
    dietPreferences: {
      vegetarian: false,
      nonVeg: false,
      glutenFree: false,
      dairyFree: false,
    },
  });
  const [meals, setMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [errorMeals, setErrorMeals] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealDetails, setMealDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    fetchCuisines()
      .then(setCuisines)
      .catch(() => setCuisines([]));
  }, []);

  async function handleSearch() {
    setLoadingMeals(true);
    setErrorMeals("");
    try {
      let result;

     
      if (filters.ingredientInventory.trim()) {
        result = await fetchMealsByIngredient(filters.ingredientInventory);
      } else if (filters.cuisine) {
      
        result = await fetchMealsByCuisine(filters.cuisine);
      } else if (filters.dietPreferences.vegetarian) {
        result = await fetchVegetarianMeals();
      } else if (filters.dietPreferences.nonVeg) {
        result = await fetchNonVegMeals();
      } else {
        setErrorMeals("Please enter ingredients or select cuisine/diet filters.");
        setMeals([]);
        setLoadingMeals(false);
        return;
      }

      if (!result || result.length === 0) {
        setErrorMeals("No meals found matching your filters.");
        setMeals([]);
      } else {
        setMeals(result);
      }
    } catch {
      setErrorMeals("Failed to fetch meals.");
      setMeals([]);
    } finally {
      setLoadingMeals(false);
    }
  }

  async function openRecipeModal(meal) {
    setSelectedMeal(meal);
    setLoadingDetails(true);
    setErrorDetails("");
    try {
      const details = await fetchMealDetails(meal.idMeal);
      setMealDetails(details);
    } catch {
      setErrorDetails("Failed to fetch recipe details.");
      setMealDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }

  function closeRecipeModal() {
    setSelectedMeal(null);
    setMealDetails(null);
    setErrorDetails("");
  }

  return (
    <>
      <Filters
        cuisines={cuisines}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />
      <MealGrid
        meals={meals}
        loading={loadingMeals}
        error={errorMeals}
        onSelect={openRecipeModal}
      />
      {selectedMeal && (
        <RecipeModal
          meal={selectedMeal}
          details={mealDetails}
          loading={loadingDetails}
          error={errorDetails}
          onClose={closeRecipeModal}
        />
      )}
    </>
  );
}
