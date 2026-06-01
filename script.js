// =====================
// MODAL DE LÍNGUA
// =====================
const btnLingua = document.getElementById("btnLingua");
const modalLingua = document.getElementById("modalLingua");

btnLingua.addEventListener("click", (e) => {
  e.preventDefault();
  modalLingua.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!btnLingua.contains(e.target) && !modalLingua.contains(e.target)) {
    modalLingua.classList.remove("active");
  }
});

const linguas = modalLingua.querySelectorAll("a");
linguas.forEach((lingua) => {
  lingua.addEventListener("click", (e) => {
    e.preventDefault();
    const idiomaSelected = e.currentTarget.dataset.lang;
    atualizarBotao(idiomaSelected);
    localStorage.setItem("idiomaSelecionado", idiomaSelected);
    modalLingua.classList.remove("active");
  });
});

const idiomaInfo = {
  pt: { bandeira: "files/language-icon.png", texto: "PT-BR • R$" },
  en: { bandeira: "files/language-icon2.png", texto: "EN-US • $" },
  es: { bandeira: "files/language-icon3.png", texto: "ES • €" },
};

function atualizarBotao(lang) {
  document.getElementById("textoAtual").textContent = idiomaInfo[lang].texto;
  document.getElementById("bandeira-atual").src = idiomaInfo[lang].bandeira;
}

function carregarIdiomaPreferido() {
  const idiomaSalvo = localStorage.getItem("idiomaSelecionado") || "pt";
  atualizarBotao(idiomaSalvo);
}

document.addEventListener("DOMContentLoaded", carregarIdiomaPreferido);


// =====================
// CARROSSEL DE CARDS
// =====================
const faixa = document.getElementById("carrosselFaixa");
const btnProximo = document.getElementById("btnProximo");
const btnAnterior = document.getElementById("btnAnterior");

const totalItens = faixa.children.length;
let itemAtual = 0;

function atualizarCarrossel() {
  faixa.style.transform = `translateX(-${itemAtual * 100}%)`;
  btnAnterior.style.display = itemAtual === 0 ? "none" : "block";
  btnProximo.style.display = itemAtual === totalItens - 1 ? "none" : "block";
}

btnProximo.addEventListener("click", () => {
  if (itemAtual < totalItens - 1) {
    itemAtual++;
    atualizarCarrossel();
  }
});

btnAnterior.addEventListener("click", () => {
  if (itemAtual > 0) {
    itemAtual--;
    atualizarCarrossel();
  }
});

atualizarCarrossel();