import { createFileRoute } from "@tanstack/react-router";
import RiveComponent from "@rive-app/react-canvas";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container">
      <RiveComponent
        src="star_rating.riv"
        className="base-canvas-size"
        stateMachines="State Machine 1"
      />
    </div>
  );
}
