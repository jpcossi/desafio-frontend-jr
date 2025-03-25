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
horarios.forEach((horario) => {
  let tr = document.createElement("tr");

  let tdHorario = document.createElement("td");
  tdHorario.textContent = horario;
  tdHorario.classList.add("horario");
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

const eventos = [
  { dia: 1, inicio: "10 AM", fim: "1 PM", titulo: "Reunião A" },
  { dia: 1, inicio: "12 PM", fim: "2 PM", titulo: "Reunião B" },
  { dia: 3, inicio: "2 PM", fim: "5 PM", titulo: "Workshop" },
  { dia: 3, inicio: "2 PM", fim: "5 PM", titulo: "Mentoria" },
  { dia: 5, inicio: "9 AM", fim: "11 AM", titulo: "Apresentação" },
  { dia: 5, inicio: "9 AM", fim: "11 AM", titulo: "Treinamento" },
  { dia: 5, inicio: "9 AM", fim: "10 AM", titulo: "Call" },
];

function getHoraIndex(hora) {
  return horarios.indexOf(hora);
}

let eventosAgrupados = {};

eventos.forEach((evento) => {
  let inicioIndex = getHoraIndex(evento.inicio);
  let fimIndex = getHoraIndex(evento.fim);
  let chave = `${evento.dia}`;

  if (!eventosAgrupados[chave]) {
    eventosAgrupados[chave] = [];
  }

  eventosAgrupados[chave].push({ ...evento, inicioIndex, fimIndex });
});

Object.keys(eventosAgrupados).forEach((dia) => {
  let eventosDoDia = eventosAgrupados[dia];
  console.log("eventos", eventosDoDia);
  let colunas = [];

  for (let i = 0; i < eventosDoDia.length; i++) {
    let primeiraCelula = document.querySelector(
      `td[data-hora="${horarios[eventosDoDia[i].inicioIndex]}"][data-dia="${
        eventosDoDia[i].dia
      }"]`
    );
    if (primeiraCelula) {
      let divEvento = document.createElement("div");
      divEvento.textContent = eventosDoDia[i].titulo;
      divEvento.classList.add("evento");

      let duracao = eventosDoDia[i].fimIndex - eventosDoDia[i].inicioIndex + 1;

      let larguraPorEvento = 100 / eventosDoDia.length;
      console.log(larguraPorEvento);
      let left = larguraPorEvento * i;

      divEvento.style.height = `${duracao * 50}px`;
      divEvento.style.width = `${larguraPorEvento}%`;
      divEvento.style.left = `${left}%`;
      divEvento.style.top = "0";

      primeiraCelula.appendChild(divEvento);
    }
  }
});
