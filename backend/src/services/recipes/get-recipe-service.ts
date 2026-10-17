import { RecipeRepository } from "@/repositories/recipe-repository";

export async function getRecipeService(id: string, userId: string) {
  const recipeRepository = new RecipeRepository();
  try {
    const recipe = await recipeRepository.findById(id, userId);
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
      message: "Recipe retrieved successfully",
      data: { recipe },
    };
  } catch (error) {
    console.error("getRecipeService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to get recipe",
    };
  }
}