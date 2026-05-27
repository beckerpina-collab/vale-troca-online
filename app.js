const DATE_FMT = new Intl.DateTimeFormat("pt-BR");
const DATE_TIME_FMT = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const icons = {
  receipt:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
  settings:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.08V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.08-.4H2.8a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.03 3.8l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.08V2.8a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.36.2.64.48.82.84.2.34.3.72.3 1.12v.12a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.03-.08Z"/></svg>',
  moon:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.99 12.7A8.5 8.5 0 1 1 11.3 3a6.5 6.5 0 0 0 9.69 9.7Z"/></svg>',
  sun:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  printer:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6Z"/><path d="M18 12h.01"/></svg>',
  reset:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/></svg>',
  save:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  trash:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  ban:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>',
  download:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  logOut:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
};

const defaults = {
  company: {
    nome: "Vale Troca",
    cnpj: "",
    endereco: "",
    cep: "",
    telefone: "",
    email: "",
    instagram: "",
    diasValidade: 15,
    mensagem:
      "Apresente este vale na proxima compra dentro do prazo. Obrigado pela preferencia!",
  },
  sellers: [],
  vouchers: [],
};

let app = {
  loading: true,
  user: null,
  theme: localStorage.getItem("vale-troca-theme") || "light",
  view: "emitir",
  filter: "todos",
  search: "",
  ...structuredClone(defaults),
};

let form = makeInitialForm();
let settingsForm = { ...app.company };
let printQueue = [];
let toastTimer = 0;

boot();

async function boot() {
  render();
  try {
    const me = await api("/api/me");
    if (me.authenticated) {
      app.user = me.user;
      await refreshState();
    }
  } catch {
    showToast("Nao foi possivel conectar ao servidor.");
  } finally {
    app.loading = false;
    render();
  }
}

async function refreshState() {
  const state = await api("/api/state");
  app.company = { ...defaults.company, ...state.company };
  app.sellers = state.sellers || [];
  app.vouchers = state.vouchers || [];
  settingsForm = { ...app.company };
  if (!form.vendedora) form.vendedora = app.sellers[0] || "";
  form.validade = addDaysInput(form.diaCompra, app.company.diasValidade);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.error || "Erro na requisicao.");
  return data;
}

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysInput(base, days) {
  const date = new Date(`${base}T12:00:00`);
  date.setDate(date.getDate() + Number(days || 15));
  return date.toISOString().slice(0, 10);
}

