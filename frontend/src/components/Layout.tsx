import { Outlet } from "react-router";

// Shared layout: every route renders inside this component via <Outlet />.
export default function Layout() {
  return <Outlet />;
}
