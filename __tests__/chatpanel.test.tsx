import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatPanel from "@/components/chat-panel";

test("permite escribir y enviar un mensaje", async () => {
  const user = userEvent.setup();
  render(<ChatPanel />);

  const input = screen.getByPlaceholderText("Escribir mensaje...");
  const sendButton = screen.getByTestId("send-button");

  await user.type(input, "Hola");
  await user.click(sendButton);

  // Verifica que el mensaje enviado aparece inmediatamente
  expect(screen.getByText("Hola")).toBeInTheDocument();
});
