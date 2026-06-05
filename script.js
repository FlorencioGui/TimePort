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

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let velocity = 0;
    let animationID;
    let lastTime = 0;
    let lastMouseX = 0;
    let itemWidth = 0;

    const itensAnimados = Array.from(faixaDrag.children);

    function atualizarDimensoes() {
      const gap = parseFloat(getComputedStyle(faixaDrag).gap) || 12;
      itemWidth = itensOriginais[0].getBoundingClientRect().width + gap;
      prevTranslate = currentTranslate;
      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
      atualizarProfundidade();
    }

    function aplicarTransformacao() {
      faixaDrag.style.transform = `translateX(${currentTranslate}px)`;
      atualizarProfundidade();
    }

    function atualizarProfundidade() {
      const faixaRect = limite.getBoundingClientRect();
      const centro = faixaRect.left + faixaRect.width / 2;
      const maxDist = faixaRect.width / 2 + itemWidth;
      const BASE_W = 240,
        BASE_H = 260;
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
        const opacity = 0.85 + ease * 0.28;
        const blur = Math.max(0, (0.7 - ease) * 1.1);
        const zIndex = Math.round(ease * 100);

        if (img) {
          img.style.width = `${newW}px`;
          img.style.height = `${newH}px`;
        }
        item.style.transform = `translateY(0px)`;
        item.style.opacity = opacity;
        item.style.filter = `blur(${blur}px)`;
        item.style.zIndex = zIndex;
      });
    }

    function loopInercia() {
      if (isDragging) return;
      currentTranslate += velocity;
      velocity *= 0.96;
      if (Math.abs(velocity) < 0.05) velocity = 0;
      aplicarTransformacao();
      if (velocity !== 0) animationID = requestAnimationFrame(loopInercia);
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
      const dx = currentX - lastMouseX;
      currentTranslate += dx;
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (dx / dt) * 16;
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
    limite.addEventListener("touchstart", iniciarArraste, { passive: true });
    document.addEventListener("touchmove", arrastar, { passive: true });
    document.addEventListener("touchend", finalizarArraste);
    window.addEventListener("resize", atualizarDimensoes);
    setTimeout(atualizarDimensoes, 100);
  }

  inicializarCarrosselDragFluido(".carrossel-drag-faixa");

  // =====================
  // BUSCADOR — Resumido
  // =====================
  const inputOrigem = document.getElementById("input-origem");
  inputOrigem.addEventListener("input", function () {
    if (inputOrigem.value.length >= 3) {
      inputOrigem.setAttribute("list", "cidades");
    } else {
      inputOrigem.removeAttribute("list");
    }
  });

  // =====================
  // BUSCADOR EXPANDIDO — LÓGICA PRINCIPAL
  // =====================
  const buscadorColapsado = document.getElementById("buscadorColapsado");
  const buscadorExpandido = document.getElementById("buscadorExpandido");
  const overlay = document.getElementById("buscadorOverlay");
  const btnExpandir = document.getElementById("btnExpandir");
  const btnFechar = document.getElementById("btnFechar");

  // Tipo de viagem — estado compartilhado
  let tipoAtual = "ida-volta"; // "ida-volta" ou "somente-ida"

  // Botões de tipo no container colapsado
  const btnIdaVoltaCol = document.getElementById("btnIdaVoltaColapsado");
  const btnSomenteIdaCol = document.getElementById("btnSomenteIdaColapsado");

  // Botões de tipo no container expandido
  const btnIdaVoltaExp = document.getElementById("btnIdaVoltaExp");
  const btnSomenteIdaExp = document.getElementById("btnSomenteIdaExp");

  // Campo de data volta (que some quando "somente ida")
  const fieldDataVolta = document.getElementById("fieldDataVolta");

  // Funções de abrir / fechar

  function abrirBuscador() {
    // Mostra overlay e inicia transição
    overlay.classList.add("visivel");
    // Força reflow para a transição funcionar
    overlay.getBoundingClientRect();
    overlay.classList.add("ativo");

    // Mostra expandido
    buscadorExpandido.setAttribute("aria-hidden", "false");
    // Força reflow
    buscadorExpandido.getBoundingClientRect();
    buscadorExpandido.classList.add("ativo");

    // Sincroniza tipo atual no expandido
    sincronizarTipo();
  }

  function fecharBuscador() {
    overlay.classList.remove("ativo");
    buscadorExpandido.classList.remove("ativo");

    // Remove o "visivel" após a transição terminar (0.35s)
    setTimeout(() => {
      overlay.classList.remove("visivel");
      buscadorExpandido.setAttribute("aria-hidden", "true");
    }, 350);
  }

  // Gatilhos de abertura
  // Clique no container fechado (exceto nos botões de tipo)
  buscadorColapsado.addEventListener("click", (e) => {
    const isTipoBtnCol = e.target.closest(".btn-tipo");
    if (!isTipoBtnCol) {
      abrirBuscador();
    }
  });

  // Botão expandir
  btnExpandir.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirBuscador();
  });

  // Fechar
  btnFechar.addEventListener("click", (e) => {
    e.stopPropagation();
    fecharBuscador();
  });

  // Clique no overlay (fora do painel expandido)
  overlay.addEventListener("click", fecharBuscador);

  // ESC fecha também
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharBuscador();
  });

  //Lógica de seleção de tipo (Ida e Volta / Somente Ida)

  function sincronizarTipo() {
    // Colapsado
    btnIdaVoltaCol.classList.toggle("ativo", tipoAtual === "ida-volta");
    btnSomenteIdaCol.classList.toggle("ativo", tipoAtual === "somente-ida");
    // Expandido
    btnIdaVoltaExp.classList.toggle("ativo", tipoAtual === "ida-volta");
    btnSomenteIdaExp.classList.toggle("ativo", tipoAtual === "somente-ida");
    // Campo de data de volta
    fieldDataVolta.classList.toggle("oculto", tipoAtual === "somente-ida");
  }

  function selecionarTipo(tipo) {
    tipoAtual = tipo;
    sincronizarTipo();
  }

  // Eventos botões colapsados
  btnIdaVoltaCol.addEventListener("click", (e) => {
    e.stopPropagation(); // Não abre o expandido
    selecionarTipo("ida-volta");
  });
  btnSomenteIdaCol.addEventListener("click", (e) => {
    e.stopPropagation();
    selecionarTipo("somente-ida");
  });

  // Eventos botões expandidos
  btnIdaVoltaExp.addEventListener("click", (e) => {
    e.stopPropagation();
    selecionarTipo("ida-volta");
  });
  btnSomenteIdaExp.addEventListener("click", (e) => {
    e.stopPropagation();
    selecionarTipo("somente-ida");
  });

  // Botão alternar origem/destino no expandido
  const btnAlternarExp = document.getElementById("btnAlternarExp");
  const inputOrigemExp = document.getElementById("input-origem-exp");
  const inputDestinoExp = document.getElementById("input-destino-exp");

  btnAlternarExp.addEventListener("click", (e) => {
    e.stopPropagation();
    const temp = inputOrigemExp.value;
    inputOrigemExp.value = inputDestinoExp.value;
    inputDestinoExp.value = temp;
  });

  // Impede que cliques dentro do painel expandido fechem o overlay
  buscadorExpandido.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Estado inicial
  sincronizarTipo();

  // =====================
  // CARROSSEL OFERTAS — DRAG + SNAP
  // =====================
  function inicializarCarrosselOfertas() {
    const faixaOfertas = document.getElementById("ofertasFaixa");
    if (!faixaOfertas) return;

    const limite = faixaOfertas.closest(".carrossel-ofertas-limite");

    let isDragging = false;
    let currentTranslate = 0;
    let velocity = 0;
    let animationID;
    let lastMouseX = 0;
    let lastTime = 0;

    // Lê o gap diretamente do CSS — nunca mais dessincroniza
    function getGap() {
      return parseFloat(getComputedStyle(faixaOfertas).gap) || 0;
    }

    function offsetIdealParaCard(index) {
      const itens = Array.from(faixaOfertas.children);
      const itemWidth = faixaOfertas.children[0].offsetWidth;
      const gap = getGap();
      const larguraTela = limite.offsetWidth;
      const padding =
        parseFloat(getComputedStyle(faixaOfertas).paddingLeft) || 0;
      const larguraTotal = itens.length * (itemWidth + gap) - gap + padding * 2;

      const centroTela = larguraTela / 2;
      const centroCard = itemWidth / 2;

      const offsetCentralizado =
        centroTela - centroCard - padding - index * (itemWidth + gap);

      // Limite esquerdo: começa no padding, não em zero
      const limiteEsquerdo = padding;

      // Limite direito: desconta o padding dos dois lados
      const limiteDireito = larguraTela - larguraTotal + padding;

      if (larguraTotal <= larguraTela) return padding;

      return Math.min(
        limiteEsquerdo,
        Math.max(limiteDireito, offsetCentralizado),
      );
    }

    function calcularSnap() {
      const itens = Array.from(faixaOfertas.children);
      let melhorIndex = 0;
      let melhorDistancia = Infinity;

      itens.forEach((_, i) => {
        const distancia = Math.abs(currentTranslate - offsetIdealParaCard(i));
        if (distancia < melhorDistancia) {
          melhorDistancia = distancia;
          melhorIndex = i;
        }
      });

      return melhorIndex;
    }

    function snapParaCard(index) {
      const destino = offsetIdealParaCard(index);
      currentTranslate = destino;

      faixaOfertas.style.transition =
        "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      faixaOfertas.style.transform = `translateX(${destino}px)`;
    }

    function aplicarTranslate(valor) {
      faixaOfertas.style.transition = "none";
      faixaOfertas.style.transform = `translateX(${valor}px)`;
    }

    function loopInercia() {
      if (isDragging) return;

      currentTranslate += velocity;
      velocity *= 0.92;

      if (Math.abs(velocity) < 0.5) {
        velocity = 0;
        snapParaCard(calcularSnap());
        return;
      }

      aplicarTranslate(currentTranslate);
      animationID = requestAnimationFrame(loopInercia);
    }

    function iniciarArraste(e) {
      isDragging = true;
      cancelAnimationFrame(animationID);

      lastMouseX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      lastTime = performance.now();

      faixaOfertas.style.transition = "none";
      limite.style.cursor = "grabbing";

      if (e.type.includes("mouse")) e.preventDefault();
    }

    function arrastar(e) {
      if (!isDragging) return;

      const currentX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      const dx = currentX - lastMouseX;

      const itens = Array.from(faixaOfertas.children);
      const itemWidth = faixaOfertas.children[0].offsetWidth;
      const gap = getGap();
      const larguraTela = limite.offsetWidth;
      const padding =
        parseFloat(getComputedStyle(faixaOfertas).paddingLeft) || 0;
      const larguraTotal = itens.length * (itemWidth + gap) - gap + padding * 2;

      const limiteEsquerdo = padding;
      const limiteDireito = larguraTela - larguraTotal + padding;

      currentTranslate += dx;

      if (currentTranslate > limiteEsquerdo) {
        const excesso = currentTranslate - limiteEsquerdo;
        currentTranslate = limiteEsquerdo + excesso * 0.2;
      } else if (currentTranslate < limiteDireito) {
        const excesso = limiteDireito - currentTranslate;
        currentTranslate = limiteDireito - excesso * 0.2;
      }

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) velocity = (dx / dt) * 16;
      lastTime = now;
      lastMouseX = currentX;

      aplicarTranslate(currentTranslate);
    }

    function finalizarArraste() {
      if (!isDragging) return;

      isDragging = false;
      limite.style.cursor = "grab";

      if (Math.abs(velocity) < 1) {
        snapParaCard(calcularSnap());
      } else {
        velocity *= 0.6;
        animationID = requestAnimationFrame(loopInercia);
      }
    }

    limite.addEventListener("mousedown", iniciarArraste);
    document.addEventListener("mousemove", arrastar);
    document.addEventListener("mouseup", finalizarArraste);
    limite.addEventListener("touchstart", iniciarArraste, { passive: false });
    document.addEventListener("touchmove", arrastar, { passive: false });
    document.addEventListener("touchend", finalizarArraste);

    setTimeout(() => {
      currentTranslate =
        parseFloat(getComputedStyle(faixaOfertas).paddingLeft) || 0;
      aplicarTranslate(currentTranslate);
    }, 50);

    window.addEventListener("resize", () => {
      snapParaCard(calcularSnap());
    });

    currentTranslate = offsetIdealParaCard(1);
    aplicarTranslate(currentTranslate);
  }

  inicializarCarrosselOfertas();
});
