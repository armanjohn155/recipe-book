import { RecipeRepository } from "@/repositories/recipe-repository";
import type { UpdateRecipeInput } from "@/schema/recipe-schema";

export async function updateRecipeService(id: string, data: UpdateRecipeInput, userId: string) {
  const recipeRepository = new RecipeRepository();
  try {
    const recipe = await recipeRepository.update(id, data, userId);
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
      message: "Recipe updated successfully",
      data: { recipe },
    };
  } catch (error) {
    console.error("updateRecipeService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to update recipe",
    };
  }
}