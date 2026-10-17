import { RecipeRepository } from "@/repositories/recipe-repository";

export async function getRecipesService(userId: string) {
  const recipeRepository = new RecipeRepository();
  try {
    const recipes = await recipeRepository.findAll(userId);
    return {
      code: 200,
      status: "success",
      message: "Recipes retrieved successfully",
      data: { recipes },
    };
  } catch (error) {
    console.error("getRecipesService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to get recipes",
    };
  }
}