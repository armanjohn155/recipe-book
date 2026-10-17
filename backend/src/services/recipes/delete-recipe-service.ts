import { RecipeRepository } from "@/repositories/recipe-repository";

export async function deleteRecipeService(id: string, userId: string) {
  const recipeRepository = new RecipeRepository();
  try {
    const recipe = await recipeRepository.delete(id, userId);
    if (!recipe) {
      return {
        code: 404,
        status: "error",
        message: "Recipe not found",
      };
    }
    return {
      code: 200,
      status: "success",
      message: "Recipe deleted successfully",
    };
  } catch (error) {
    console.error("deleteRecipeService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to delete recipe",
    };
  }
}