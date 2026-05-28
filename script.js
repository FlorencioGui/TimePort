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
    console.log("Idioma selecionado:", idiomaSelected);
    modalLingua.classList.remove("active");
  });
});
