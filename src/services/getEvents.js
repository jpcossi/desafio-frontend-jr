export default async function dataJSON() {
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
