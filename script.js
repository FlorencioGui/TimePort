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
    const itemsNodes = Array.from(faixaDrag.children);
    const totalItens = itemsNodes.length;

    // Fatores de física
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let velocity = 0;
    let animationID;
    let lastTime = 0;
    let lastMouseX = 0;

    // Dimensões
    let itemWidth = 0;
    let originalWidth = 0;

    // 1. Clonar os itens ANTES e DEPOIS para criar o looping invisível
    function clonarParaInfinito() {
      // Clona para o final (mantém a ordem normal)
      itemsNodes.forEach((item) => {
        faixaDrag.appendChild(item.cloneNode(true));
      });

      // Clona para o início (inverte a leitura para que o insertBefore mantenha a ordem correta)
      [...itemsNodes].reverse().forEach((item) => {
        faixaDrag.insertBefore(item.cloneNode(true), faixaDrag.firstChild);
      });
    }

    clonarParaInfinito();

    // 2. Calcular o tamanho da trilha original
    function atualizarDimensoes() {
      // Largura da imagem (240) + gap do flex (12)
      itemWidth = itemsNodes[0].offsetWidth + 12;
      originalWidth = totalItens * itemWidth;
      // Começamos o carrossel na cópia do meio para termos margem de arraste
      currentTranslate = -originalWidth;
      aplicarTransformacao();
    }

    function aplicarTransformacao() {
      // Lógica do looping infinito: se chegar na ponta clonada, volta pro meio invisivelmente
      if (currentTranslate >= 0) {
        currentTranslate -= originalWidth;
      } else if (currentTranslate <= -(originalWidth * 2)) {
        currentTranslate += originalWidth;
      }
      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
    }

    // 3. Loop de Animação (Inércia)
    function loopInercia() {
      if (isDragging) return; // Se o usuário pegar de novo, para a inércia

      currentTranslate += velocity;
      velocity *= 0.96; // Fricção (quanto mais perto de 1, mais ele escorrega)

      aplicarTransformacao();

      // Continua animando enquanto a velocidade não for quase zero
      if (Math.abs(velocity) > 0.1) {
        animationID = requestAnimationFrame(loopInercia);
      }
    }

    // 4. Funções de Arraste
    function iniciarArraste(e) {
      isDragging = true;
      cancelAnimationFrame(animationID); // Para qualquer movimento de inércia que estiver rolando
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

      // Calcula a velocidade do movimento
      if (dt > 0) {
        velocity = (dx / dt) * 16; // Converte para pixels por frame (assumindo ~60fps)
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

      // Multiplicador do impulso
      velocity *= 0.75;

      animationID = requestAnimationFrame(loopInercia);
    }

    // Eventos de Mouse
    limite.addEventListener("mousedown", iniciarArraste);
    document.addEventListener("mousemove", arrastar);
    document.addEventListener("mouseup", finalizarArraste);

    // Eventos Touch
    limite.addEventListener("touchstart", iniciarArraste, { passive: true });
    document.addEventListener("touchmove", arrastar, { passive: true });
    document.addEventListener("touchend", finalizarArraste);

    // Inicializa os tamanhos
    setTimeout(atualizarDimensoes, 100);
  }

  inicializarCarrosselDragFluido(".carrossel-drag-faixa");
});
