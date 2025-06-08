// ======= EVENTO PRINCIPAL =======
document.addEventListener("DOMContentLoaded", () => {
  // ======= Menu Mobile =======
  const btnMobile = document.getElementById("btn-mobile");
  const nav = document.getElementById("nav");

  function toggleMenu(event) {
    if (event.type === "touchstart") event.preventDefault();
    if (!nav) return;
    nav.classList.toggle("active");
    const active = nav.classList.contains("active");
    btnMobile.setAttribute("aria-expanded", active);
  }

  if (btnMobile) {
    btnMobile.addEventListener("click", toggleMenu);
    btnMobile.addEventListener("touchstart", toggleMenu);
  }

  // ======= Formulário de Contato (emailjs) =======
  const formContato = document.getElementById("form-contato");
  if (formContato) {
    formContato.addEventListener("submit", function (e) {
      e.preventDefault();
      emailjs.sendForm("service_ce7qmrw", "template_x01kk7g", this)
        .then(() => {
          document.getElementById("mensagem-feedback").innerText =
            "Mensagem enviada com sucesso!";
          this.reset();
        })
        .catch((error) => {
          document.getElementById("mensagem-feedback").innerText =
            "Erro ao enviar: " + error.text;
        });
    });
  }

  // ======= Toggle de informações extras =======
  const toggleBtn = document.getElementById("info-toggle");
  const infoExtra = document.getElementById("info-extra");

  if (toggleBtn && infoExtra) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = infoExtra.hasAttribute("hidden");
      if (isHidden) {
        infoExtra.removeAttribute("hidden");
        toggleBtn.textContent = "−";
        toggleBtn.setAttribute("aria-expanded", "true");
      } else {
        infoExtra.setAttribute("hidden", "");
        toggleBtn.textContent = "+";
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ======= Inicialização de funcionalidades =======
  carregarAbrigos();
  configurarFormularioAbrigo();
  configurarFormularioAlerta();
  adicionarBotaoRemoverAlertasExistentes();

  // ======= Botões de acessibilidade =======
  const temaBtn = document.getElementById("botao-tema");
  if (temaBtn) temaBtn.addEventListener("click", alternarTema);

  const aumentarBtn = document.getElementById("btn-aumentar");
  if (aumentarBtn) aumentarBtn.addEventListener("click", aumentarFonte);

  const diminuirBtn = document.getElementById("btn-diminuir");
  if (diminuirBtn) diminuirBtn.addEventListener("click", diminuirFonte);
});

// ======= Acessibilidade: Controle de Fonte e Tema =======
function aumentarFonte() {
  const body = document.body;
  let fontSize = parseFloat(getComputedStyle(body).fontSize);
  if (fontSize < 24) body.style.fontSize = (fontSize + 2) + "px";
}

function diminuirFonte() {
  const body = document.body;
  let fontSize = parseFloat(getComputedStyle(body).fontSize);
  if (fontSize > 12) body.style.fontSize = (fontSize - 2) + "px";
}

function alternarTema(event) {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  if (event?.target) event.target.setAttribute("aria-pressed", isDark);
}

// ======= Dados e Formulário de Abrigos =======
function carregarAbrigos() {
  const abrigos = [
    { nome: 'Abrigo Central', endereco: 'Rua A, 100', capacidade: 120 },
    { nome: 'Abrigo Norte', endereco: 'Av. B, 200', capacidade: 80 },
  ];
  const tabela = document.getElementById('tabela-abrigos');
  if (!tabela) return;
  abrigos.forEach(a => adicionarAbrigoNaTabela(a.nome, a.endereco, a.capacidade));
}

function adicionarAbrigoNaTabela(nome, endereco, capacidade) {
  const tabela = document.getElementById('tabela-abrigos');
  if (!tabela) return;
  const row = document.createElement('tr');
  row.innerHTML = `<td>${nome}</td><td>${endereco}</td><td>${capacidade}</td><td><button class="remover-abrigo">Remover</button></td>`;
  row.querySelector(".remover-abrigo").addEventListener("click", () => row.remove());
  tabela.appendChild(row);
}

function configurarFormularioAbrigo() {
  const btn = document.getElementById("add-abrigo");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const nomeEl = document.getElementById("abrigo-nome");
    const enderecoEl = document.getElementById("abrigo-endereco");
    const capacidadeEl = document.getElementById("abrigo-capacidade");
    if (!nomeEl || !enderecoEl || !capacidadeEl) return;

    const nome = nomeEl.value;
    const endereco = enderecoEl.value;
    const capacidade = capacidadeEl.value;
    const capacidadeNum = Number(capacidade);

    if (!Number.isInteger(capacidadeNum) || capacidadeNum <= 0) {
      capacidadeEl.setCustomValidity("Insira um número inteiro positivo para a capacidade.");
      capacidadeEl.reportValidity();
      return;
    } else {
      capacidadeEl.setCustomValidity("");
    }

    if (nome && endereco) {
      adicionarAbrigoNaTabela(nome, endereco, capacidadeNum);
      document.getElementById("dialog-abrigos").close();
      mostrarDialogMensagem("Abrigo adicionado com sucesso!");
    }
  });
}

// ======= Dados e Formulário de Alertas =======
function configurarFormularioAlerta() {
  const btn = document.getElementById("add-alerta");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const textoEl = document.getElementById("texto-alerta");
    if (!textoEl) return;
    const texto = textoEl.value;
    if (texto) {
      const container = document.getElementById("lista-alertas");
      const alerta = document.createElement("div");
      alerta.className = "alerta";
      alerta.innerHTML = `${texto} <button class="remover-alerta" style="margin-left:1rem">Remover</button>`;
      alerta.querySelector(".remover-alerta").addEventListener("click", () => alerta.remove());
      container.appendChild(alerta);
      document.getElementById("dialog-alertas").close();
      mostrarDialogMensagem("Alerta adicionado com sucesso!");
    }
  });
}

// ======= Popup de confirmação reutilizável =======
function mostrarDialogMensagem(mensagem) {
  let dialog = document.getElementById("dialog-confirmacao");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "dialog-confirmacao";
                    dialog.innerHTML = `
      <p id="texto-dialog" style="margin-bottom: 1rem;"></p>
      <button id="fechar-dialog">Fechar</button>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector("#fechar-dialog").addEventListener("click", () => dialog.close());
  }
  dialog.querySelector("#texto-dialog").textContent = mensagem;
  dialog.showModal();
}

// ======= Remoção de alertas existentes na tela =======
function adicionarBotaoRemoverAlertasExistentes() {
  const alertas = document.querySelectorAll("#lista-alertas .alerta");
  alertas.forEach(alerta => {
    if (!alerta.querySelector(".remover-alerta")) {
      const btn = document.createElement("button");
      btn.className = "remover-alerta";
      btn.textContent = "Remover";
      btn.addEventListener("click", () => alerta.remove());
      alerta.appendChild(btn);
    }
  });
}