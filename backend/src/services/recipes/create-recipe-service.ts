import { RecipeRepository } from "@/repositories/recipe-repository";
import type { CreateRecipeInput } from "@/schema/recipe-schema";

export async function createRecipeService(data: CreateRecipeInput, userId: string) {
  const recipeRepository = new RecipeRepository();
  try {
    const recipe = await recipeRepository.create(data, userId);
    return {
      code: 201,
      status: "success",
      message: "Recipe created successfully",
      data: { recipe },
    };
  } catch (error) {
    console.error("createRecipeService error", error);
    return {
      code: 500,
      status: "error",
      message: "Unable to create recipe",
    };
  }
}