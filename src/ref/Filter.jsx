// Filters.js
import React from "react";

export default function Filters({ cuisines, filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFilters(prev => ({
        ...prev,
        dietPreferences: { ...prev.dietPreferences, [name]: checked }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="container p-3 bg-light">
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label>Cuisine</label>
          <select name="cuisine" value={filters.cuisine} onChange={handleChange} className="form-select">
            <option value="">All Cuisines</option>
            {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="col-md-4">
          <label>Mood</label>
          <select name="moodFilter" value={filters.moodFilter} onChange={handleChange} className="form-select">
            <option value="">Any</option>
            <option value="Quick">Quick</option>
            <option value="Comfort">Comfort</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>

        <div className="col-md-4">
          <label>Max Cooking Time (minutes)</label>
          <select name="timeFilter" value={filters.timeFilter} onChange={handleChange} className="form-select">
            <option value="">No Limit</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label>Meal Type</label>
        <select name="mealType" value={filters.mealType} onChange={handleChange} className="form-select">
          <option value="">Any</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Ingredients You Have (comma separated)</label>
        <input
          type="text"
          name="ingredientInventory"
          value={filters.ingredientInventory}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. chicken, tomato"
        />
      </div>

      <div className="mb-3">
        <label>Diet Preferences</label>
        <div className="form-check">
          <input type="checkbox" name="vegetarian" id="vegetarian" className="form-check-input"
            checked={filters.dietPreferences.vegetarian} onChange={handleChange} />
          <label htmlFor="vegetarian" className="form-check-label">Vegetarian</label>
        </div>
        <div className="form-check">
          <input type="checkbox" name="nonVeg" id="nonVeg" className="form-check-input"
            checked={filters.dietPreferences.nonVeg} onChange={handleChange} />
          <label htmlFor="nonVeg" className="form-check-label">Non-Veg</label>
        </div>
        <div className="form-check">
          <input type="checkbox" name="glutenFree" id="glutenFree" className="form-check-input"
            checked={filters.dietPreferences.glutenFree} onChange={handleChange} />
          <label htmlFor="glutenFree" className="form-check-label">Gluten-Free</label>
        </div>
        <div className="form-check">
          <input type="checkbox" name="dairyFree" id="dairyFree" className="form-check-input"
            checked={filters.dietPreferences.dairyFree} onChange={handleChange} />
          <label htmlFor="dairyFree" className="form-check-label">Dairy-Free</label>
        </div>
      </div>

      <button onClick={onSearch} className="btn btn-primary">Search</button>
    </div>
  );
}
