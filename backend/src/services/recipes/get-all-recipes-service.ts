import { RecipeRepository } from "@/repositories/recipe-repository";

export async function getAllRecipesService() {
  const recipeRepository = new RecipeRepository();
  try {
    const recipes = await recipeRepository.findAllWithOwners();
    return {
      code: 200,
      status: "success",
      message: "Recipes retrieved successfully",
      data: { recipes },
    };
  } catch (error) {
    console.error("getAllRecipesService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to get recipes",
    };
  }
}