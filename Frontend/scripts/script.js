const key = "18d4c68138a2f6f3a8477710d738d5be";
const cards = document.querySelector(".cards");

async function buscarCidade(cidade) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
    );
    const dados = await res.json();
    colocarDadosNaTela(dados);
  } catch (erro) {
    console.log("Erro ao buscar cidade:", erro);
  }
}

function colocarDadosNaTela(dados) {
  document.querySelector(".cidade").textContent = "Tempo em " + dados.name;
  document.querySelector(".temp").textContent = Math.floor(dados.main.temp) + "°C";
  document.querySelector(".texto-previsao").textContent = dados.weather[0].description;
  document.querySelector(".umidade").textContent = "Umidade: " + dados.main.humidity + "%";
  document.querySelector(".img-previsao").src =
    `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
}

function cliquenoBotao() {
  const cidade = document.querySelector(".input-cidade").value;
  if (cidade) buscarCidade(cidade);
}

async function listarTarefas() {
  try {
    const res = await fetch("http://localhost:3000/tarefas/listar");
    const tarefas = await res.json();

    cards.innerHTML = "";

    tarefas.forEach(tarefa => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img class="img-card" src="${tarefa.imagem || 'https://via.placeholder.com/300'}">
        <h2>${tarefa.nome}</h2>
        <p>Início: ${formatarData(tarefa.dataInicio)}</p>
        <p>Fim: ${tarefa.dataFim ? formatarData(tarefa.dataFim) : "Sem data"}</p>
      `;
      card.onclick = () => abrirModal(tarefa);
      cards.appendChild(card);
    });

  } catch (erro) {
    console.log("Erro ao listar tarefas:", erro);
  }
}

function abrirModal(tarefa) {
  const fundo = document.createElement("div");
  fundo.className = "modal-fundo";

  fundo.innerHTML = `
    <div class="modal">

      <img class="img-modal" src="${tarefa.imagem || 'https://via.placeholder.com/400'}">

      <h2>${tarefa.nome}</h2>

      <p><strong>Início:</strong> ${formatarData(tarefa.dataInicio)}</p>

      <p><strong>Fim:</strong> ${tarefa.dataFim ? formatarData(tarefa.dataFim) : "Sem data"}</p>

      <p><strong>Descrição:</strong></p>
      <textarea disabled>${tarefa.descricao}</textarea>

      <div class="botoes">
        <button id="editar">Editar</button>
        <button id="excluir">Excluir</button>
        <button id="fechar">Fechar</button>
      </div>
    </div>
  `;

  document.body.appendChild(fundo);

  fundo.querySelector("#fechar").onclick = () => fundo.remove();

  fundo.querySelector("#excluir").onclick = async () => {
    await fetch(`http://localhost:3000/tarefas/excluir/${tarefa.id}`, {
      method: "DELETE"
    });

    fundo.remove();
    listarTarefas();
  };

  fundo.querySelector("#editar").onclick = () => editarTarefa(fundo, tarefa);
}

function editarTarefa(fundo, tarefa) {
  const modal = fundo.querySelector(".modal");

  modal.innerHTML = `
    <h2>Atualizar tarefa</h2>

    <label>Nome</label>
    <input type="text" id="nome" value="${tarefa.nome}">

    <label>Imagem</label>
    <input type="text" id="imagem" value="${tarefa.imagem || ''}">

    <label>Data início</label>
    <input type="date" id="dataInicio" value="${tarefa.dataInicio?.split("T")[0] || ""}">

    <label>Data fim</label>
    <input type="date" id="dataFim" value="${tarefa.dataFim?.split("T")[0] || ""}">

    <label>Descrição</label>
    <textarea id="descricao">${tarefa.descricao}</textarea>

    <div class="botoes">
      <button id="salvar">Atualizar</button>
      <button id="cancelar">Cancelar</button>
    </div>
  `;

  modal.querySelector("#cancelar").onclick = () => fundo.remove();

  modal.querySelector("#salvar").onclick = async () => {

    const nome = modal.querySelector("#nome").value;
    const imagem = modal.querySelector("#imagem").value;
    const dataInicio = modal.querySelector("#dataInicio").value;
    const dataFim = modal.querySelector("#dataFim").value;
    const descricao = modal.querySelector("#descricao").value;

    await fetch(`http://localhost:3000/tarefas/atualizar/${tarefa.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        imagem,
        dataInicio: dataInicio ? new Date(dataInicio + "T00:00:00").toISOString() : null,
        dataFim: dataFim ? new Date(dataFim + "T00:00:00").toISOString() : null,
        descricao
      })
    });

    fundo.remove();
    listarTarefas();
  };
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

listarTarefas();