function makeInitialForm() {
  const diaCompra = todayInput();
  return {
    nfc: "",
    diaCompra,
    validade: addDaysInput(diaCompra, app?.company?.diasValidade || 15),
    vendedora: app?.sellers?.[0] || "",
    vias: 1,
    observacao: "",
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  document.documentElement.classList.toggle("dark", app.theme === "dark");
  document.getElementById("app").innerHTML = app.loading
    ? renderLoading()
    : app.user
      ? renderApp()
      : renderLogin();
  bindEvents();
}

function renderLoading() {
  return `
    <div class="login-screen">
      <div class="login-card">
        <div class="brand-mark">${icons.receipt}</div>
        <h1>Vale Troca</h1>
        <p>Carregando sistema...</p>
      </div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="login-screen">
      <form id="login-form" class="login-card">
        <div class="brand-mark">${icons.receipt}</div>
        <h1>Vale Troca</h1>
        <p>Acesse para emitir e consultar vales de qualquer computador.</p>
        <div class="field">
          <label for="username">Usuario</label>
          <input id="username" name="username" autocomplete="username" required autofocus />
        </div>
        <div class="field">
          <label for="password">Senha</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required />
        </div>
        <button class="btn primary" type="submit">Entrar</button>
      </form>
      <div id="toast" class="toast" role="status"></div>
    </div>
  `;
}

function renderApp() {
  return `
    <div class="app-shell">
      ${renderTopbar()}
      <main class="container">
        ${app.view === "emitir" ? renderEmitirView() : renderSettingsView()}
      </main>
    </div>
    <div id="print-root" class="print-only">${renderPrintArea()}</div>
    <div id="toast" class="toast" role="status"></div>
  `;
}

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-mark" aria-hidden="true">${icons.receipt}</div>
        <div class="brand-copy">
          <h1>${escapeHtml(app.company.nome || "Vale Troca")}</h1>
          <p>${escapeHtml(app.user.displayName || app.user.username)} · dados compartilhados online</p>
        </div>
        <div class="top-actions">
          <div class="segmented" aria-label="Navegacao principal">
            <button type="button" class="${app.view === "emitir" ? "active" : ""}" data-view="emitir">Emitir</button>
            <button type="button" class="${app.view === "config" ? "active" : ""}" data-view="config">Config</button>
          </div>
          <button class="btn icon ghost" type="button" id="toggle-theme" title="Alternar tema" aria-label="Alternar tema">
            ${app.theme === "dark" ? icons.sun : icons.moon}
          </button>
          <button class="btn icon ghost" type="button" id="logout" title="Sair" aria-label="Sair">
            ${icons.logOut}
          </button>
        </div>
      </div>
    </header>
  `;
}

function getVoucherStatus(voucher) {
  if (voucher.status !== "ativo") return voucher.status;
  const now = new Date();
  const expiration = new Date(`${voucher.validade}T23:59:59`);
  return expiration < now ? "expirado" : "ativo";
}

function statusLabel(status) {
  return (
    {
      ativo: "Ativo",
      utilizado: "Utilizado",
      cancelado: "Cancelado",
      expirado: "Expirado",
    }[status] || "Ativo"
  );
}

function statusClass(status) {
  return (
    {
      ativo: "active",
      utilizado: "used",
      cancelado: "cancelled",
      expirado: "expired",
    }[status] || "active"
  );
}

function metrics() {
  return app.vouchers.reduce(
    (acc, voucher) => {
      acc.total += 1;
      acc[getVoucherStatus(voucher)] += 1;
      return acc;
    },
    { total: 0, ativo: 0, utilizado: 0, cancelado: 0, expirado: 0 },
  );
}

function renderEmitirView() {
  const m = metrics();
  return `
    <section class="summary-grid" aria-label="Resumo">
      ${renderMetric("Vales emitidos", m.total)}
      ${renderMetric("Ativos", m.ativo)}
      ${renderMetric("Utilizados", m.utilizado)}
      ${renderMetric("Cancelados", m.cancelado)}
    </section>
    <section class="layout-grid">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            ${icons.printer}
            <div>
              <h2>Emitir vale troca</h2>
              <p>Preencha os dados da compra e imprima quantas vias precisar.</p>
            </div>
          </div>
        </div>
        <div class="panel-body">${renderVoucherForm()}</div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            ${icons.receipt}
            <div>
              <h2>Ultimos vales</h2>
              <p>Reimprima, utilize ou cancele rapidamente.</p>
            </div>
          </div>
        </div>
        <div class="panel-body">${renderHistory()}</div>
      </div>
    </section>
  `;
}

function renderMetric(label, value) {
  return `
    <div class="metric">
      <span>${escapeHtml(label)}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderVoucherForm() {
  const sellerOptions = app.sellers
    .map(
      (seller) =>
        `<option value="${escapeHtml(seller)}" ${form.vendedora === seller ? "selected" : ""}>${escapeHtml(seller)}</option>`,
    )
    .join("");

  return `
    <form id="voucher-form">
      <div class="form-grid">
        <div class="field full">
          <label for="nfc">Numero NFC *</label>
          <input id="nfc" name="nfc" value="${escapeHtml(form.nfc)}" placeholder="Ex: 000123456" required autocomplete="off" />
        </div>
        <div class="field">
          <label for="diaCompra">Dia da compra</label>
          <input id="diaCompra" name="diaCompra" type="date" value="${escapeHtml(form.diaCompra)}" required />
        </div>
        <div class="field">
          <label for="validade">Validade</label>
          <input id="validade" name="validade" type="date" value="${escapeHtml(form.validade)}" required />
        </div>
        <div class="field">
          <label for="vendedora">Vendedora *</label>
          <select id="vendedora" name="vendedora" required>
            ${sellerOptions || '<option value="">Cadastre uma vendedora</option>'}
          </select>
        </div>
        <div class="field">
          <label for="vias">Quantidade de vias</label>
          <input id="vias" name="vias" type="number" min="1" max="10" value="${escapeHtml(form.vias)}" />
        </div>
        <div class="field full">
          <label for="observacao">Observacao</label>
          <textarea id="observacao" name="observacao" placeholder="Opcional">${escapeHtml(form.observacao)}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn primary" type="submit">${icons.printer}Gerar e imprimir</button>
        <button class="btn ghost" type="button" id="reset-form">${icons.reset}Limpar</button>
      </div>
    </form>
  `;
}

function filteredVouchers() {
  const term = app.search.trim().toLowerCase();
  return [...app.vouchers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((voucher) => {
      const status = getVoucherStatus(voucher);
      const matchesStatus = app.filter === "todos" || app.filter === status;
      const haystack = `${voucher.numero} ${voucher.nfc} ${voucher.vendedora}`.toLowerCase();
      const matchesSearch = !term || haystack.includes(term);
      return matchesStatus && matchesSearch;
    });
}

function renderHistory() {
  const items = filteredVouchers();
  return `
    <div class="toolbar">
      <input id="history-search" value="${escapeHtml(app.search)}" placeholder="Buscar por numero, NFC ou vendedora" />
      <select id="history-filter" aria-label="Filtrar status">
        ${["todos", "ativo", "utilizado", "expirado", "cancelado"]
          .map((value) => `<option value="${value}" ${app.filter === value ? "selected" : ""}>${escapeHtml(value === "todos" ? "Todos" : statusLabel(value))}</option>`)
          .join("")}
      </select>
    </div>
    ${
      items.length
        ? `<div class="history-list">${items.map(renderVoucherRow).join("")}</div>`
        : '<div class="empty-state">Nenhum vale encontrado.</div>'
    }
  `;
}

function renderVoucherRow(voucher) {
  const status = getVoucherStatus(voucher);
  return `
    <article class="voucher-row">
      <div class="voucher-main">
        <div class="voucher-line">
          <span class="voucher-number">N. ${escapeHtml(voucher.numero)}</span>
          <span class="badge ${statusClass(status)}">${statusLabel(status)}</span>
        </div>
        <p class="voucher-meta">
          NFC ${escapeHtml(voucher.nfc)} · ${escapeHtml(voucher.vendedora)} · ${DATE_TIME_FMT.format(new Date(voucher.createdAt))}
        </p>
      </div>
      <div class="row-actions">
        <button class="btn icon small ghost" type="button" data-action="print" data-id="${voucher.id}" title="Reimprimir" aria-label="Reimprimir">${icons.printer}</button>
        ${
          status === "ativo"
            ? `<button class="btn icon small ghost" type="button" data-action="used" data-id="${voucher.id}" title="Marcar utilizado" aria-label="Marcar utilizado">${icons.check}</button>
               <button class="btn icon small danger" type="button" data-action="cancel" data-id="${voucher.id}" title="Cancelar" aria-label="Cancelar">${icons.ban}</button>`
            : ""
        }
        <button class="btn icon small ghost" type="button" data-action="delete" data-id="${voucher.id}" title="Excluir" aria-label="Excluir">${icons.trash}</button>
      </div>
    </article>
  `;
}

function renderSettingsView() {
  return `
    <section class="settings-grid">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            ${icons.settings}
            <div>
              <h2>Dados da empresa</h2>
              <p>Essas informacoes aparecem no cabecalho e rodape do cupom.</p>
            </div>
          </div>
        </div>
        <div class="panel-body">${renderCompanyForm()}</div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            ${icons.plus}
            <div>
              <h2>Vendedoras</h2>
              <p>Use nomes curtos para facilitar a leitura no cupom.</p>
            </div>
          </div>
        </div>
        <div class="panel-body">${renderSellers()}</div>
      </div>
    </section>
  `;
}

function renderCompanyForm() {
  return `
    <form id="company-form">
      <div class="form-grid">
        ${renderField("nome", "Nome da empresa *", settingsForm.nome, "text", "Ex: Loja da Maria", true)}
        ${renderField("cnpj", "CNPJ", settingsForm.cnpj, "text", "00.000.000/0001-00")}
        ${renderField("cep", "CEP", settingsForm.cep, "text", "00000-000")}
        ${renderField("telefone", "Telefone", settingsForm.telefone, "text", "(00) 00000-0000")}
        ${renderField("email", "E-mail", settingsForm.email, "email", "contato@empresa.com")}
        ${renderField("instagram", "Instagram", settingsForm.instagram, "text", "@suaempresa")}
        <div class="field full">
          <label for="endereco">Endereco</label>
          <input id="endereco" name="endereco" value="${escapeHtml(settingsForm.endereco)}" placeholder="Rua, numero, bairro, cidade" />
        </div>
        <div class="field">
          <label for="diasValidade">Dias de validade padrao</label>
          <input id="diasValidade" name="diasValidade" type="number" min="1" max="365" value="${escapeHtml(settingsForm.diasValidade)}" />
          <p class="hint">A validade sera recalculada quando o dia da compra mudar.</p>
        </div>
        <div class="field full">
          <label for="mensagem">Mensagem de rodape</label>
          <textarea id="mensagem" name="mensagem">${escapeHtml(settingsForm.mensagem)}</textarea>
        </div>
      </div>
      <div class="form-actions">
        <div class="config-actions">
          <button class="btn primary" type="submit">${icons.save}Salvar configuracoes</button>
          <button class="btn ghost" type="button" id="buscar-cep">Buscar CEP</button>
        </div>
        <button class="btn ghost" type="button" id="export-data">${icons.download}Exportar dados</button>
      </div>
    </form>
  `;
}

function renderField(name, label, value, type, placeholder, required = false) {
  return `
    <div class="field">
      <label for="${name}">${escapeHtml(label)}</label>
      <input id="${name}" name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${required ? "required" : ""} />
    </div>
  `;
}

function renderSellers() {
  return `
    <form id="seller-form" class="seller-form">
      <input id="seller-name" placeholder="Nome da vendedora" required autocomplete="off" />
      <button class="btn primary" type="submit">${icons.plus}Adicionar</button>
    </form>
    ${
      app.sellers.length
        ? `<div class="seller-list">${app.sellers.map(renderSellerItem).join("")}</div>`
        : '<div class="empty-state">Nenhuma vendedora cadastrada.</div>'
    }
  `;
}

function renderSellerItem(seller) {
  return `
    <div class="seller-item">
      <strong>${escapeHtml(seller)}</strong>
      <button class="btn icon small ghost" type="button" data-remove-seller="${escapeHtml(seller)}" title="Remover" aria-label="Remover">${icons.trash}</button>
    </div>
  `;
}

function renderPrintArea() {
  return printQueue.map(renderReceipt).join("");
}

function renderReceipt(voucher) {
  const empresa = app.company;
  const line = "-".repeat(42);
  return `
    <section class="receipt">
      <div class="center">
        <div class="strong">${escapeHtml(empresa.nome || "Vale Troca")}</div>
        ${empresa.cnpj ? `<div>CNPJ: ${escapeHtml(empresa.cnpj)}</div>` : ""}
        ${empresa.endereco ? `<div>${escapeHtml(empresa.endereco)}</div>` : ""}
        ${empresa.telefone ? `<div>Tel: ${escapeHtml(empresa.telefone)}</div>` : ""}
        ${empresa.instagram ? `<div>${escapeHtml(empresa.instagram)}</div>` : ""}
      </div>
      <div class="line">${line}</div>
      <div class="title">VALE TROCA</div>
      <div class="line">${line}</div>
      <div><span class="strong">NFC:</span> ${escapeHtml(voucher.nfc)}</div>
      <div><span class="strong">Vale N.:</span> ${escapeHtml(voucher.numero)}</div>
      <div><span class="strong">Data compra:</span> ${formatInputDate(voucher.diaCompra)}</div>
      <div class="line">${line}</div>
      <div class="center">
        <div class="strong">VALIDO ATE</div>
        <div class="strong">${formatInputDate(voucher.validade)}</div>
      </div>
      <div class="line">${line}</div>
      <div class="center">Vendedora: ${escapeHtml(voucher.vendedora)}</div>
      ${voucher.observacao ? `<div class="center">${escapeHtml(voucher.observacao)}</div>` : ""}
      <div class="center">${escapeHtml(empresa.mensagem || defaults.company.mensagem)}</div>
      <div class="line">${line}</div>
      <div class="spacer"></div>
    </section>
  `;
}

function bindEvents() {
  document.getElementById("login-form")?.addEventListener("submit", onLogin);

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      app.view = button.dataset.view;
      render();
    });
  });

  document.getElementById("toggle-theme")?.addEventListener("click", () => {
    app.theme = app.theme === "dark" ? "light" : "dark";
    localStorage.setItem("vale-troca-theme", app.theme);
    render();
  });

  document.getElementById("logout")?.addEventListener("click", async () => {
    await api("/api/logout", { method: "POST" });
    app.user = null;
    render();
  });

  bindVoucherForm();
  bindHistory();
  bindSettings();
}

