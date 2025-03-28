import converterHora from "../utils/converterHora.js";
import getHoraIndex from "../utils/getHoraIndex.js";
import hexToRgba from "../utils/hexToRgba.js";
import separarDiaHora from "../utils/separarHora.js";
import getEvent from "../services/getEvents.js";

const agendaBody = document.getElementById("agenda-body");
const horarios = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const eventos = await getEvent();

let eventosAgrupados = {};

let currentWeekStartDate = new Date();

const startOfWeek = new Date(currentWeekStartDate);
startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(endOfWeek.getDate() + 6);

const table = document.querySelector("table");
const timeBar = document.createElement("div");
timeBar.classList.add("linha-horario");
table.appendChild(timeBar);

horarios.forEach((horario) => {
  let tr = document.createElement("tr");

  let tdHorario = document.createElement("td");
  let borderTop = document.createElement("div");

  tdHorario.textContent = horario;
  tdHorario.classList.add("horario");
  borderTop.classList.add("border-top");

  tdHorario.appendChild(borderTop);
  tr.appendChild(tdHorario);
  for (let i = startOfWeek.getDate(); i <= endOfWeek.getDate(); i++) {
    let td = document.createElement("td");
    td.setAttribute("data-hora", horario);
    td.setAttribute("data-dia", i);
    td.style.position = "relative";
    tr.appendChild(td);
  }

  agendaBody.appendChild(tr);
});

function updateWeekDates() {
  const startOfWeek = new Date(currentWeekStartDate);
  const dayOfWeek = startOfWeek.getDay();

  startOfWeek.setDate(currentWeekStartDate.getDate() - dayOfWeek);

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    const dayElement = document.getElementById(`dia${i + 1}-data`);
    const weekdayElement = document.getElementById(`dia${i + 1}-dia`);
    const monthElement = document.getElementById(`dia${i + 1}-p`);

    dayElement.textContent = currentDay.getDate();
    weekdayElement.textContent = daysOfWeek[i];
    monthElement.textContent = monthNames[currentDay.getMonth()];
  }

  const rows = document.querySelectorAll("#agenda-body tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td[data-hora]");

    cells.forEach((cell, index) => {
      const cellDate = new Date(startOfWeek);
      cellDate.setDate(startOfWeek.getDate() + index);

      cell.setAttribute("data-dia", cellDate.getDate());
    });
  });
}

function updateTimeBar() {
  const hour = converterHora(
    startOfWeek.getHours() + ":" + startOfWeek.getMinutes()
  );
  const minutes = startOfWeek.getMinutes();
  let startCell = document.querySelector(`td[data-hora="${hour}"]`);

  if (startCell) {
    let cellPosition = startCell.getBoundingClientRect();
    let topBar = cellPosition.top + (minutes / 60) * cellPosition.height - 128;
    timeBar.style.top = `${topBar + window.scrollY}px`;
    timeBar.style.left = `${cellPosition.left - 17}px`;
  }
}
function subscribeEvents() {
  document.getElementById("next-week").addEventListener("click", () => {
    document.getElementById("next-week").disabled = true;

    table.classList.remove("table-right");
    table.classList.add("table-left");

    setTimeout(() => {
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);

      destacarDiaAtual();
      updateWeekDates();
      marcarEventos();

      table.classList.remove("table-left");
      table.classList.add("table-right");
    }, 400);

    setTimeout(() => {
      table.classList.remove("table-right");
      document.getElementById("next-week").disabled = false;
    }, 550);
  });

  document.getElementById("previous-week").addEventListener("click", () => {
    document.getElementById("previous-week").disabled = true;

    table.classList.remove("table-left");
    table.classList.add("table-right");

    setTimeout(() => {
      currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);

      destacarDiaAtual();
      updateWeekDates();
      marcarEventos();

      table.classList.remove("table-right");
      table.classList.add("table-left");
    }, 400);

    setTimeout(() => {
      table.classList.remove("table-left");
      document.getElementById("previous-week").disabled = false;
    }, 550);
  });
  window.addEventListener("resize", updateTimeBar);
}

