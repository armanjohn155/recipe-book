// Shared branding for the login and signup pages.
export function AuthHeader() {
  return (
    <header className="mb-8 text-center">
      <p className="mb-4 text-xs font-medium tracking-widest text-white/80 uppercase">Your kitchen companion</p>
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Recipe Book</h1>
      <p className="mt-3 text-sm text-white/80">Keep your favorite meals in one place.</p>
    </header>
  );
}