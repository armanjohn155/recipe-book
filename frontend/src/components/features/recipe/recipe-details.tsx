import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { getRecipeService, type Recipe } from "@/services/recipe-service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { RecipeImage } from "@/components/features/recipe/recipe-image";
import UpdateRecipeForm from "@/components/features/recipe/update-recipe-form";

const difficultyStyles: Record<Recipe["difficulty"], string> = {
  Easy: "bg-easy text-ink",
  Medium: "bg-accent text-ink",
  Hard: "bg-secondary text-white",
};

function BackToRecipes({ className }: { className?: string }) {
  return (
    <Link
      to="/user"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/20 bg-[rgba(12,32,17,0.72)] px-4 py-2 text-sm font-medium text-white shadow-md backdrop-blur-md transition-colors hover:bg-[rgba(12,32,17,0.85)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to recipes
    </Link>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-1 text-xs text-white/60">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function LeftColumn({ src }: { src?: string }) {
  return (
    <div className="relative h-[40vh] md:sticky md:top-0 md:h-screen">
      <RecipeImage src={src} alt="" className="h-full w-full" iconClassName="h-16 w-16 md:h-24 md:w-24" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(7,22,9,0.65),transparent)]" />
      <BackToRecipes className="absolute left-4 top-4 z-10" />
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative h-[40vh] md:sticky md:top-0 md:h-screen">
        <div className="h-full w-full animate-pulse bg-white/10" />
        <BackToRecipes className="absolute left-4 top-4 z-10" />
      </div>
      <div className="bg-transparent">
        <div className="mx-auto w-full max-w-[560px] px-6 py-8 md:px-8 md:py-12">
          <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-[68px] animate-pulse rounded-xl bg-white/[0.06]" />
            ))}
          </div>
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecipeDetails({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRecipe(recipeId: string) {
      try {
        const result = await getRecipeService(recipeId);
        if (active) {
          setRecipe(result);
          setError("");
        }
      } catch {
        if (active) {
          setError("Recipe not found, or you do not have access to it.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecipe(id);

    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [id]);

  function openForm() {
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipe(updatedRecipe);
    closeForm();
  }

  if (loading) return <DetailsSkeleton />;

  if (error || !recipe) {
    return (
      <div className="grid min-h-screen md:grid-cols-2">
        <LeftColumn />
        <div className="flex items-center justify-center px-6 py-16 md:px-8">
          <div className="w-full max-w-[560px] text-center">
            <p role="alert" className="text-sm text-text-muted">
              {error || "Recipe not found, or you do not have access to it."}
            </p>
            <BackToRecipes className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <LeftColumn src={recipe.image} />

      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,200,120,0.10),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-[560px] px-6 py-8 md:px-8 md:py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-display text-[clamp(40px,5vw,64px)] leading-[1.05] font-semibold tracking-tight text-white">{recipe.name}</h1>
            <Button onClick={openForm}>Update</Button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <InfoTile label="Cook time" icon={<Clock className="h-3.5 w-3.5" />} value={`${recipe.cookTimeMinutes} min`} />
            <InfoTile
              label="Difficulty"
              value={
                <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold", difficultyStyles[recipe.difficulty])}>
                  {recipe.difficulty}
                </span>
              }
            />
            <InfoTile label="Cuisine" value={recipe.cuisine} />
          </div>

          {(recipe.mealType.length > 0 || recipe.tags.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {recipe.mealType.map((meal) => (
                <span key={meal} className="glass rounded-full px-3 py-1 text-xs font-medium text-white">
                  {meal}
                </span>
              ))}
              {recipe.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-white">Ingredients</h2>
              <ul className="mt-4 space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-white/90">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-easy" aria-hidden="true" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white">Instructions</h2>
              <ol className="mt-4 space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={`${instruction}-${index}`} className="flex items-start gap-3 text-sm leading-6 text-white/90">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={closeForm} title="Update Recipe">
        <UpdateRecipeForm recipe={recipe} onSuccess={handleUpdated} />
      </Modal>
    </div>
  );
}
