import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatPanel from "../components/chat-panel";
import '@testing-library/jest-dom';

test("ChatPanel permite enviar mensaje", async () => {
  render(<ChatPanel />);

  const input = screen.getByPlaceholderText("Escribe un mensaje...");
  const button = screen.getByRole("button", { name: /enviar/i });

  await userEvent.type(input, "Hola");
  await userEvent.click(button);

  expect(screen.getByText("Hola")).toBeInTheDocument();
});
