import { render, screen, fireEvent } from "@testing-library/react";
import ChatPanel from "@/components/chat-panel";

test("Renderiza mensajes iniciales correctamente", () => {
  render(<ChatPanel />);
  expect(screen.getByText("¿Cuál es el estado de mi caso?")).toBeInTheDocument();
  expect(
    screen.getByText("Su caso está en revisión. Se espera una resolución dentro de 5 días hábiles.")
  ).toBeInTheDocument();
});

test("No envía mensajes vacíos", () => {
  render(<ChatPanel />);
  const input = screen.getByPlaceholderText("Escribir mensaje...");
  const sendButton = screen.getByText("✉"); // botón correcto

  fireEvent.change(input, { target: { value: "   " } });
  fireEvent.click(sendButton);

  // No debe aparecer un mensaje vacío en el chat
  expect(screen.queryByText("   ")).not.toBeInTheDocument();
});

test("Muestra encabezado con nombre y tema de conversación", () => {
  render(<ChatPanel />);

  // El encabezado está en una sola línea:
  // "Rosa Soria — Caso pendiente"
  expect(screen.getByText(/Rosa Soria — Caso pendiente/)).toBeInTheDocument();
});

test("El botón de la conversación activa está resaltado", () => {
  render(<ChatPanel />);
  const activeButton = screen.getByText("Rosa Soria").closest("button");
  expect(activeButton).toHaveClass("bg-red-50");
});
