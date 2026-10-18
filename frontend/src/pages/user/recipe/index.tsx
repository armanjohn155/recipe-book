import { useParams } from "react-router";
import { RecipeDetails } from "@/components/features/recipe/recipe-details";

export default function RecipePage() {
  const { id } = useParams();

  // The page reads the URL; the feature fetches and displays that recipe.
  return id ? <RecipeDetails key={id} id={id} /> : null;
}
