document.addEventListener("DOMContentLoaded", function () {
  const avisoCookies = document.getElementById("aviso-cookies");
  const aceptarBoton = document.getElementById("aceptar-btn");
  const rechazarBoton = document.getElementById("rechazar-btn");

  // Verificar si ya se mostró el aviso de cookies en esta sesión
  if (!sessionStorage.getItem("aviso-cookies")) {
    avisoCookies.style.display = "block"; // Muestra el aviso de cookies
  }

  // Aceptar cookies
  aceptarBoton.addEventListener("click", () => {
    sessionStorage.setItem("aviso-cookies", "aceptado"); // Guardar aceptación en la sesión
    avisoCookies.style.display = "none"; // Ocultar el aviso de cookies
    // Aquí puedes agregar lógica adicional para habilitar cookies si fuera necesario
  });

  // Rechazar cookies
  rechazarBoton.addEventListener("click", () => {
    sessionStorage.setItem("aviso-cookies", "rechazado"); // Guardar rechazo en la sesión
    avisoCookies.style.display = "none"; // Ocultar el aviso de cookies
    // Aquí puedes agregar lógica adicional para deshabilitar cookies si fuera necesario
  });
});