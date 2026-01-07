import { useState, useEffect } from "react";
import MealItem from "./MealItem";
import { API_BASE_URL } from "../config/api";

export default function Meals() {
  const [loadedMeals, setLoadedMeals] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMeals() {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/meals`);

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }

        const meals = await response.json();
        setLoadedMeals(meals);
        setError(null);
      } catch (err) {
        console.error(err);
        let errorMessage = "Failed to load meals";

        if (err instanceof TypeError) {
          errorMessage =
            `Unable to connect to server. Please check if the backend is running at ${API_BASE_URL}`;
        } else if (err.message.includes("Server error")) {
          errorMessage = err.message;
        } else {
          errorMessage = err.message || "Failed to load meals";
        }

        setError(errorMessage);
        setLoadedMeals([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMeals();
  }, []);

  return (
    <div>
      {error && (
        <div className="error">
          <p>❌ Error Loading Meals</p>
          <p>{error}</p>
        </div>
      )}
      {isLoading && !error && (
        <p style={{ textAlign: "center", padding: "20px" }}>Loading meals...</p>
      )}
      {!isLoading && !error && (
        <ul id="meals">
          {loadedMeals.map((meal) => (
            <MealItem key={meal.id} meal={meal} />
          ))}
        </ul>
      )}
    </div>
  );
}
