// import jsPDF
const { jsPDF } = window.jspdf;

// variable para almacenar los jugadores y extras seleccionados
let mapaElemtosEquipo = new Map();

let infoJugadores = {};  // key = nombre.toLowerCase() 

// variables globales para los indicadores y la imagen
let dineroGastado = 0;
let jugadoresTotales = 0;
let indicadorDinero;
let indicadorJugadores;
let divIndicadores;
let txtErrorTesoreria;
let txtErrorJugadores;

// función para añadir jugador o extra
function aniadirJugador(nombre, cantidadMax, precio, spanCantidad, esExtra = false) {
  let cantidadActual = mapaElemtosEquipo.get(nombre) || 0;
  let limite = parseInt(cantidadMax.split("-")[1]);
  let costo = parseInt(precio.replace("k", ""));

  if (!esExtra && jugadoresTotales >= 16) {
    alert("No puedes tener más de 16 jugadores en tu equipo.");
    return;
  }

  if (cantidadActual < limite) {
    mapaElemtosEquipo.set(nombre, cantidadActual + 1);
    spanCantidad.textContent = `${mapaElemtosEquipo.get(nombre)}-${limite}`;

    dineroGastado += costo;
    if (!esExtra) jugadoresTotales++;
    actualizarIndicadores();
  } else {
    alert(`No puedes añadir más de ${limite} ${nombre}`);
  }
}

// función para eliminar jugador o extra
function eliminarJugador(nombre, cantidadMax, precio, spanCantidad, esExtra = false) {
  let cantidadActual = mapaElemtosEquipo.get(nombre) || 0;
  let limite = parseInt(cantidadMax.split("-")[1]);
  let costo = parseInt(precio.replace("k", ""));

  if (cantidadActual > 0) {
    mapaElemtosEquipo.set(nombre, cantidadActual - 1);
    spanCantidad.textContent = `${mapaElemtosEquipo.get(nombre)}-${limite}`;

    dineroGastado -= costo;
    if (!esExtra) jugadoresTotales--;
    actualizarIndicadores();
  }
}

// función para actualizar indicadores
function actualizarIndicadores() {
  indicadorDinero.textContent = `Tesorería gastada: ${dineroGastado}/1000k`;
  indicadorDinero.style.color = dineroGastado > 1000 ? "red" : "black";
  txtErrorTesoreria.style.visibility = dineroGastado > 1000 ? "visible" : "hidden";

  indicadorJugadores.textContent = `Jugadores: ${jugadoresTotales}/16`;
  indicadorJugadores.style.color = jugadoresTotales < 11 ? "red" : "black";
  txtErrorJugadores.style.visibility = jugadoresTotales < 11 ? "visible" : "hidden";
}

// función auxiliar para crear tabla de estadísticas
function crearTablaEstadisticas(contenedorEstadisticas, tdMovimiento, tdFuerza, tdAgilidad, tdPase, tdArmadura) {
  const estadisticas = [
    ["MV", tdMovimiento],
    ["FU", tdFuerza],
    ["AG", tdAgilidad],
    ["PA", tdPase],
    ["AR", tdArmadura]
  ];

  estadisticas.forEach(([texto, td]) => {
    let tr = document.createElement("tr");
    let label = document.createElement("td");
    label.textContent = texto;
    tr.appendChild(label);
    tr.appendChild(td);
    contenedorEstadisticas.appendChild(tr);
  });
}

// función genérica para crear tarjetas
function crearTarjetaGenerica(section, nombre, limite, precio, mv, fu, ag, pa, ar, habilidades, esExtra = false) {
  let div = document.createElement("div");
  let tdCantidad = document.createElement("span");
  let tdAlineacion = document.createElement("span");
  let tdPrecio = document.createElement("span");
  let contenedorEstadisticas = document.createElement("table");
  let tdMovimiento = document.createElement("td");
  let tdFuerza = document.createElement("td");
  let tdAgilidad = document.createElement("td");
  let tdPase = document.createElement("td");
  let tdArmadura = document.createElement("td");
  let tdHabilidades = document.createElement("span");
  let btnAniadir = document.createElement("button");
  let btnEliminar = document.createElement("button");

  tdCantidad.textContent = (mapaElemtosEquipo.get(nombre.toLowerCase()) || 0) + `-${limite}`;
  tdAlineacion.textContent = nombre;
  tdPrecio.textContent = precio;
  tdMovimiento.textContent = mv || "-";
  tdFuerza.textContent = fu || "-";
  tdAgilidad.textContent = ag || "-";
  tdPase.textContent = pa || "-";
  tdArmadura.textContent = ar || "-";
  tdHabilidades.textContent = habilidades || "-";

  btnAniadir.textContent = "Añadir";
  btnEliminar.textContent = "Eliminar";

  btnAniadir.addEventListener("click", (event) => {
    event.preventDefault();
    aniadirJugador(nombre.toLowerCase(), tdCantidad.textContent, precio, tdCantidad, esExtra);
  });

  btnEliminar.addEventListener("click", (event) => {
    event.preventDefault();
    eliminarJugador(nombre.toLowerCase(), tdCantidad.textContent, precio, tdCantidad, esExtra);
  });

  div.appendChild(tdCantidad);
  div.appendChild(tdAlineacion);
  div.appendChild(tdPrecio);

  if (!esExtra) {
    crearTablaEstadisticas(contenedorEstadisticas, tdMovimiento, tdFuerza, tdAgilidad, tdPase, tdArmadura);
    div.appendChild(contenedorEstadisticas);
  }

  tdHabilidades.style.backgroundColor = "white";
  div.appendChild(tdHabilidades);
  div.appendChild(btnAniadir);
  div.appendChild(btnEliminar);
  section.appendChild(div);

  // Aplicar clases y áreas
  div.className = "tarjeta";
  tdAlineacion.style.gridArea = "tipo";
  tdCantidad.style.gridArea = "cantidad";
  contenedorEstadisticas.style.gridArea = "estadisticas";
  tdHabilidades.style.gridArea = "habilidades";
  tdPrecio.style.gridArea = "precio";
  btnAniadir.style.gridArea = "aniadir";
  btnEliminar.style.gridArea = "eliminar";
  contenedorEstadisticas.className = "equipo";

  infoJugadores[nombre.toLowerCase()] = {
    nombre,
    limite,
    precio,
    mv,
    fu,
    ag,
    pa,
    ar,
    habilidades
};

}

