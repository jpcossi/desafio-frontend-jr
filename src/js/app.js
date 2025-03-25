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
async function dataJSON() {
  try {
    const response = await fetch("../../eventos.json");
    if (!response.ok) {
      throw new Error("Erro ao carregar o arquivo JSON");
    }
    const data = await response.json();

    return data.eventos;
  } catch (error) {
    console.log("Erro:", error);
  }
}

horarios.forEach((horario) => {
  let tr = document.createElement("tr");

  let tdHorario = document.createElement("td");
  let borderTop = document.createElement("div");
  tdHorario.textContent = horario;
  tdHorario.classList.add("horario");
  borderTop.classList.add("border-top");

  tdHorario.appendChild(borderTop);
  tr.appendChild(tdHorario);

  for (let i = 0; i < 7; i++) {
    let td = document.createElement("td");
    td.setAttribute("data-hora", horario);
    td.setAttribute("data-dia", i);
    td.style.position = "relative";
    tr.appendChild(td);
  }

  agendaBody.appendChild(tr);
});

let currentWeekStartDate = new Date();

function updateWeekDates() {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
    monthElement.textContent = monthNames[currentDay.getMonth()];
  }
}

updateWeekDates();

document.getElementById("next-week").addEventListener("click", () => {
  currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
  updateWeekDates();
});

document.getElementById("previous-week").addEventListener("click", () => {
  currentWeekStartDate.setDate(currentWeekStartDate.getDate() - 7);
  updateWeekDates();
});

const eventos = [
  {
    dia: 1,
    inicio: "10 AM",
    fim: "1 PM",
    titulo: "Reunião A",
    color: "#FF5733",
  },
  {
    dia: 1,
    inicio: "12 PM",
    fim: "2 PM",
    titulo: "Reunião B",
    color: "#33B5FF",
  },
  { dia: 3, inicio: "2 PM", fim: "5 PM", titulo: "Workshop", color: "#FFC300" },
  { dia: 3, inicio: "2 PM", fim: "5 PM", titulo: "Mentoria", color: "#28A745" },
  {
    dia: 5,
    inicio: "9 AM",
    fim: "11 AM",
    titulo: "Apresentação",
    color: "#9B59B6",
  },
  {
    dia: 5,
    inicio: "9 AM",
    fim: "11 AM",
    titulo: "Treinamento",
    color: "#FF6F61",
  },
  { dia: 5, inicio: "9 AM", fim: "10 AM", titulo: "Call", color: "#3498DB" },
];

const eventos2 = await dataJSON();

function getHoraIndex(hora) {
  return horarios.indexOf(hora);
}
function converterHora(time) {
  const [hora, minutos] = time.split(":").map(Number);
  const periodo = hora >= 12 ? "PM" : "AM";
  const hora12 = hora % 12 || 12;
  return `${hora12} ${periodo}`;
}

function separarDiaHora(dataInicio, dataFim) {
  const [dataInicioData, dataInicioHora] = dataInicio.split("T");
  const [dataFimData, dataFimHora] = dataFim.split("T");

  const diaInicio = dataInicioData.split("-")[2];

  const inicioEvento = converterHora(dataInicioHora);
  const fimEvento = converterHora(dataFimHora);

  return {
    dataInicioDia: diaInicio,
    inicioEvento,
    fimEvento,
  };
}

let eventosAgrupados = {};

eventos2.forEach((evento) => {
  const eventoData = separarDiaHora(evento.data_inicio, evento.data_fim);
  let inicioIndex = getHoraIndex(eventoData.inicioEvento);
  let fimIndex = getHoraIndex(eventoData.fimEvento);
  let chave = `${eventoData.dataInicioDia}`;

  if (!eventosAgrupados[chave]) {
    eventosAgrupados[chave] = [];
  }

  eventosAgrupados[chave].push({ ...evento, inicioIndex, fimIndex });
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
      divEvento.textContent = eventosDoDia[i].nome;
      divEvento.classList.add("evento");

      let duracao = eventosDoDia[i].fimIndex - eventosDoDia[i].inicioIndex + 1;

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
      divEvento.style.backgroundColor = `${eventosDoDia[i].cor}`;

      primeiraCelula.appendChild(divEvento);
    }
  }
});
