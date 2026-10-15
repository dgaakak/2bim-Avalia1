
const formulario = document.getElementById("formulario");
const campoNumero = document.getElementById("numero");
const campoEmail = document.getElementById("email");
const area = document.getElementById("desenho");
const mensagem = document.getElementById("mensagem");
const botaoBaixar = document.getElementById("baixar");

let svgAtual = "";

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensagem.textContent = "";
  area.innerHTML = "";
  botaoBaixar.hidden = true;

  const numero = Number(campoNumero.value);
  const email = campoEmail.value.trim();

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    mensagem.textContent = "Digite um inteiro entre 1 e 100.";
    return;
  }

  if (!email) {
    mensagem.textContent = "Informe um e-mail.";
    return;
  }

  mensagem.textContent = "Gerando desenho...";

  try {
    const resposta = await fetch("/api/desenho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero, email })
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || "Erro ao gerar o desenho.");
    }

    svgAtual = await resposta.text();
    area.innerHTML = svgAtual;
    botaoBaixar.hidden = false;
    mensagem.textContent = "Desenho gerado!";
  } catch (erro) {
    mensagem.textContent = erro.message || "Não foi possível gerar o desenho.";
  }
});

botaoBaixar.addEventListener("click", () => {
  if (!svgAtual) return;

  const arquivo = new Blob([svgAtual], { type: "image/svg+xml" });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement("a");
  link.href = url;
  link.download = "desenho.svg";
  link.click();
  URL.revokeObjectURL(url);
});
