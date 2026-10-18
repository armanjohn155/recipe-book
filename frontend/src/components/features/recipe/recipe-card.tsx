import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { RecipeImage } from "@/components/features/recipe/recipe-image";
import type { Recipe } from "@/services/recipe-service";

type RecipeCardProps = {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
};

const difficultyStyles: Record<Recipe["difficulty"], string> = {
  Easy: "bg-easy text-ink",
  Medium: "bg-accent text-ink",
  Hard: "bg-secondary text-white",
};

function CardMenu({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${label}`}
        className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open && (
        <div role="menu" className="glass-menu absolute right-0 z-30 mt-1 w-40 rounded-xl p-1">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  return (
    <article className="glass glass-elevated glass-hover group flex h-full flex-col overflow-hidden rounded-2xl transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_50px_rgba(0,0,0,0.35)]">
      <Link to={`/recipe/${recipe.id}`} className="relative block" aria-label={`View ${recipe.name}`}>
        <RecipeImage
          src={recipe.image}
          alt={recipe.name}
          className="aspect-[4/3] w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
            difficultyStyles[recipe.difficulty],
          )}
        >
          {recipe.difficulty}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/recipe/${recipe.id}`}
            className="line-clamp-2 text-base font-semibold tracking-tight text-white transition-colors hover:text-accent"
          >
            {recipe.name}
          </Link>
          <CardMenu label={recipe.name} onEdit={() => onEdit(recipe)} onDelete={() => onDelete(recipe.id)} />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{recipe.cookTimeMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{recipe.cuisine}</span>
        </p>

        <div className="mt-auto pt-1">
          <Link
            to={`/recipe/${recipe.id}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-ink transition duration-150 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
