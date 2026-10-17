import { useEffect, useState } from "react";
import { AdminRecipesTable } from "@/components/features/admin/admin-recipes-table";
import { getAllRecipesService, type AdminRecipe } from "@/services/recipe-service";

export function AdminRecipes() {
  const [recipes, setRecipes] = useState<AdminRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(function fetchRecipes() {
    let active = true;

    async function loadRecipes() {
      try {
        const result = await getAllRecipesService();
        if (active) {
          setRecipes(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Unable to load recipes. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, []);

  return (
    <>
      {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
      <AdminRecipesTable recipes={recipes} loading={loading} />
    </>
  );
}
