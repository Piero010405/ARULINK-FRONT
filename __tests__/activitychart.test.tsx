import { render, screen } from "@testing-library/react";
import ActivityChart from "../components/activity-chart";
import '@testing-library/jest-dom';

test("ActivityChart se renderiza sin errores", () => {
  render(<ActivityChart />);
  expect(screen.getByText("Lun")).toBeInTheDocument(); // XAxis label
});
