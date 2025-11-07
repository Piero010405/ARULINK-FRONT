import { render, screen } from "@testing-library/react";
import Dashboard from "../components/dashboard";
import '@testing-library/jest-dom';

test("Dashboard muestra título y tarjetas", () => {
  render(<Dashboard />);

  expect(screen.getByText("AruLink")).toBeInTheDocument();
  expect(screen.getByText("Casos totales")).toBeInTheDocument();
  expect(screen.getByText("Actividad Semanal")).toBeInTheDocument();
});