async function onLogin(event) {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.disabled = true;
  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
      }),
    });
    app.user = data.user;
    app.company = { ...defaults.company, ...data.state.company };
    app.sellers = data.state.sellers || [];
    app.vouchers = data.state.vouchers || [];
    settingsForm = { ...app.company };
    form = makeInitialForm();
    render();
  } catch (error) {
    button.disabled = false;
    showToast(error.message);
  }
}

function bindVoucherForm() {
  const voucherForm = document.getElementById("voucher-form");
  if (!voucherForm) return;

  voucherForm.addEventListener("input", (event) => {
    const { name, value } = event.target;
    if (!name) return;
    form[name] = name === "vias" ? clamp(Number(value || 1), 1, 10) : value;
    if (name === "diaCompra") {
      form.validade = addDaysInput(value, app.company.diasValidade);
      render();
    }
  });

  voucherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!app.sellers.length) {
      showToast("Cadastre uma vendedora antes de emitir.");
      return;
    }

    const submit = event.currentTarget.querySelector("button[type='submit']");
    submit.disabled = true;

    try {
      const data = await api("/api/vouchers", {
        method: "POST",
        body: JSON.stringify({
          nfc: form.nfc,
          diaCompra: form.diaCompra,
          validade: form.validade,
          vendedora: form.vendedora,
          observacao: form.observacao,
        }),
      });
      printQueue = Array.from(
        { length: clamp(Number(form.vias || 1), 1, 10) },
        () => data.voucher,
      );
      app.company = data.state.company;
      app.sellers = data.state.sellers;
      app.vouchers = data.state.vouchers;
      form = makeInitialForm();
      render();
      showToast("Vale troca gerado com sucesso.");
      setTimeout(() => window.print(), 250);
    } catch (error) {
      submit.disabled = false;
      showToast(error.message);
    }
  });

  document.getElementById("reset-form")?.addEventListener("click", () => {
    form = makeInitialForm();
    render();
  });
}

