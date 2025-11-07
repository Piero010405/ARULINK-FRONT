import { render } from "@testing-library/react";
import ActivityChart from "@/components/activity-chart";

// Mock ResizeObserver (Recharts lo usa internamente)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;

// Mock ResponsiveContainer para que renderice directamente el contenido
jest.mock("recharts", () => {
  const Original = jest.requireActual("recharts");
  return {
    ...Original,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 500, height: 300 }}>{children}</div>
    ),
  };
});

test("ActivityChart se renderiza sin errores", () => {
  render(<ActivityChart />);
});
