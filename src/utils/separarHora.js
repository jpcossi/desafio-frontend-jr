import converterHora from "./converterHora.js";

export default function separarDiaHora(dataInicio, dataFim) {
  const [dataInicioData, dataInicioHora] = dataInicio.split("T");
  const diaInicio = dataInicioData.split("-")[2];
  return {
    dataInicioDia: diaInicio,
    inicioEvento: converterHora(dataInicioHora),
    fimEvento: converterHora(dataFim.split("T")[1]),
  };
}
