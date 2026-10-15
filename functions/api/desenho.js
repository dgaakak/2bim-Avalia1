
import { gerarDesenho, numeroValido } from "../../public/desenho.js";

export async function onRequestPost({ request }) {
  try {
    const dados = await request.json();
    const numero = Number(dados.numero);
    const email = String(dados.email || "").trim();

    if (!numeroValido(numero)) {
      return Response.json(
        { erro: "Digite um inteiro entre 1 e 100." },
        { status: 400 }
      );
    }

    if (!email) {
      return Response.json(
        { erro: "Informe um e-mail." },
        { status: 400 }
      );
    }

    const svg = gerarDesenho(numero, email);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch {
    return Response.json(
      { erro: "Não foi possível gerar o desenho." },
      { status: 400 }
    );
  }
}