function marcarEventos() {
  document.querySelectorAll(".evento").forEach((evento) => evento.remove());

  eventosAgrupados = {};
  eventos.forEach((evento) => {
    const eventoData = separarDiaHora(evento.data_inicio, evento.data_fim);

    const startOfWeek = new Date(currentWeekStartDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(currentWeekStartDate.getDate() - dayOfWeek);

    const weekEndDate = new Date(startOfWeek);
    weekEndDate.setDate(startOfWeek.getDate() + 6);

    const weekStartDay = startOfWeek.getDate();
    const weekEndDay = weekEndDate.getDate();
    const weekStartMonth = startOfWeek.getMonth();
    const weekEndMonth = weekEndDate.getMonth();
    const weekStartYear = startOfWeek.getFullYear();
    const weekEndYear = weekEndDate.getFullYear();

    const eventoDataInicio = new Date(evento.data_inicio);
    const eventoDataFim = new Date(evento.data_fim);

    const eventoDentroDaSemana =
      (eventoDataInicio >= startOfWeek && eventoDataInicio <= weekEndDate) ||
      (eventoDataFim >= startOfWeek && eventoDataFim <= weekEndDate) ||
      (eventoDataInicio <= startOfWeek && eventoDataFim >= weekEndDate);

    const eventoIniciaNaSemana =
      (eventoDataInicio.getFullYear() === weekStartYear &&
        eventoDataInicio.getMonth() === weekStartMonth &&
        eventoDataInicio.getDate() >= weekStartDay) ||
      (eventoDataInicio.getFullYear() === weekEndYear &&
        eventoDataInicio.getMonth() === weekEndMonth &&
        eventoDataInicio.getDate() <= weekEndDay);

    if (eventoDentroDaSemana && eventoIniciaNaSemana) {
      let inicioIndex = getHoraIndex(eventoData.inicioEvento, horarios);
      let fimIndex = getHoraIndex(eventoData.fimEvento, horarios);
      let chave = `${eventoData.dataInicioDia}`;

      if (!eventosAgrupados[chave]) {
        eventosAgrupados[chave] = [];
      }

      eventosAgrupados[chave].push({ ...evento, inicioIndex, fimIndex });
    }

    let novoEventosAgrupados = {};

    Object.keys(eventosAgrupados).forEach((chave) => {
      let chaveSemZero = parseInt(chave, 10).toString();
      novoEventosAgrupados[chaveSemZero] = eventosAgrupados[chave];
    });

    if (novoEventosAgrupados !== "") {
      eventosAgrupados = novoEventosAgrupados;
    }
  });

  Object.keys(eventosAgrupados).forEach((dia) => {
    let eventosDoDia = eventosAgrupados[dia];
    for (let i = 0; i < eventosDoDia.length; i++) {
      let primeiraCelula = document.querySelector(
        `td[data-hora="${
          horarios[eventosDoDia[i].inicioIndex]
        }"][data-dia="${dia}"]`
      );

      if (primeiraCelula) {
        let divEvento = document.createElement("div");
        let textElement = document.createElement("p");
        divEvento.appendChild(textElement);
        textElement.textContent = eventosDoDia[i].nome;
        divEvento.classList.add("evento");

        let duracao =
          eventosDoDia[i].fimIndex - eventosDoDia[i].inicioIndex + 1;

        let totalEventos = eventosDoDia.length;
        let espacoTotal = 10;
        let espacoEntreEventos = 5;
        let larguraDisponivel = 100 - espacoTotal;
        let larguraPorEvento =
          (larguraDisponivel - espacoEntreEventos * (totalEventos - 1)) /
          totalEventos;

        let left = 5 + i * (larguraPorEvento + espacoEntreEventos);

        divEvento.style.height = `${duracao * 60}px`;
        divEvento.style.marginTop = "5px";
        divEvento.style.width = `${larguraPorEvento}%`;
        divEvento.style.left = `${left}%`;
        divEvento.style.top = "0";
        divEvento.style.backgroundColor = hexToRgba(eventosDoDia[i].cor);

        divEvento.addEventListener("mouseenter", () => {
          divEvento.style.backgroundColor = hexToRgba(eventosDoDia[i].cor, 1);
        });
        divEvento.addEventListener("mouseleave", () => {
          divEvento.style.backgroundColor = hexToRgba(eventosDoDia[i].cor);
        });

        primeiraCelula.appendChild(divEvento);
      }
    }
  });
}

function destacarDiaAtual() {
  const day = new Date();
  const currentDay = day.getDate();

  document.querySelectorAll("th").forEach((th) => {
    th.classList.remove("dia-atual");
  });

  document.querySelectorAll("th .dia h1").forEach((h1, index) => {
    const month = document.getElementById(`dia${index + 1}-p`);
    if (
      parseInt(h1.textContent, 10) === currentDay &&
      monthNames.indexOf(month.textContent) === day.getMonth()
    ) {
      h1.closest("th").classList.add("dia-atual");
    }
  });
}

subscribeEvents();
updateWeekDates();
marcarEventos();
updateTimeBar();
destacarDiaAtual();
