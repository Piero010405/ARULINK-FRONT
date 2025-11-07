import { render, screen } from "@testing-library/react";
import StatCard from "../components/ui/stat-card";

test("StatCard muestra label, valor y icono", () => {
  render(<StatCard label="Casos totales" value="248" icon="📋" />);

  expect(screen.getByText("Casos totales")).toBeInTheDocument();
  expect(screen.getByText("248")).toBeInTheDocument();
  expect(screen.getByText("📋")).toBeInTheDocument();
});
