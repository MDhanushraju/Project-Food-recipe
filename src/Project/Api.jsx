export async function fetchCuisines() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  const data = await res.json();
  return data.meals.map(m => m.strArea).filter(Boolean);
}

export async function fetchMealsByIngredient(ingredient) {
  if (!ingredient.trim()) return [];
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
  );
  const data = await res.json();
  return data.meals || [];
}

export async function fetchMealDetails(id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  console.log(data)
  return data.meals?.[0] || null;
}
export async function fetchMealsByCuisine(cuisine) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(cuisine)}`
  );
  const data = await res.json();
  return data.meals || [];
}

export async function fetchVegetarianMeals() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian"
  );
  const data = await res.json();

  return data.meals || [];
}

export async function fetchNonVegMeals() {
  let categories = ["Beef", "Chicken", "Pork", "Lamb", "Seafood", "Goat"];
  let allMeals = [];
  for (let cat of categories) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
      );
      const data = await res.json();
      if (data.meals) {
        allMeals = allMeals.concat(data.meals);
      }
    } catch {}
  }
  return allMeals;
}
