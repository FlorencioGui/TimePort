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

    // Clona os itens para criar looping infinito
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
      originalWidth = totalOriginais * itemWidth;

      currentTranslate = -originalWidth;
      prevTranslate = currentTranslate;

      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
      atualizarProfundidade();
    }

    function aplicarTransformacao() {
      if (currentTranslate >= 0) {
        currentTranslate -= originalWidth;
        prevTranslate = currentTranslate;
      } else if (currentTranslate <= -(originalWidth * 2)) {
        currentTranslate += originalWidth;
        prevTranslate = currentTranslate;
      }

      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
      atualizarProfundidade();
    }

    function atualizarProfundidade() {
      const faixaRect = limite.getBoundingClientRect();
      const centro = faixaRect.left + faixaRect.width / 2;
      const maxDist = faixaRect.width / 2 + itemWidth;

      itensAnimados.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCentro = rect.left + rect.width / 2;

        const distNormalizada = Math.min(
          Math.abs(itemCentro - centro) / maxDist,
          1,
        );

        // Curva suave: centro menor, laterais maiores
        const ease = Math.pow(distNormalizada, 1.35);

        const scale = 0.8 + ease * 0.5; // 0.66 -> 1.16
        const translateY = (1 - ease) * 24; // centro mais "fundo"
        const opacity = 0.72 + ease * 0.28; // 0.72 -> 1
        const blur = (1 - ease) * 1.1; // centro mais suave
        const zIndex = Math.round(ease * 100);

        item.style.transform = `translateY(${translateY}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = zIndex;
      });
    }

    function loopInercia() {
      if (isDragging) return;

      currentTranslate += velocity;
      velocity *= 0.96;

      aplicarTransformacao();

      if (Math.abs(velocity) > 0.1) {
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
      if (e.type.includes("mouse")) e.preventDefault();
      limite.style.cursor = "grabbing";
    }

    function arrastar(e) {
      if (!isDragging) return;

      const currentX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;

      const now = Date.now();
      const dt = now - lastTime;
      const dx = currentX - lastMouseX;

      if (dt > 0) {
        velocity = (dx / dt) * 16;
      }

      lastTime = now;
      lastMouseX = currentX;

      const diff = currentX - startX;
      currentTranslate = prevTranslate + diff;

      aplicarTransformacao();
    }

    function finalizarArraste() {
      if (!isDragging) return;

      isDragging = false;
      limite.style.cursor = "grab";

      velocity *= 0.75;
      animationID = requestAnimationFrame(loopInercia);
    }

    limite.addEventListener("mousedown", iniciarArraste);
    document.addEventListener("mousemove", arrastar);
    document.addEventListener("mouseup", finalizarArraste);

    limite.addEventListener("touchstart", iniciarArraste, { passive: true });
    document.addEventListener("touchmove", arrastar, { passive: true });
    document.addEventListener("touchend", finalizarArraste);

    window.addEventListener("resize", atualizarDimensoes);

    setTimeout(atualizarDimensoes, 100);
  }

  inicializarCarrosselDragFluido(".carrossel-drag-faixa");
});