// equipo humano
function mostrarHumanos(section) {
  crearTarjetaGenerica(section, "Línea", 16, "50k", "6", "3", "3+", "4+", "9+", "-");
  crearTarjetaGenerica(section, "Thrower", 2, "80k", "6", "3", "3+", "2+", "9+", "Manos seguras, Pasar");
  crearTarjetaGenerica(section, "Catcher", 4, "65k", "8", "2", "3+", "5+", "8+", "Atrapar, Esquivar");
  crearTarjetaGenerica(section, "Blitzer", 4, "85k", "7", "3", "3+", "4+", "9+", "Placar");
  crearTarjetaGenerica(section, "Halfling", 3, "30k", "5", "2", "3+", "4+", "7+", "Escurridizo, Esquivar, Humanoide bala");
  crearTarjetaGenerica(section, "Ogre", 1, "140k", "5", "5", "4+", "5+", "10+", "Estúpido, Solitario (4+), Golpe mortífero(+1), Cabeza dura, Lanzar compañero");
  mostrarExtras(section, "humanos");
}

// equipo orco
function mostrarOrcos(section) {
  crearTarjetaGenerica(section, "Orco Línea", 16, "50k", "5", "3", "3+", "4+", "10+", "-");
  crearTarjetaGenerica(section, "Thrower", 2, "65k", "5", "3", "3+", "3+", "9+", "Animosidad, Manos seguras, Pasar");
  crearTarjetaGenerica(section, "Blitzer", 4, "80k", "6", "3", "3+", "4+", "10+", "Animosidad, Placar");
  crearTarjetaGenerica(section, "Big Un Blocker", 4, "90k", "5", "4", "4+", "-", "10+", "Animosidad");
  crearTarjetaGenerica(section, "Goblin", 4, "40k", "6", "2", "3+", "4+", "8+", "Escurridizo, Esquivar");
  crearTarjetaGenerica(section, "Untrained Troll", 1, "115k", "4", "5", "5+", "5+", "10+", "Solitario, Estúpido, Regeneración");
  mostrarExtras(section, "orcos");
}

// extras finales
function mostrarExtras(section, tipoEquipo) {
  let rerollPrecio = tipoEquipo === "orcos" ? "60k" : "50k";
  crearTarjetaGenerica(section, "Reroll", 8, rerollPrecio, "-", "-", "-", "-", "-", "Repetir tiradas", true);
  crearTarjetaGenerica(section, "Ayudantes de entrenador", 6, "10k", "-", "-", "-", "-", "-", "Ayudan en alguna tirada de patada incial", true);
  crearTarjetaGenerica(section, "Animadoras", 6, "10k", "-", "-", "-", "-", "-", "Ayudan en alguna tirada de patada incial", true);
  crearTarjetaGenerica(section, "Fan Factor", 6, "10k", "-", "-", "-", "-", "-", "Ayudan en alguna tirada de patada inicial y en la tirada de ingresos en liga", true);
  crearTarjetaGenerica(section, "Apotecario", 1, "50k", "-", "-", "-", "-", "-", "Permite repetir una tirada de lesión", true);
}

