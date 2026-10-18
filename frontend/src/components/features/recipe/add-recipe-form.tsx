import { useState, type SubmitEvent } from "react";
import { ArrowRight } from "lucide-react";
import { createRecipeService, type Recipe } from "@/services/recipe-service";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipInput } from "@/components/ui/chip-input";
import { RecipeImage } from "@/components/features/recipe/recipe-image";

type AddRecipeFormProps = {
  onSuccess: (newRecipe: Recipe) => void;
  onCancel: () => void;
};

type FormErrors = {
  name?: string;
  image?: string;
  cuisine?: string;
  difficulty?: string;
  cookTimeMinutes?: string;
  mealType?: string;
  tags?: string;
  ingredients?: string;
  instructions?: string;
};

const messages: FormErrors = {
  name: "Name is required",
  image: "Image URL is required",
  cuisine: "Cuisine is required",
  difficulty: "Difficulty is required",
  cookTimeMinutes: "Cook time is required",
  mealType: "Meal type is required",
  tags: "Tags are required",
  ingredients: "Ingredients are required",
  instructions: "Instructions are required",
};

const difficulties: Recipe["difficulty"][] = ["Easy", "Medium", "Hard"];
const mealTypeSuggestions = ["Breakfast", "Lunch", "Dinner"];

export default function AddRecipeForm({ onSuccess, onCancel }: AddRecipeFormProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState<Recipe["difficulty"]>("Easy");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("");
  const [mealType, setMealType] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [busy, setBusy] = useState(false);

  // show error if empty, remove error if has value
  const checkField = (field: keyof FormErrors, value: string) => {
    setErrors((current) => ({
      ...current,
      [field]: value.trim() === "" ? messages[field] : undefined,
    }));
  };

  const checkList = (field: "mealType" | "tags", value: string[]) => {
    setErrors((current) => ({
      ...current,
      [field]: value.length === 0 ? messages[field] : undefined,
    }));
  };

  const handleAddRecipe = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors: FormErrors = {};

    if (name.trim() === "") newErrors.name = messages.name;
    if (image.trim() === "") newErrors.image = messages.image;
    if (cuisine.trim() === "") newErrors.cuisine = messages.cuisine;
    if (cookTimeMinutes.trim() === "") newErrors.cookTimeMinutes = messages.cookTimeMinutes;
    if (mealType.length === 0) newErrors.mealType = messages.mealType;
    if (tags.length === 0) newErrors.tags = messages.tags;
    if (ingredients.trim() === "") newErrors.ingredients = messages.ingredients;
    if (instructions.trim() === "") newErrors.instructions = messages.instructions;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setBusy(true);

    try {
      const newRecipe = await createRecipeService({
        name,
        image,
        cuisine,
        difficulty,
        cookTimeMinutes: Number(cookTimeMinutes),
        mealType,
        tags,
        ingredients: ingredients.split("\n").filter((item) => item.trim() !== ""),
        instructions: instructions.split("\n").filter((item) => item.trim() !== ""),
      });

      onSuccess(newRecipe);
    } catch (error) {
      setSubmitError(typeof error === "object" && error !== null && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Unable to create recipe.")
        : "Unable to connect to the API.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleAddRecipe} className="flex min-h-full flex-col">
      <div className="flex-1 space-y-8">
        <section className="space-y-4">
          <h3 className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">Basics</h3>

          <div>
            <Label htmlFor="recipe-name" error={errors.name}>Name</Label>
            <Input id="recipe-name" type="text" value={name} onChange={(e) => { setName(e.target.value); checkField("name", e.target.value); }} onBlur={() => checkField("name", name)} error={errors.name} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="recipe-cuisine" error={errors.cuisine}>Cuisine</Label>
              <Input id="recipe-cuisine" type="text" value={cuisine} onChange={(e) => { setCuisine(e.target.value); checkField("cuisine", e.target.value); }} onBlur={() => checkField("cuisine", cuisine)} error={errors.cuisine} />
            </div>

            <div>
              <Label htmlFor="recipe-cook-time" error={errors.cookTimeMinutes}>Cook time</Label>
              <div className="relative">
                <Input id="recipe-cook-time" type="number" min="0" value={cookTimeMinutes} onChange={(e) => { setCookTimeMinutes(e.target.value); checkField("cookTimeMinutes", e.target.value); }} onBlur={() => checkField("cookTimeMinutes", cookTimeMinutes)} error={errors.cookTimeMinutes} className="pr-12" />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-white/60">min</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">Details</h3>

          <div>
            <Label error={errors.difficulty}>Difficulty</Label>
            <div role="group" aria-label="Difficulty" className="glass inline-flex rounded-xl p-1">
              {difficulties.map((level) => (
                <button
                  key={level}
                  type="button"
                  aria-pressed={difficulty === level}
                  onClick={() => setDifficulty(level)}
                  className={cn(
                    "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                    difficulty === level ? "bg-white text-ink" : "text-white/70 hover:text-white",
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="recipe-image" error={errors.image}>Image URL</Label>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <Input id="recipe-image" type="url" value={image} onChange={(e) => { setImage(e.target.value); checkField("image", e.target.value); }} onBlur={() => checkField("image", image)} placeholder="https://example.com/image.jpg" error={errors.image} />
              </div>
              <RecipeImage src={image.trim()} alt="Recipe preview" className="h-11 w-11 shrink-0 rounded-xl border border-glass-border" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">Categories</h3>

          <div>
            <Label htmlFor="recipe-meal-type" error={errors.mealType}>Meal type</Label>
            <ChipInput id="recipe-meal-type" value={mealType} onChange={(next) => { setMealType(next); checkList("mealType", next); }} placeholder="Type and press Enter" error={errors.mealType} suggestions={mealTypeSuggestions} />
          </div>

          <div>
            <Label htmlFor="recipe-tags" error={errors.tags}>Tags</Label>
            <ChipInput id="recipe-tags" value={tags} onChange={(next) => { setTags(next); checkList("tags", next); }} placeholder="Type and press Enter" error={errors.tags} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">Method</h3>

          <div>
            <Label htmlFor="recipe-ingredients" error={errors.ingredients}>Ingredients (one per line)</Label>
            <Textarea id="recipe-ingredients" value={ingredients} onChange={(e) => { setIngredients(e.target.value); checkField("ingredients", e.target.value); }} onBlur={() => checkField("ingredients", ingredients)} rows={4} error={errors.ingredients} />
          </div>

          <div>
            <Label htmlFor="recipe-instructions" error={errors.instructions}>Instructions (one per line)</Label>
            <Textarea id="recipe-instructions" value={instructions} onChange={(e) => { setInstructions(e.target.value); checkField("instructions", e.target.value); }} onBlur={() => checkField("instructions", instructions)} rows={4} error={errors.instructions} />
          </div>
        </section>

        {submitError && <p role="alert" className="text-sm text-error">{submitError}</p>}
      </div>

      <div className="glass-chrome sticky bottom-0 -mx-6 -mb-6 mt-8 flex justify-end gap-3 border-t border-white/10 px-6 py-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button type="submit" disabled={busy} className="inline-flex items-center gap-2">
          {busy ? "Saving…" : "Save recipe"}
          {!busy && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
