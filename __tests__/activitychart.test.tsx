import { render, screen } from "@testing-library/react";
import ActivityChart from "../components/ui/activity-chart";

test("ActivityChart se renderiza sin errores", () => {
  render(<ActivityChart />);
  expect(screen.getByText("Lun")).toBeInTheDocument(); // XAxis label
});
