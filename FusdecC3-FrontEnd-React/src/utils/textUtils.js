/*function normalizeText(input) {
  // Define los caracteres que se reemplazarán y sus reemplazos
  const from = "séíóúAEIOU";
  const to = "aeiouAEIOU";

  // Crea un objeto para mapear los caracteres a reemplazar
  const mapping = {};
  for (let i = 0; i < from.length; i++) {
    mapping[from.charAt(i)] = to.charAt(i);
  }

  // Elimina caracteres especiales y convierte a minúsculas
  const result = input.replace(/[\s+]/g, '')
                       .split('')
                       .map(char => mapping[char] || char)
                       .join('')
                       .toLowerCase();

  return result;
}

export default normalizeText; */

function normalizeText(input) {
  // Define los caracteres que se reemplazarán y sus reemplazos
  const from = "séíóúáAEIOU"; // Incluye "á"
  const to = "seiouaAEIOU"; // Sustituye de manera correcta sin alterar las "s"

  // Crea un objeto para mapear los caracteres a reemplazar
  const mapping = {};
  for (let i = 0; i < from.length; i++) {
    mapping[from.charAt(i)] = to.charAt(i);
  }

  // Elimina caracteres especiales y convierte a minúsculas
  const result = input
    .replace(/\s+/g, "") // Elimina espacios
    .split("")
    .map((char) => mapping[char] || char)
    .join("")
    .toLowerCase();

  return result;
}

export default normalizeText;
