import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function NavBar() {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
      <Link to="/expenses" className="[&.active]:font-bold">
        List
      </Link>
      <Link to="/create-expense" className="[&.active]:font-bold">
        Create
      </Link>
    </div>
  );
}

function Root() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <NavBar />
      </div>
      <hr />
      <Outlet />
    </>
  );
}
