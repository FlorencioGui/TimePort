const btnLingua = document.getElementById("btnLingua");
const modalLingua = document.getElementById("modalLingua");

// Abre/fecha o modal ao clicar no botão
btnLingua.addEventListener("click", (e) => {
  e.preventDefault();
  modalLingua.classList.toggle("active");
});

// Fecha o modal ao clicar fora dele
document.addEventListener("click", (e) => {
  if (!btnLingua.contains(e.target) && !modalLingua.contains(e.target)) {
    modalLingua.classList.remove("active");
  }
});

// Fecha ao selecionar um idioma
const linguas = modalLingua.querySelectorAll("a");
linguas.forEach((lingua) => {
  lingua.addEventListener("click", (e) => {
    e.preventDefault();
    const idiomaSelected = e.target.dataset.lang;
    atualizarBotao(idiomaSelected);
    localStorage.setItem("idiomaSelecionado", idiomaSelected);
    modalLingua.classList.remove("active");
  });
});

// Atualiza o texto do botão
const idiomaInfo = {
  pt: { bandeira: "files/language-icon.png", texto: "PT-BR • R$" },
  en: { bandeira: "files/language-icon2.png", texto: "EN-US • $" },
  es: { bandeira: "files/language-icon3.png", texto: "ES • €" },
};

function atualizarBotao(lang) {
  document.getElementById("textoAtual").textContent = idiomaInfo[lang].texto;
  document.getElementById("bandeira-atual").src = idiomaInfo[lang].bandeira;
}

// Carrega o idioma salvo ao abrir a página
function carregarIdiomaPreferido() {
  const idiomaSalvo = localStorage.getItem("idiomaSelecionado") || "pt";
  atualizarBotao(idiomaSalvo);
}

document.addEventListener("DOMContentLoaded", carregarIdiomaPreferido);