const btnAddTarefa = document.querySelector(".app__button--add-task");
const formAddTarefa = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const ultarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoTarefas = document.querySelector(
  ".app__section-active-task-description"
);

const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTudo = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaAtiva = null;
let litarefaAtiva = null;

function criarElementosTarefas(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
  `;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  const imgBtn = document.createElement("img");
  botao.classList.add("app_button-edit");

  imgBtn.setAttribute("src", "/imagens/edit.png");

  botao.append(imgBtn);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if (tarefa.completa) {
    litarefaAtiva.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "disabled");
  } else {
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaAtiva === tarefa) {
        paragrafoDescricaoTarefas.textContent = "";
        tarefaAtiva = null;
        litarefaAtiva = null;
        return;
      }
      tarefaAtiva = tarefa;
      litarefaAtiva = li;
      paragrafoDescricaoTarefas.textContent = tarefa.descricao;
      li.classList.add("app__section-task-list-item-active");
    };
  }
  return li;
}

btnAddTarefa.addEventListener("click", () => {
  formAddTarefa.classList.toggle("hidden");
});

formAddTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const tarefa = {
    descricao: textarea.value,
  };
  tarefas.push(tarefa);
  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  const elemntoTarefas = criarElementosTarefas(tarefa);
  ultarefas.append(elemntoTarefas);

  textarea.value = "";
  formAddTarefa.classList.add("hidden");
});

tarefas.forEach((tarefa) => {
  const elemntoTarefas = criarElementosTarefas(tarefa);
  ultarefas.append(elemntoTarefas);
});

document.addEventListener("FocoFinalizado", () => {
  if (tarefaAtiva && litarefaAtiva) {
    litarefaAtiva.classList.remove("app__section-task-list-item-active");
    litarefaAtiva.classList.add("app__section-task-list-item-complete");
    litarefaAtiva.querySelector("button").setAttribute("disabled", "disabled");
    tarefaAtiva.completa = true;
    atualizarTarefa();
  }
});

const atualizarTarefa = () => {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const removertarefas = (somentecompletas) => {
  const seletor = somentecompletas
    ? ".app__section-task-list-item-complete"
    : ".app__section-task-list-item";
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somentecompletas
    ? tarefas.filter((tarefas) => !tarefas.completa)
    : [];
  atualizarTarefa();
};

btnRemoverConcluidas.onclick = () => removertarefas(true);
btnRemoverTudo.onclick = () => removertarefas(false);