// función principal
function mostrarEquipoSeleccionado() {
  let section = document.getElementById("informacionEquipo");
  section.innerHTML = "";

  mapaElemtosEquipo = new Map();
  dineroGastado = 0;
  jugadoresTotales = 0;

  divIndicadores = document.createElement("div");
  divIndicadores.id = "indicadores";

  let divIndicadorTesoreria = document.createElement("div");
  let divIndicadorJugadores = document.createElement("div");

  indicadorDinero = document.createElement("h3");
  indicadorJugadores = document.createElement("h3");

  indicadorDinero.textContent = `Tesorería gastada: ${dineroGastado}/1000k`;
  indicadorJugadores.textContent = `Jugadores: ${jugadoresTotales}/16`;
  indicadorJugadores.style.color = "red";

  txtErrorTesoreria = document.createElement("span");
  txtErrorTesoreria.textContent = "❗";
  txtErrorTesoreria.className = "animacionError";
  txtErrorTesoreria.style.visibility = "hidden";

  txtErrorJugadores = document.createElement("span");
  txtErrorJugadores.textContent = "❗";
  txtErrorJugadores.className = "animacionError";

  divIndicadorTesoreria.appendChild(indicadorDinero);
  divIndicadorTesoreria.appendChild(txtErrorTesoreria);

  divIndicadorJugadores.appendChild(indicadorJugadores);
  divIndicadorJugadores.appendChild(txtErrorJugadores);

  divIndicadores.appendChild(divIndicadorTesoreria);
  divIndicadores.appendChild(divIndicadorJugadores);
  divIndicadores.className="superior";
  section.appendChild(divIndicadores);

  switch (select.value) {
    case "humanos":
      mostrarHumanos(section);
      break;
    case "orcos":
      mostrarOrcos(section);
      break;
  }
}

// select
let select = document.getElementById("equipos");

let humanos = document.createElement("option");
humanos.text = "Humanos";
humanos.value = "humanos";
select.appendChild(humanos);

let orcos = document.createElement("option");
orcos.text = "Orcos";
orcos.value = "orcos";
select.appendChild(orcos);

select.addEventListener("change", mostrarEquipoSeleccionado);
mostrarEquipoSeleccionado();

// función para generar el PDF
function generarPDF(event) {
  event.preventDefault();

  if (dineroGastado <= 1000 && jugadoresTotales >= 11) {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });

    // ===========================
    //   TÍTULO DEL EQUIPO
    // ===========================

    const nombreEquipo = select.options[select.selectedIndex].text;

    doc.setFontSize(18);
    doc.text(`Equipo: ${nombreEquipo}`, 14, 15);

    // ===========================
    //   TABLA DE JUGADORES (fila por jugador)
    // ===========================

    let dorsal = 1;
    const jugadores = [];

    for (let [nombre, cantidad] of mapaElemtosEquipo.entries()) {

      const j = infoJugadores[nombre];

      // Jugadores = elementos con estadísticas (es decir, mv != "-")
      if (cantidad > 0 && j && j.mv !== "-") {

        for (let i = 0; i < cantidad; i++) {
          jugadores.push([
            dorsal,        // Dorsal (nuevo)
            j.nombre,      // Posición
            "",            // Tags (nuevo)
            "",            // Nombre (nuevo)
            j.precio,      // Precio
            j.mv,
            j.fu,
            j.ag,
            j.pa,
            j.ar,
            j.habilidades,
            "Pri",
            "Sec"
          ]);
          dorsal++;
        }
      }
    }

    doc.autoTable({
      startY: 25,
      head: [[
        'Dorsal',
        'Posición',
        'Tags',
        'Nombre',
        'Precio',
        'MV',
        'FU',
        'AG',
        'PA',
        'AR',
        'Habilidades',
        'Pri',
        'Sec'
      ]],
      body: jugadores,
      theme: 'grid',
      headStyles: { fillColor: [50, 50, 50], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' }, // dorsal
        1: { cellWidth: 28 }, // posición
        2: { cellWidth: 20 }, // tags
        3: { cellWidth: 35 }, // nombre
        4: { cellWidth: 20 }, // precio
        5: { cellWidth: 12 }, // mv
        6: { cellWidth: 12 }, // fu
        7: { cellWidth: 12 }, // ag
        8: { cellWidth: 12 }, // pa
        9:{ cellWidth: 12 }, // ar
        10:{ cellWidth: 45 },  // habilidades
        11:{ cellWidth: 12 }, // ar
        12:{ cellWidth: 12 } // ar
      }
    });

    // ===========================
    //   TABLA DE EXTRAS (igual que antes)
    // ===========================

    const extras = [];

    for (let [nombre, cantidad] of mapaElemtosEquipo.entries()) {

      const j = infoJugadores[nombre];

      if (cantidad > 0 && j && j.mv === "-") {

        extras.push([
          j.nombre,
          cantidad,
          j.limite,
          j.precio,
          j.habilidades
        ]);
      }
    }

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [[
        'Extra',
        'Cantidad',
        'Límite',
        'Precio',
        'Descripción'
      ]],
      body: extras,
      theme: 'grid',
      headStyles: { fillColor: [30, 30, 30], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 2 }
    });

    // ===========================
    //   GUARDAR PDF
    // ===========================

    doc.save(`${nombreEquipo}.pdf`);

  } else {
    alert("Debes tener un mínimo de 11 jugadores y un máximo de 1000k gastados.");
  }
}




// evento para botón
document.getElementById("btnValidar").addEventListener("click", generarPDF);