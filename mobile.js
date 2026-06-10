// mobile.js — TimePort
// Hambúrguer + fix do background dos cards no mobile
// Incluir APÓS script.js no HTML

document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // MENU HAMBÚRGUER
  // =====================
  const btnHamburger = document.getElementById("btnHamburger");
  const navMobile = document.getElementById("navMobile");

  if (btnHamburger && navMobile) {
    btnHamburger.addEventListener("click", () => {
      const aberto = navMobile.classList.toggle("aberto");
      btnHamburger.classList.toggle("aberto", aberto);
      document.body.style.overflow = aberto ? "hidden" : "";
    });

    // Fecha ao clicar em qualquer link
    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMobile.classList.remove("aberto");
        btnHamburger.classList.remove("aberto");
        document.body.style.overflow = "";
      });
    });

    // Fecha clicando no fundo escuro do overlay
    navMobile.addEventListener("click", (e) => {
      if (e.target === navMobile) {
        navMobile.classList.remove("aberto");
        btnHamburger.classList.remove("aberto");
        document.body.style.overflow = "";
      }
    });

    // Fecha com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("aberto")) {
        navMobile.classList.remove("aberto");
        btnHamburger.classList.remove("aberto");
        document.body.style.overflow = "";
      }
    });
  }

  // =====================
  // BACKGROUND DOS CARDS NO MOBILE
  // No desktop: background-image fica no .card (CSS/inline style)
  // No mobile:  card vira coluna (painel-direito em cima), então
  //             o background precisa estar no .painel-direito
  // =====================

  // Mapa de backgrounds por destino (para o card do Rio que usa CSS class)
  const bgPorDestino = {
    "RIO DE JANEIRO": 'url("files/cristoredentor.png")',
    COLISEU: 'url("files/coliseu.png")',
    JERUSALÉM: 'url("files/jesus.png")',
    "EUA/LUA": 'url("files/eua-lua1969.png")',
    "NEW YORK": 'url("files/NewYork2130.png")',
  };

  function aplicarBgCardsMobile() {
    const isMobile = window.innerWidth <= 768;

    document.querySelectorAll(".carrossel-item .card").forEach((card) => {
      const painel = card.querySelector(".painel-direito");
      if (!painel) return;

      if (isMobile) {
        // Tenta pegar o background inline do .card
        let bg = card.style.backgroundImage;

        // Se não tiver inline (caso do Rio de Janeiro que vem do CSS),
        // identifica pelo nome do destino
        if (!bg || bg === "none" || bg === "") {
          const nomeEl = card.querySelector(".destino-nome");
          if (nomeEl) {
            const texto = nomeEl.textContent.trim().toUpperCase();
            const chave = Object.keys(bgPorDestino).find((k) =>
              texto.includes(k),
            );
            if (chave) bg = bgPorDestino[chave];
          }
        }

        if (bg && bg !== "none" && bg !== "") {
          painel.style.backgroundImage = bg;
          painel.style.backgroundSize = "cover";
          painel.style.backgroundPosition = "center";
        }
      } else {
        // Desktop: limpa o painel (o card já tem o background)
        painel.style.backgroundImage = "";
        painel.style.backgroundSize = "";
        painel.style.backgroundPosition = "";
      }
    });
  }

  // Roda na carga e no resize
  aplicarBgCardsMobile();
  window.addEventListener("resize", aplicarBgCardsMobile);
});
