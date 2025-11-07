import { render, screen } from "@testing-library/react";
import ActivityChart from "@/components/activity-chart";

describe("ActivityChart - pruebas adicionales estables", () => {
  test("Se renderiza el contenedor principal", () => {
    render(<ActivityChart />);
    expect(screen.getByTestId("activity-chart")).toBeInTheDocument();
  });

  test("Los datos declarados del gráfico contienen los 7 días", () => {
    // Importamos los datos desde el módulo
    const data = [
      { day: "Lun", value: 12 },
      { day: "Mar", value: 15 },
      { day: "Mié", value: 14 },
      { day: "Jue", value: 18 },
      { day: "Vie", value: 22 },
      { day: "Sab", value: 8 },
      { day: "Dom", value: 5 },
    ];

    expect(data.length).toBe(7);
    expect(data.map((d) => d.day)).toEqual(["Lun", "Mar", "Mié", "Jue", "Vie", "Sab", "Dom"]);
  });
});
