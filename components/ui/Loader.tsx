"use client";

export function Loader({ text = "Cargando..." }: { text?: string }) {
  return (
    // Contenedor principal para el overlay
    // fixed, inset-0: Cubre toda la pantalla y permanece fijo.
    // bg-black/50: Fondo negro con 50% de opacidad.
    // backdrop-blur-sm: Aplica un ligero desenfoque a lo que está detrás.
    // flex, items-center, justify-center: Centra el contenido (el loader) horizontal y verticalmente.
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Contenedor del Loader y el texto */}
      {/* Opcional: Puedes agregar un fondo blanco con padding y rounded para que el loader resalte más */}
      <div className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-md rounded-lg shadow-2xl gap-4 text-gray-600">
        <div className="h-10 w-10 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium">{text}</p>
      </div>
    </div>
  );
}