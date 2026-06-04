document.addEventListener("DOMContentLoaded", () => {
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

  const idiomaSalvo = localStorage.getItem("idiomaSelecionado") || "pt";
  atualizarBotao(idiomaSalvo);

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

  // =====================
  // CARROSSEL DRAG
  // =====================
  function inicializarCarrosselDragFluido(selectorFaixa) {
    const faixaDrag = document.querySelector(selectorFaixa);
    if (!faixaDrag) return;

    const limite = faixaDrag.closest(".carrossel-drag");
    const itensOriginais = Array.from(faixaDrag.children);
    const totalOriginais = itensOriginais.length;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let velocity = 0;
    let animationID;
    let lastTime = 0;
    let lastMouseX = 0;

    let itemWidth = 0;
    let originalWidth = 0;

    function clonarParaInfinito() {
      itensOriginais.forEach((item) => {
        faixaDrag.appendChild(item.cloneNode(true));
      });

      [...itensOriginais].reverse().forEach((item) => {
        faixaDrag.insertBefore(item.cloneNode(true), faixaDrag.firstChild);
      });
    }

    clonarParaInfinito();

    const itensAnimados = Array.from(faixaDrag.children);

    function atualizarDimensoes() {
      const gap = parseFloat(getComputedStyle(faixaDrag).gap) || 12;

      itemWidth = itensOriginais[0].getBoundingClientRect().width + gap;

      const larguraAntiga = originalWidth;
      originalWidth = totalOriginais * itemWidth;

      if (larguraAntiga === 0) {
        currentTranslate = -originalWidth;
      } else {
        const proporcao = currentTranslate / larguraAntiga;
        currentTranslate = proporcao * originalWidth;
      }

      prevTranslate = currentTranslate;

      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
      atualizarProfundidade();
    }

    function aplicarTransformacao() {
      if (originalWidth <= 0) return;

      currentTranslate =
        ((currentTranslate + originalWidth) % originalWidth) - originalWidth;

      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;

      atualizarProfundidade();
    }

    function atualizarProfundidade() {
      const faixaRect = limite.getBoundingClientRect();
      const centro = faixaRect.left + faixaRect.width / 2;
      const maxDist = faixaRect.width / 2 + itemWidth;

      const BASE_W = 240;
      const BASE_H = 260;
      const ASPECT = BASE_H / BASE_W;

      itensAnimados.forEach((item) => {
        const img = item.querySelector("img");
        const rect = item.getBoundingClientRect();
        const itemCentro = rect.left + rect.width / 2;

        const distNormalizada = Math.min(
          Math.abs(itemCentro - centro) / maxDist,
          1,
        );

        const ease = Math.pow(distNormalizada, 1.35);

        const scaleFactor = 1.2 + ease * 0.5;
        const newW = Math.round(BASE_W * scaleFactor);
        const newH = Math.round(newW * ASPECT);

        const translateY = 0;
        const opacity = 0.85 + ease * 0.28;
        const blur = Math.max(0, (0.7 - ease) * 1.1);
        const zIndex = Math.round(ease * 100);

        if (img) {
          img.style.width = `${newW}px`;
          img.style.height = `${newH}px`;
        }

        item.style.transform = `translateY(${translateY}px)`;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = zIndex;
      });
    }

    function loopInercia() {
      if (isDragging) return;

      currentTranslate += velocity;
      velocity *= 0.96;

      if (Math.abs(velocity) < 0.05) {
        velocity = 0;
      }

      aplicarTransformacao();

      if (velocity !== 0) {
        animationID = requestAnimationFrame(loopInercia);
      }
    }

    function iniciarArraste(e) {
      isDragging = true;
      cancelAnimationFrame(animationID);

      startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

      prevTranslate = currentTranslate;

      lastMouseX = startX;
      lastTime = Date.now();

      faixaDrag.style.transition = "none";

      if (e.type.includes("mouse")) {
        e.preventDefault();
      }

      limite.style.cursor = "grabbing";
    }

    function arrastar(e) {
      if (!isDragging) return;

      const currentX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;

      const dx = currentX - lastMouseX;

      currentTranslate += dx;

      // velocidade
      const now = performance.now();
      const dt = now - lastTime;

      if (dt > 0) {
        velocity = (dx / dt) * 16;
      }

      lastTime = now;
      lastMouseX = currentX;

      aplicarTransformacao();
    }

    function finalizarArraste() {
      if (!isDragging) return;

      prevTranslate = currentTranslate;

      isDragging = false;
      limite.style.cursor = "grab";

      velocity *= 0.75;

      animationID = requestAnimationFrame(loopInercia);
    }

    limite.addEventListener("mousedown", iniciarArraste);
    document.addEventListener("mousemove", arrastar);
    document.addEventListener("mouseup", finalizarArraste);

    limite.addEventListener("touchstart", iniciarArraste, {
      passive: true,
    });

    document.addEventListener("touchmove", arrastar, {
      passive: true,
    });

    document.addEventListener("touchend", finalizarArraste);

    window.addEventListener("resize", atualizarDimensoes);

    setTimeout(atualizarDimensoes, 100);
  }

  inicializarCarrosselDragFluido(".carrossel-drag-faixa");
});