function bindHistory() {
  document.getElementById("history-search")?.addEventListener("input", (event) => {
    app.search = event.target.value;
    render();
  });

  document.getElementById("history-filter")?.addEventListener("change", (event) => {
    app.filter = event.target.value;
    render();
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const voucher = app.vouchers.find((item) => item.id === button.dataset.id);
      if (!voucher) return;

      if (button.dataset.action === "print") {
        printQueue = [voucher];
        render();
        setTimeout(() => window.print(), 250);
        return;
      }

      try {
        if (button.dataset.action === "used") {
          const state = await api(`/api/vouchers/${voucher.id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "utilizado" }),
          });
          applyState(state);
          showToast("Vale marcado como utilizado.");
        }

        if (button.dataset.action === "cancel") {
          const state = await api(`/api/vouchers/${voucher.id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "cancelado" }),
          });
          applyState(state);
          showToast("Vale cancelado.");
        }

        if (button.dataset.action === "delete") {
          if (!confirm(`Excluir o vale ${voucher.numero}?`)) return;
          const state = await api(`/api/vouchers/${voucher.id}`, { method: "DELETE" });
          applyState(state);
          showToast("Vale excluido.");
        }

        render();
      } catch (error) {
        showToast(error.message);
      }
    });
  });
}

function bindSettings() {
  const companyForm = document.getElementById("company-form");
  if (companyForm) {
    companyForm.addEventListener("input", (event) => {
      const { name, value } = event.target;
      if (!name) return;
      settingsForm[name] = name === "diasValidade" ? clamp(Number(value || 1), 1, 365) : value;
    });

    companyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = event.currentTarget.querySelector("button[type='submit']");
      button.disabled = true;
      try {
        const state = await api("/api/company", {
          method: "PUT",
          body: JSON.stringify(settingsForm),
        });
        applyState(state);
        form.validade = addDaysInput(form.diaCompra, app.company.diasValidade);
        render();
        showToast("Configuracoes salvas.");
      } catch (error) {
        button.disabled = false;
        showToast(error.message);
      }
    });
  }

  document.getElementById("buscar-cep")?.addEventListener("click", async () => {
    const cep = String(settingsForm.cep || "").replace(/\D/g, "");
    if (cep.length !== 8) {
      showToast("Informe um CEP com 8 digitos.");
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) throw new Error("CEP nao encontrado");
      settingsForm = {
        ...settingsForm,
        cep,
        endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
      };
      render();
      showToast("Endereco preenchido pelo CEP.");
    } catch {
      showToast("Nao foi possivel consultar o CEP.");
    }
  });

  document.getElementById("export-data")?.addEventListener("click", () => {
    const payload = JSON.stringify(
      {
        company: app.company,
        sellers: app.sellers,
        vouchers: app.vouchers,
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vale-troca-backup-${todayInput()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("seller-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("seller-name");
    const seller = input.value.trim();
    if (!seller) return;

    try {
      const state = await api("/api/sellers", {
        method: "POST",
        body: JSON.stringify({ name: seller }),
      });
      applyState(state);
      if (!form.vendedora) form.vendedora = app.sellers[0] || "";
      render();
      showToast("Vendedora adicionada.");
    } catch (error) {
      showToast(error.message);
    }
  });

  document.querySelectorAll("[data-remove-seller]").forEach((button) => {
    button.addEventListener("click", async () => {
      const seller = button.dataset.removeSeller;
      if (!confirm(`Remover ${seller}?`)) return;
      try {
        const state = await api(`/api/sellers/${encodeURIComponent(seller)}`, {
          method: "DELETE",
        });
        applyState(state);
        if (form.vendedora === seller) form.vendedora = app.sellers[0] || "";
        render();
        showToast("Vendedora removida.");
      } catch (error) {
        showToast(error.message);
      }
    });
  });
}

function applyState(state) {
  app.company = { ...defaults.company, ...state.company };
  app.sellers = state.sellers || [];
  app.vouchers = state.vouchers || [];
  settingsForm = { ...app.company };
}

function formatInputDate(value) {
  return DATE_FMT.format(new Date(`${value}T12:00:00`));
}

function clamp(value, min, max) {
  return Math.min(Math.max(Number(value) || min, min), max);
}

function showToast(message) {
  clearTimeout(toastTimer);
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}
