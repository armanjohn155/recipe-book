import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { ArrowRight, Search, Utensils } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { deleteRecipeService, getRecipesService, type Recipe } from "@/services/recipe-service";
import { AppTopBar } from "@/components/common/app-top-bar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RecipeCard from "@/components/features/recipe/recipe-card";
import AddRecipeForm from "@/components/features/recipe/add-recipe-form";
import UpdateRecipeForm from "@/components/features/recipe/update-recipe-form";
import { cn } from "@/lib/cn";

function RecipeCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="aspect-[4/3] w-full animate-pulse bg-white/10" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-2/3 rounded-full bg-white/10" />
        <div className="h-5 w-full rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function EmptyState({ title, message, onAddRecipe }: { title: string; message: string; onAddRecipe: () => void }) {
  return (
    <div className="glass rounded-2xl border-dashed px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
        <Utensils className="h-6 w-6" />
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-muted">{message}</p>
      <Button className="mt-6 inline-flex items-center gap-2" onClick={onAddRecipe}>
        Add Recipe
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function RecipeCollection() {
  const { user, ready } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(function fetchRecipes() {
    if (!ready || !user) {
      return;
    }

    let active = true;

    async function loadRecipes() {
      try {
        const result = await getRecipesService();
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

    // Ignore a response if the account changes or this feature is removed.
    function cleanup() {
      active = false;
    }

    return cleanup;
  }, [ready, user]);

  async function handleDelete(id: string) {
    if (!confirm("Do you want to delete this recipe?")) return;
    try {
      await deleteRecipeService(id);
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    } catch {
      setError("Unable to delete this recipe. Please try again.");
    }
  }

  if (!ready) return null;

  if (!user) return <Navigate to="/auth/login" replace />;

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(recipe: Recipe) {
    setEditing(recipe);
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    setEditing(null);
  }

  function handleCreated(newRecipe: Recipe) {
    setRecipes((currentRecipes) => [newRecipe, ...currentRecipes]);
    closeForm();
  }

  function handleUpdated(updatedRecipe: Recipe) {
    setRecipes((currentRecipes) =>
      currentRecipes.map((recipe) => (recipe.id === updatedRecipe.id ? updatedRecipe : recipe)),
    );
    closeForm();
  }

  const mealTypes = Array.from(new Set(recipes.flatMap((recipe) => recipe.mealType)));
  const term = search.trim().toLowerCase();
  const filtered = recipes.filter((recipe) => {
    const matchesSearch =
      term === "" ||
      recipe.name.toLowerCase().includes(term) ||
      recipe.cuisine.toLowerCase().includes(term) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(term));
    const matchesMeal = mealFilter === "All" || recipe.mealType.includes(mealFilter);
    const matchesDifficulty = difficultyFilter === "All" || recipe.difficulty === difficultyFilter;
    return matchesSearch && matchesMeal && matchesDifficulty;
  });

  return (
    <>
      <AppTopBar onAddRecipe={openCreate} />

      <main className="relative mx-auto max-w-[1200px] overflow-hidden px-4 py-8 sm:px-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 h-80 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,200,120,0.10),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border border-white/10"
        />
        <div className="relative mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-[clamp(32px,4vw,52px)] leading-[1.05] font-semibold tracking-tight text-white">Your recipes</h1>
            <p className="mt-1 text-sm text-text-muted">
              {recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"} to inspire your next meal
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, cuisine, or tag"
              aria-label="Search recipes"
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative mb-6 flex flex-wrap items-center gap-2">
          {["All", ...mealTypes].map((meal) => (
            <button
              key={meal}
              type="button"
              aria-pressed={mealFilter === meal}
              onClick={() => setMealFilter(meal)}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                mealFilter === meal
                  ? "border-white bg-white text-ink"
                  : "glass glass-hover text-white",
              )}
            >
              {meal}
            </button>
          ))}

          <div className="w-full sm:ml-auto sm:w-40">
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              aria-label="Filter by difficulty"
              className="glass-field h-12 w-full rounded-xl px-3 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 [&>option]:bg-ink [&>option]:text-white"
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 text-sm text-error">{error}</p>}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </div>
        ) : recipes.length === 0 ? (
          <EmptyState
            title="A fresh page for your favorites"
            message="Save a family classic or something new you want to try."
            onAddRecipe={openCreate}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No recipes match your search"
            message="Try a different search term, or clear your filters to see everything."
            onAddRecipe={openCreate}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <Modal open={open} onClose={closeForm} title={editing ? "Edit Recipe" : "Add Recipe"}>
        {editing ? (
          <UpdateRecipeForm recipe={editing} onSuccess={handleUpdated} />
        ) : (
          <AddRecipeForm onSuccess={handleCreated} onCancel={closeForm} />
        )}
      </Modal>
    </>
  );
}
