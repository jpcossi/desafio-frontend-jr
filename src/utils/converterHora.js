export default function converterHora(time) {
  const [hora, minutos] = time.split(":").map(Number);
  const periodo = hora >= 12 ? "PM" : "AM";
  const hora12 = hora % 12 || 12;
  return `${hora12} ${periodo}`;
}
