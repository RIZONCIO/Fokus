const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const botoes = document.querySelectorAll(".app__card-button");
const startPauseBt = document.querySelector("#start-pause");
const iniciarOrPausarBt = document.querySelector("#start-pause span");
const iniciarOrPausarBtIcon = document.querySelector(
  ".app__card-primary-butto-icon"
);
const tempoTela = document.querySelector("#timer");
const musicFocoInput = document.querySelector("#alternar-musica");
const music = new Audio("/sons/luna-rise-part-one.mp3");
const comecarSom = new Audio("/sons/play.wav");
const pararSom = new Audio("/sons/pause.mp3");
const somFinal = new Audio("/sons/beep.mp3");

let cronometoEmSegudos = 1500;
let intervaloId = null;

music.loop = true;

musicFocoInput.addEventListener("change", () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
});

focoBt.addEventListener("click", () => {
  cronometoEmSegudos = 1500;
  alterarContexto("foco");
  focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
  cronometoEmSegudos = 300;
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
  cronometoEmSegudos = 900;
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
});

function alterarContexto(contexto) {
  mostrarTempo();
  botoes.forEach(function (botao) {
    botao.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `/imagens/${contexto}.png`);
  switch (contexto) {
    case "foco":
      titulo.innerHTML = ` Otimize sua produtividade,<br />
          <strong class="app__title-strong">mergulhe no que importa.</strong>`;
      break;
    case "descanso-curto":
      titulo.innerHTML = ` Que tal dar uma respirada?<br />
          <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
      break;
    case "descanso-longo":
      titulo.innerHTML = ` Hora de voltar à superfície.<br />
        <strong class="app__title-strong">Faça uma pausa longa!</strong>`;
      break;
    default:
      break;
  }
}

const comtagemRegressiva = () => {
  if (cronometoEmSegudos <= 0) {
    somFinal.play();
    alert("Tempo parado");
    const focoAtivo = html.getAttribute("data-contexto") == "foco";
    if (focoAtivo) {
      const evento = new CustomEvent("FocoFinalizado");
      document.dispatchEvent(evento);
    }
    zerar();
    return;
  }
  cronometoEmSegudos -= 1;
  mostrarTempo();
};

startPauseBt.addEventListener("click", iniciarOrPausar);

function iniciarOrPausar() {
  if (intervaloId) {
    pararSom.play();
    zerar();
    return;
  }
  comecarSom.play();
  intervaloId = setInterval(comtagemRegressiva, 1000);
  iniciarOrPausarBt.textContent = "Pausar";
  iniciarOrPausarBtIcon.setAttribute("src", `/imagens/pause.png`);
}

function zerar() {
  clearInterval(intervaloId);
  iniciarOrPausarBt.textContent = "Começar";
  iniciarOrPausarBtIcon.setAttribute("src", `/imagens/play.png`);
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(cronometoEmSegudos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString("pt-br", {
    minute: "2-digit",
    second: "2-digit",
  });
  tempoTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
