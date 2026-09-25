const SUPABASE_URL = "https://qrsvakoflmuertillpod.supabase.co";
const SUPABASE_KEY = "sb_publishable_xMBIXZPhX7mkSIMfQT3HBA_sPnhjFb9";

let supabaseClient = null;

async function init() {
  const script = document.createElement("script");

  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

  script.onload = async () => {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    setupNavigation();
    setupButtons();

    const { data } = await supabaseClient.auth.getSession();

    if (data.session) {
      showApp();

      document.getElementById("status").textContent =
        "Accesso effettuato. Connessione a Supabase riuscita.";

      await loadDashboard();
    } else {
      showLogin();
    }
  };

  script.onerror = () => {
    document.getElementById("status").textContent =
      "Errore nel caricamento di Supabase.";
  };

  document.head.appendChild(script);
}


/* LOGIN */

function showLogin() {
  document.querySelector(".app").style.display = "none";

  let login = document.getElementById("login-screen");

  if (!login) {
    login = document.createElement("div");
    login.id = "login-screen";

    login.innerHTML = `
      <div style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#f4f7f8;
        padding:20px;
      ">
        <div style="
          width:100%;
          max-width:400px;
          background:white;
          padding:30px;
          border-radius:16px;
          border:1px solid #e2e8ea;
          box-shadow:0 10px 30px rgba(0,0,0,0.08);
        ">
          <h1 style="margin-top:0;">
            🎾 Padel Manager
          </h1>

          <p style="color:#728085;">
            Accedi al gestionale del centro padel
          </p>

          <input
            id="login-email"
            type="email"
            placeholder="Email"
            style="
              width:100%;
              padding:12px;
              margin:8px 0;
              border:1px solid #ccd5d8;
              border-radius:8px;
            "
          >

          <input
            id="login-password"
            type="password"
            placeholder="Password"
            style="
              width:100%;
              padding:12px;
              margin:8px 0;
              border:1px solid #ccd5d8;
              border-radius:8px;
            "
          >

          <button
            id="login-button"
            class="primary"
            style="
              width:100%;
              margin-top:12px;
            "
          >
            Accedi
          </button>

          <p id="login-message" style="margin-top:15px;"></p>
        </div>
      </div>
    `;

    document.body.appendChild(login);

    document
      .getElementById("login-button")
      .addEventListener("click", loginUser);
  }

  login.style.display = "block";
}


function showApp() {
  document.querySelector(".app").style.display = "flex";

  const login = document.getElementById("login-screen");

  if (login) {
    login.style.display = "none";
  }
}


async function loginUser() {
  const email =
    document.getElementById("login-email").value.trim();

  const password =
    document.getElementById("login-password").value;

  const message =
    document.getElementById("login-message");

  if (!email || !password) {
    message.textContent =
      "Inserisci email e password.";
    return;
  }

  message.textContent =
    "Accesso in corso...";

  const { error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    console.error(error);

    message.textContent =
      "Email o password non corrette.";

    return;
  }

  showApp();

  document.getElementById("status").textContent =
    "Accesso effettuato. Connessione a Supabase riuscita.";

  await loadDashboard();
}


/* NAVIGAZIONE */

function setupNavigation() {
  document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () => {

      const sectionId = button.dataset.section;

      document.querySelectorAll(".nav").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
      });

      document
        .getElementById(sectionId)
        .classList.add("active");

      document.getElementById("page-title").textContent =
        button.textContent.trim();

 if (sectionId === "players") {
  loadPlayers();
}

if (sectionId === "courts") {
  loadCourts();
}
      if (sectionId === "bookings") {
  loadBookings();
}
if (sectionId === "payments") {
  loadPayments();
}
      if (sectionId === "tournaments") {
  loadTournaments();
}
    });
  });
}


function setupButtons() {
  document.querySelectorAll(".primary").forEach(button => {

  if (button.textContent.includes("Nuovo giocatore")) {
  button.addEventListener("click", openPlayerForm);
}

if (button.textContent.includes("Nuovo campo")) {
  button.addEventListener("click", openCourtForm);
}

    if (button.textContent.includes("Nuova prenotazione")) {
  button.addEventListener("click", openBookingForm);
}

    if (button.textContent.includes("Nuovo torneo")) {
  button.addEventListener("click", openTournamentForm);
}

    if (button.textContent.includes("Nuovo pagamento")) {
  button.addEventListener("click", openPaymentForm);
}
  });
}


/* DASHBOARD */

async function countRows(tableName) {

  const { count, error } =
    await supabaseClient
      .from(tableName)
      .select("*", {
        count: "exact",
        head: true
      });

  if (error) {
    console.error(`Errore ${tableName}:`, error);
    return 0;
  }

  return count || 0;
}


async function loadDashboard() {

  const players =
    await countRows("players");

  const courts =
    await countRows("courts");

  const bookings =
    await countRows("bookings");

  const tournaments =
    await countRows("tournaments");

  document.getElementById("players-count").textContent =
    players;

  document.getElementById("courts-count").textContent =
    courts;

  document.getElementById("bookings-count").textContent =
    bookings;

  document.getElementById("tournaments-count").textContent =
    tournaments;
}


/* NUOVO GIOCATORE */

function openPlayerForm() {

  const container =
    document.getElementById("players-content");

  container.innerHTML = `

    <div class="player-form">

      <h3>Nuovo giocatore</h3>

      <div class="form-grid">

        <input
          id="player-first-name"
          type="text"
          placeholder="Nome"
        >

        <input
          id="player-last-name"
          type="text"
          placeholder="Cognome"
        >

        <input
          id="player-phone"
          type="text"
          placeholder="Telefono"
        >

        <input
          id="player-email"
          type="email"
          placeholder="Email"
        >

        <select id="player-level">

          <option value="">Livello</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzato">Avanzato</option>
          <option value="Agonista">Agonista</option>

        </select>

        <textarea
          id="player-notes"
          placeholder="Note"
        ></textarea>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-player"
        >
          Salva giocatore
        </button>

        <button
          id="cancel-player"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="player-message"></p>

    </div>
  `;

  document
    .getElementById("save-player")
    .addEventListener("click", savePlayer);

  document
    .getElementById("cancel-player")
    .addEventListener("click", loadPlayers);
}


async function savePlayer() {

  const firstName =
    document.getElementById("player-first-name").value.trim();

  const lastName =
    document.getElementById("player-last-name").value.trim();

  const phone =
    document.getElementById("player-phone").value.trim();

  const email =
    document.getElementById("player-email").value.trim();

  const level =
    document.getElementById("player-level").value;

  const notes =
    document.getElementById("player-notes").value.trim();

  const message =
    document.getElementById("player-message");

  if (!firstName || !lastName) {
    message.textContent =
      "Inserisci almeno nome e cognome.";
    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("players")
      .insert({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email: email || null,
        level: level || null,
        notes: notes || null
      });

  if (error) {
    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  message.textContent =
    "Giocatore salvato!";

  await loadDashboard();

  setTimeout(() => {
    loadPlayers();
  }, 700);
}


/* ELENCO GIOCATORI */

async function loadPlayers() {

  const container =
    document.getElementById("players-content");

  container.innerHTML =
    "Caricamento giocatori...";

  const { data, error } =
    await supabaseClient
      .from("players")
      .select("*")
      .order("last_name", {
        ascending: true
      });

  if (error) {
    console.error(error);

    container.innerHTML =
      "Errore nel caricamento dei giocatori.";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "Nessun giocatore presente.";

    return;
  }

  let html = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="text-align:left;padding:12px;">
              Nome
            </th>

            <th style="text-align:left;padding:12px;">
              Telefono
            </th>

            <th style="text-align:left;padding:12px;">
              Email
            </th>

            <th style="text-align:left;padding:12px;">
              Livello
            </th>

            <th style="text-align:left;padding:12px;">
              Azioni
            </th>

          </tr>

        </thead>

        <tbody>
  `;

  data.forEach(player => {

    html += `

      <tr>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player.first_name)}
          ${escapeHtml(player.last_name)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player.phone || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player.email || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player.level || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">

          <button
            onclick="editPlayer('${player.id}')"
            style="
              padding:7px 10px;
              border:0;
              border-radius:7px;
              cursor:pointer;
              margin-right:5px;
            "
          >
            Modifica
          </button>

          <button
            onclick="deletePlayer('${player.id}')"
            style="
              padding:7px 10px;
              border:0;
              border-radius:7px;
              cursor:pointer;
            "
          >
            Elimina
          </button>

        </td>

      </tr>
    `;
  });

  html += `

        </tbody>

      </table>

    </div>
  `;

  container.innerHTML = html;
}


/* MODIFICA GIOCATORE */

async function editPlayer(id) {

  const { data, error } =
    await supabaseClient
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {

    console.error(error);

    alert("Errore nel caricamento del giocatore.");

    return;
  }

  const container =
    document.getElementById("players-content");

  container.innerHTML = `

    <div class="player-form">

      <h3>Modifica giocatore</h3>

      <div class="form-grid">

        <input
          id="player-first-name"
          type="text"
          value="${escapeHtml(data.first_name)}"
          placeholder="Nome"
        >

        <input
          id="player-last-name"
          type="text"
          value="${escapeHtml(data.last_name)}"
          placeholder="Cognome"
        >

        <input
          id="player-phone"
          type="text"
          value="${escapeHtml(data.phone || "")}"
          placeholder="Telefono"
        >

        <input
          id="player-email"
          type="email"
          value="${escapeHtml(data.email || "")}"
          placeholder="Email"
        >

        <select id="player-level">

          <option value="">Livello</option>

          <option
            value="Principiante"
            ${data.level === "Principiante" ? "selected" : ""}
          >
            Principiante
          </option>

          <option
            value="Intermedio"
            ${data.level === "Intermedio" ? "selected" : ""}
          >
            Intermedio
          </option>

          <option
            value="Avanzato"
            ${data.level === "Avanzato" ? "selected" : ""}
          >
            Avanzato
          </option>

          <option
            value="Agonista"
            ${data.level === "Agonista" ? "selected" : ""}
          >
            Agonista
          </option>

        </select>

        <textarea
          id="player-notes"
          placeholder="Note"
        >${escapeHtml(data.notes || "")}</textarea>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="update-player"
        >
          Salva modifiche
        </button>

        <button
          id="cancel-player"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="player-message"></p>

    </div>
  `;

  document
    .getElementById("update-player")
    .addEventListener("click", () => updatePlayer(id));

  document
    .getElementById("cancel-player")
    .addEventListener("click", loadPlayers);
}


async function updatePlayer(id) {

  const firstName =
    document.getElementById("player-first-name").value.trim();

  const lastName =
    document.getElementById("player-last-name").value.trim();

  const phone =
    document.getElementById("player-phone").value.trim();

  const email =
    document.getElementById("player-email").value.trim();

  const level =
    document.getElementById("player-level").value;

  const notes =
    document.getElementById("player-notes").value.trim();

  const message =
    document.getElementById("player-message");

  if (!firstName || !lastName) {

    message.textContent =
      "Inserisci almeno nome e cognome.";

    return;
  }

  message.textContent =
    "Salvataggio modifiche...";

  const { error } =
    await supabaseClient
      .from("players")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email: email || null,
        level: level || null,
        notes: notes || null
      })
      .eq("id", id);

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante la modifica.";

    return;
  }

  message.textContent =
    "Modifiche salvate!";

  await loadDashboard();

  setTimeout(() => {
    loadPlayers();
  }, 700);
}


/* ELIMINA GIOCATORE */

async function deletePlayer(id) {

  const conferma =
    confirm("Vuoi davvero eliminare questo giocatore?");

  if (!conferma) {
    return;
  }

  const { error } =
    await supabaseClient
      .from("players")
      .delete()
      .eq("id", id);

  if (error) {

    console.error(error);

    alert("Errore durante l'eliminazione.");

    return;
  }

  await loadDashboard();

  await loadPlayers();
}


/* PROTEZIONE TESTO */

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* LOGOUT */

async function logout() {

  if (!supabaseClient) {
    return;
  }

  await supabaseClient.auth.signOut();

  window.location.reload();
}


document.addEventListener("DOMContentLoaded", () => {

  document
    .getElementById("logout-btn")
    .addEventListener("click", logout);

  init();

});

/* CAMPI */

function openCourtForm() {

  const container =
    document.getElementById("courts-content");

  container.innerHTML = `

    <div class="player-form">

      <h3>Nuovo campo</h3>

      <div class="form-grid">

        <input
          id="court-name"
          type="text"
          placeholder="Nome campo"
        >

        <select id="court-type">

          <option value="">Tipologia</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>

        </select>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-court"
        >
          Salva campo
        </button>

        <button
          id="cancel-court"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="court-message"></p>

    </div>
  `;

  document
    .getElementById("save-court")
    .addEventListener("click", saveCourt);

  document
    .getElementById("cancel-court")
    .addEventListener("click", loadCourts);
}


async function saveCourt() {

  const name =
    document.getElementById("court-name").value.trim();

  const type =
    document.getElementById("court-type").value;

  const message =
    document.getElementById("court-message");

  if (!name) {

    message.textContent =
      "Inserisci il nome del campo.";

    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("courts")
      .insert({
        name: name,
        type: type || null
      });

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  message.textContent =
    "Campo salvato!";

  await loadDashboard();

  setTimeout(() => {
    loadCourts();
  }, 700);
}


async function loadCourts() {

  const container =
    document.getElementById("courts-content");

  container.innerHTML =
    "Caricamento campi...";

  const { data, error } =
    await supabaseClient
      .from("courts")
      .select("*")
      .order("name", {
        ascending: true
      });

  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento dei campi.";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "Nessun campo presente.";

    return;
  }

  let html = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="text-align:left;padding:12px;">
              Campo
            </th>

            <th style="text-align:left;padding:12px;">
              Tipologia
            </th>

            <th style="text-align:left;padding:12px;">
              Stato
            </th>

          </tr>

        </thead>

        <tbody>
  `;

  data.forEach(court => {

    html += `

      <tr>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(court.name)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(court.type || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${court.active ? "Attivo" : "Non attivo"}
        </td>

      </tr>
    `;
  });

  html += `

        </tbody>

      </table>

    </div>
  `;

  container.innerHTML = html;
}
/* PRENOTAZIONI */

async function openBookingForm() {

  const container =
    document.getElementById("bookings-content");

  container.innerHTML =
    "Caricamento dati...";

  const { data: players, error: playersError } =
    await supabaseClient
      .from("players")
      .select("id, first_name, last_name")
      .eq("active", true)
      .order("last_name");

  const { data: courts, error: courtsError } =
    await supabaseClient
      .from("courts")
      .select("id, name")
      .eq("active", true)
      .order("name");

  if (playersError || courtsError) {

    console.error(playersError || courtsError);

    container.innerHTML =
      "Errore nel caricamento dei dati.";

    return;
  }

  let playerOptions = `
    <option value="">Seleziona giocatore</option>
  `;

  players.forEach(player => {

    playerOptions += `
      <option value="${player.id}">
        ${escapeHtml(player.last_name)}
        ${escapeHtml(player.first_name)}
      </option>
    `;
  });

  let courtOptions = `
    <option value="">Seleziona campo</option>
  `;

  courts.forEach(court => {

    courtOptions += `
      <option value="${court.id}">
        ${escapeHtml(court.name)}
      </option>
    `;
  });

  container.innerHTML = `

    <div class="player-form">

      <h3>Nuova prenotazione</h3>

      <div class="form-grid">

        <input
          id="booking-date"
          type="date"
        >

        <input
          id="booking-start"
          type="time"
        >

        <input
          id="booking-end"
          type="time"
        >

        <select id="booking-court">
          ${courtOptions}
        </select>

        <select id="booking-player">
          ${playerOptions}
        </select>

        <input
          id="booking-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Importo €"
        >

        <select id="booking-paid">

          <option value="false">
            Non pagato
          </option>

          <option value="true">
            Pagato
          </option>

        </select>

        <textarea
          id="booking-notes"
          placeholder="Note"
        ></textarea>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-booking"
        >
          Salva prenotazione
        </button>

        <button
          id="cancel-booking"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="booking-message"></p>

    </div>
  `;

  document
    .getElementById("save-booking")
    .addEventListener("click", saveBooking);

  document
    .getElementById("cancel-booking")
    .addEventListener("click", loadBookings);
}


async function saveBooking() {

  const date =
    document.getElementById("booking-date").value;

  const start =
    document.getElementById("booking-start").value;

  const end =
    document.getElementById("booking-end").value;

  const courtId =
    document.getElementById("booking-court").value;

  const playerId =
    document.getElementById("booking-player").value;

  const amount =
    document.getElementById("booking-amount").value;

  const paid =
    document.getElementById("booking-paid").value === "true";

  const notes =
    document.getElementById("booking-notes").value.trim();

  const message =
    document.getElementById("booking-message");

  if (!date || !start || !end || !courtId) {

    message.textContent =
      "Inserisci data, orari e campo.";

    return;
  }

  if (end <= start) {

    message.textContent =
      "L'orario di fine deve essere successivo all'orario di inizio.";

    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("bookings")
      .insert({

        court_id: courtId,

        player_id:
          playerId || null,

        booking_date:
          date,

        start_time:
          start,

        end_time:
          end,

        status:
          "confirmed",

        amount:
          Number(amount) || 0,

        paid:
          paid,

        notes:
          notes || null

      });

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  message.textContent =
    "Prenotazione salvata!";

  await loadDashboard();

  setTimeout(() => {
    loadBookings();
  }, 700);
}


async function loadBookings() {

  const container =
    document.getElementById("bookings-content");

  container.innerHTML =
    "Caricamento prenotazioni...";

  const { data, error } =
    await supabaseClient
      .from("bookings")
      .select(`
        *,
        courts(name),
        players(first_name, last_name)
      `)
      .order("booking_date", {
        ascending: true
      })
      .order("start_time", {
        ascending: true
      });

  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento delle prenotazioni.";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "Nessuna prenotazione presente.";

    return;
  }

  let html = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="text-align:left;padding:12px;">
              Data
            </th>

            <th style="text-align:left;padding:12px;">
              Orario
            </th>

            <th style="text-align:left;padding:12px;">
              Campo
            </th>

            <th style="text-align:left;padding:12px;">
              Giocatore
            </th>

            <th style="text-align:left;padding:12px;">
              Importo
            </th>

            <th style="text-align:left;padding:12px;">
              Pagamento
            </th>

          </tr>

        </thead>

        <tbody>
  `;

  data.forEach(booking => {

    const player =
      booking.players
        ? `${booking.players.last_name} ${booking.players.first_name}`
        : "-";

    html += `

      <tr>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(booking.booking_date)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(booking.start_time)}
          -
          ${escapeHtml(booking.end_time)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(booking.courts?.name || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          € ${Number(booking.amount || 0).toFixed(2)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${booking.paid ? "Pagato" : "Non pagato"}
        </td>

      </tr>
    `;
  });

  html += `

        </tbody>

      </table>

    </div>
  `;

  container.innerHTML = html;
}
/* PAGAMENTI */

async function openPaymentForm() {

  const container =
    document.getElementById("payments-content");

  container.innerHTML =
    "Caricamento dati...";

  const { data: players, error: playersError } =
    await supabaseClient
      .from("players")
      .select("id, first_name, last_name")
      .eq("active", true)
      .order("last_name");

  if (playersError) {

    console.error(playersError);

    container.innerHTML =
      "Errore nel caricamento dei giocatori.";

    return;
  }

  let playerOptions = `
    <option value="">Seleziona giocatore</option>
  `;

  players.forEach(player => {

    playerOptions += `
      <option value="${player.id}">
        ${escapeHtml(player.last_name)}
        ${escapeHtml(player.first_name)}
      </option>
    `;
  });

  container.innerHTML = `

    <div class="player-form">

      <h3>Nuovo pagamento</h3>

      <div class="form-grid">

        <select id="payment-player">
          ${playerOptions}
        </select>

        <input
          id="payment-amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Importo €"
        >

        <input
          id="payment-date"
          type="date"
        >

        <select id="payment-method">

          <option value="">
            Metodo di pagamento
          </option>

          <option value="Contanti">
            Contanti
          </option>

          <option value="POS">
            POS
          </option>

          <option value="Bonifico">
            Bonifico
          </option>

          <option value="Altro">
            Altro
          </option>

        </select>

        <input
          id="payment-description"
          type="text"
          placeholder="Descrizione"
        >

        <textarea
          id="payment-notes"
          placeholder="Note"
        ></textarea>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-payment"
        >
          Salva pagamento
        </button>

        <button
          id="cancel-payment"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="payment-message"></p>

    </div>
  `;

  document
    .getElementById("payment-date")
    .value =
    new Date().toISOString().split("T")[0];

  document
    .getElementById("save-payment")
    .addEventListener("click", savePayment);

  document
    .getElementById("cancel-payment")
    .addEventListener("click", loadPayments);
}


async function savePayment() {

  const playerId =
    document.getElementById("payment-player").value;

  const amount =
    document.getElementById("payment-amount").value;

  const date =
    document.getElementById("payment-date").value;

  const method =
    document.getElementById("payment-method").value;

  const description =
    document.getElementById("payment-description").value.trim();

  const notes =
    document.getElementById("payment-notes").value.trim();

  const message =
    document.getElementById("payment-message");

  if (!amount || Number(amount) <= 0 || !date) {

    message.textContent =
      "Inserisci almeno importo e data.";

    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("payments")
      .insert({

        player_id:
          playerId || null,

        amount:
          Number(amount),

        payment_date:
          date,

        payment_method:
          method || null,

        description:
          description || null,

        notes:
          notes || null

      });

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  message.textContent =
    "Pagamento salvato!";

  await loadDashboard();

  setTimeout(() => {
    loadPayments();
  }, 700);
}


async function loadPayments() {

  const container =
    document.getElementById("payments-content");

  container.innerHTML =
    "Caricamento pagamenti...";

  const { data, error } =
    await supabaseClient
      .from("payments")
      .select(`
        *,
        players(first_name, last_name)
      `)
      .order("payment_date", {
        ascending: false
      });

  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento dei pagamenti.";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "Nessun pagamento presente.";

    return;
  }

  let html = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="text-align:left;padding:12px;">
              Data
            </th>

            <th style="text-align:left;padding:12px;">
              Giocatore
            </th>

            <th style="text-align:left;padding:12px;">
              Importo
            </th>

            <th style="text-align:left;padding:12px;">
              Metodo
            </th>

            <th style="text-align:left;padding:12px;">
              Descrizione
            </th>

          </tr>

        </thead>

        <tbody>
  `;

  data.forEach(payment => {

    const player =
      payment.players
        ? `${payment.players.last_name} ${payment.players.first_name}`
        : "-";

    html += `

      <tr>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(payment.payment_date)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(player)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          € ${Number(payment.amount || 0).toFixed(2)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(payment.payment_method || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(payment.description || "-")}
        </td>

      </tr>
    `;
  });

  html += `

        </tbody>

      </table>

    </div>
  `;

  container.innerHTML = html;
}
/* TORNEI */

async function openTournamentForm() {

  const container =
    document.getElementById("tournaments-content");

  container.innerHTML = `

    <div class="player-form">

      <h3>Nuovo torneo</h3>

      <div class="form-grid">

        <input
          id="tournament-name"
          type="text"
          placeholder="Nome torneo"
        >

        <input
          id="tournament-category"
          type="text"
          placeholder="Categoria"
        >
        
        <input
  id="tournament-website"
  type="url"
  placeholder="Link pagina web del torneo"
>

        <input
          id="tournament-start"
          type="date"
        >

        <input
          id="tournament-end"
          type="date"
        >

        <select id="tournament-status">

          <option value="planned">
            Programmato
          </option>

          <option value="active">
            In corso
          </option>

          <option value="completed">
            Concluso
          </option>

        </select>

        <textarea
          id="tournament-description"
          placeholder="Descrizione"
        ></textarea>

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-tournament"
        >
          Salva torneo
        </button>

        <button
          id="cancel-tournament"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="tournament-message"></p>

    </div>
  `;

  document
    .getElementById("save-tournament")
    .addEventListener(
      "click",
      saveTournament
    );

  document
    .getElementById("cancel-tournament")
    .addEventListener(
      "click",
      loadTournaments
    );
}


async function saveTournament() {

  const name =
    document
      .getElementById("tournament-name")
      .value
      .trim();

  const category =
    document
      .getElementById("tournament-category")
      .value
      .trim();

  const website =
  document
    .getElementById("tournament-website")
    .value
    .trim();
  
  const startDate =
    document
      .getElementById("tournament-start")
      .value;

  const endDate =
    document
      .getElementById("tournament-end")
      .value;

  const status =
    document
      .getElementById("tournament-status")
      .value;

  const description =
    document
      .getElementById("tournament-description")
      .value
      .trim();

  const message =
    document
      .getElementById("tournament-message");

  if (!name) {

    message.textContent =
      "Inserisci il nome del torneo.";

    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("tournaments")
      .insert({

        name: name,

        category:
          category || null,

        website_url:
  website || null,

        start_date:
          startDate || null,

        end_date:
          endDate || null,

        status:
          status,

        description:
          description || null

      });

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  message.textContent =
    "Torneo salvato!";

  await loadDashboard();

  setTimeout(() => {
    loadTournaments();
  }, 700);
}


async function loadTournaments() {

  const container =
    document.getElementById("tournaments-content");

  container.innerHTML =
    "Caricamento tornei...";

  const { data, error } =
    await supabaseClient
      .from("tournaments")
      .select("*")
      .order("start_date", {
        ascending: false
      });

  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento dei tornei.";

    return;
  }

  if (!data || data.length === 0) {

    container.innerHTML =
      "Nessun torneo presente.";

    return;
  }

  let html = `

    <div style="overflow-x:auto;">

      <table style="
        width:100%;
        border-collapse:collapse;
      ">

        <thead>

          <tr>

            <th style="text-align:left;padding:12px;">
              Torneo
            </th>

            <th style="text-align:left;padding:12px;">
              Categoria
            </th>

<th style="text-align:left;padding:12px;">
  Pagina web
</th>

            <th style="text-align:left;padding:12px;">
              Inizio
            </th>

            <th style="text-align:left;padding:12px;">
              Fine
            </th>

            <th style="text-align:left;padding:12px;">
              Stato
            </th>
            
<th style="text-align:left;padding:12px;">
  Azioni
</th>
          </tr>

        </thead>

        <tbody>
  `;

  data.forEach(tournament => {

    html += `

      <tr>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(tournament.name)}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(tournament.category || "-")}
        </td>

<td style="padding:12px;border-top:1px solid #e2e8ea;">
  ${
    tournament.website_url
      ? `<a href="${escapeHtml(tournament.website_url)}" target="_blank">Apri pagina</a>`
      : "-"
  }
</td>
        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(tournament.start_date || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${escapeHtml(tournament.end_date || "-")}
        </td>

        <td style="padding:12px;border-top:1px solid #e2e8ea;">
          ${
  tournament.status === "planned"
    ? "Programmato"
    : tournament.status === "active"
      ? "In corso"
      : tournament.status === "completed"
        ? "Concluso"
        : escapeHtml(tournament.status || "-")
}
        </td>

<td style="padding:12px;border-top:1px solid #e2e8ea;">
  <button
    class="primary tournament-manage"
    data-id="${tournament.id}"
  >
    Gestisci
  </button>
</td>

      </tr>
    `;
  });

  html += `

        </tbody>

      </table>

    </div>
  `;

  container.innerHTML = html;
}

   document.addEventListener("click", function(event) {

  const button =
    event.target.closest(".tournament-manage");

  if (!button) {
    return;
  }

  const tournamentId =
    button.getAttribute("data-id");

  openTournamentManager(tournamentId);

});

document.addEventListener("click", async function(event) {

  const button =
    event.target.closest("#generate-calendar");

  if (!button) {
    return;
  }

  const tournamentId =
    button.getAttribute("data-tournament");

  if (!tournamentId) {
    alert("Torneo non identificato.");
    return;
  }

  const { data: teams, error: teamsError } =
    await supabaseClient
      .from("tournament_teams")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("name");

  if (teamsError) {
    console.error(teamsError);
    alert("Errore nel caricamento delle formazioni.");
    return;
  }

    const { data: matches, error: matchesError } =
    await supabaseClient
      .from("tournament_matches")
      .select(`
        *,
        team1:tournament_teams!team1_id(name),
        team2:tournament_teams!team2_id(name)
      `)
      .eq("tournament_id", tournamentId)
      .order("round_number")
      .order("match_date");

  if (matchesError) {
    console.error(matchesError);
  }
  if (!teams || teams.length !== 6) {
    alert(
      "Per generare il calendario servono esattamente 6 formazioni."
    );
    return;
  }

  const { data: existingMatches, error: checkError } =
    await supabaseClient
      .from("tournament_matches")
      .select("id")
      .eq("tournament_id", tournamentId);

  if (checkError) {
    console.error(checkError);
    alert("Errore nel controllo delle partite.");
    return;
  }

  if (existingMatches && existingMatches.length > 0) {
    alert("Il calendario di questo torneo è già stato generato.");
    return;
  }

  const rotatingTeams = [...teams];
  const matches = [];

  for (let round = 1; round <= 5; round++) {

    matches.push(
      {
        tournament_id: tournamentId,
        round_number: round,
        team1_id: rotatingTeams[0].id,
        team2_id: rotatingTeams[5].id,
        status: "scheduled"
      },
      {
        tournament_id: tournamentId,
        round_number: round,
        team1_id: rotatingTeams[1].id,
        team2_id: rotatingTeams[4].id,
        status: "scheduled"
      },
      {
        tournament_id: tournamentId,
        round_number: round,
        team1_id: rotatingTeams[2].id,
        team2_id: rotatingTeams[3].id,
        status: "scheduled"
      }
    );

    rotatingTeams.splice(
      1,
      0,
      rotatingTeams.pop()
    );
  }

  const { error: insertError } =
    await supabaseClient
      .from("tournament_matches")
      .insert(matches);

  if (insertError) {
    console.error(insertError);
    alert("Errore nella creazione del calendario.");
    return;
  }

  alert("Calendario generato: 5 giornate e 15 partite.");

});

async function openTournamentManager(tournamentId) {

  const container =
    document.getElementById("tournaments-content");

  container.innerHTML =
    "Caricamento torneo...";

  const { data: tournament, error } =
    await supabaseClient
      .from("tournaments")
      .select("*")
      .eq("id", tournamentId)
      .single();

  const { data: teams, error: teamsError } =
  await supabaseClient
    .from("tournament_teams")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("name");

if (teamsError) {

  console.error(teamsError);

}
  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento del torneo.";

    return;
  }

  container.innerHTML = `

    <div class="panel">

      <div class="panel-head">

        <div>

          <h2>
            ${escapeHtml(tournament.name)}
          </h2>

          <p>
            ${escapeHtml(tournament.category || "")}
          </p>

        </div>

        <button
          class="primary"
          id="back-to-tournaments"
        >
          ← Tornei
        </button>

      </div>

      <div class="cards">

        <div class="card">
  <span>Formazioni</span>
  <strong>${teams ? teams.length : 0} / 6</strong>
</div>

        <div class="card">
          <span>Giornate</span>
          <strong>5</strong>
        </div>

        <div class="card">
          <span>Partite</span>
          <strong>0</strong>
        </div>
        <div
  id="tournament-calendar"
  style="margin-top:20px;"
>
</div>
<div style="margin-top:20px;">
 <button
  class="primary"
  id="generate-calendar"
  data-tournament="${tournamentId}"
>
  Genera calendario
</button>
</div>
      </div>

      <div class="panel">

        <div class="panel-head">

          <h3>Formazioni</h3>

          <button
            class="primary"
            id="add-team"
          >
            + Nuova formazione
          </button>

        </div>

        <div id="teams-content">

  ${
    teams && teams.length > 0
      ? teams.map(team => `
          <div style="
            padding:15px;
            border-top:1px solid #e2e8ea;
          ">

            <strong>
              ${escapeHtml(team.name)}
            </strong>

            <div style="margin-top:6px;">
              ${escapeHtml(team.player1_name || "-")}
              &
              ${escapeHtml(team.player2_name || "-")}
            </div>

<div style="margin-top:10px;">

  <button
    class="primary edit-team"
    data-id="${team.id}"
    data-tournament="${tournamentId}"
  >
    Modifica
  </button>

  <button
    class="delete-team"
    data-id="${team.id}"
    data-tournament="${tournamentId}"
    style="
      margin-left:8px;
      padding:11px 16px;
      border:0;
      border-radius:9px;
      cursor:pointer;
    "
  >
    Elimina
  </button>

</div>
          </div>
        `).join("")
      : `
        <div class="empty">
          Nessuna formazione inserita.
        </div>
      `
  }

</div>

      </div>

    </div>
  `;

  document
    .getElementById("back-to-tournaments")
    .addEventListener(
      "click",
      loadTournaments
    );

document
  .getElementById("add-team")
  .addEventListener(
    "click",
    function() {

      if (teams && teams.length >= 6) {

        alert(
          "Questo torneo può avere un massimo di 6 formazioni."
        );

        return;
      }

      openTeamForm(tournamentId);

    }
  );

}
function openTeamForm(tournamentId) {

  const container =
    document.getElementById("tournaments-content");

  container.innerHTML = `

    <div class="panel">

      <h3>Nuova formazione</h3>

      <div class="form-grid">

        <input
          id="team-name"
          type="text"
          placeholder="Nome formazione"
        >

        <input
          id="team-player1"
          type="text"
          placeholder="Giocatore 1"
        >

        <input
          id="team-player2"
          type="text"
          placeholder="Giocatore 2"
        >

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="save-team"
        >
          Salva formazione
        </button>

        <button
          id="cancel-team"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="team-message"></p>

    </div>
  `;

  document
    .getElementById("save-team")
    .addEventListener(
      "click",
      function() {

        saveTeam(tournamentId);

      }
    );

  document
    .getElementById("cancel-team")
    .addEventListener(
      "click",
      function() {

        openTournamentManager(tournamentId);

      }
    );

}


async function saveTeam(tournamentId) {

  const name =
    document
      .getElementById("team-name")
      .value
      .trim();

  const player1 =
    document
      .getElementById("team-player1")
      .value
      .trim();

  const player2 =
    document
      .getElementById("team-player2")
      .value
      .trim();

  const message =
    document
      .getElementById("team-message");

  if (!name || !player1 || !player2) {

    message.textContent =
      "Inserisci nome formazione e i due giocatori.";

    return;
  }

  message.textContent =
    "Salvataggio in corso...";

  const { error } =
    await supabaseClient
      .from("tournament_teams")
      .insert({

        tournament_id:
          tournamentId,

        name:
          name,

        player1_name:
          player1,

        player2_name:
          player2

      });

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  openTournamentManager(tournamentId);

}
document.addEventListener("click", function(event) {

  const editButton =
    event.target.closest(".edit-team");

  if (editButton) {

    const teamId =
      editButton.getAttribute("data-id");

    const tournamentId =
      editButton.getAttribute("data-tournament");

    openEditTeamForm(
      teamId,
      tournamentId
    );

    return;
  }

  const deleteButton =
    event.target.closest(".delete-team");

  if (deleteButton) {

    const teamId =
      deleteButton.getAttribute("data-id");

    const tournamentId =
      deleteButton.getAttribute("data-tournament");

    deleteTeam(
      teamId,
      tournamentId
    );

  }

});


async function openEditTeamForm(
  teamId,
  tournamentId
) {

  const container =
    document.getElementById(
      "tournaments-content"
    );

  container.innerHTML =
    "Caricamento formazione...";

  const { data: team, error } =
    await supabaseClient
      .from("tournament_teams")
      .select("*")
      .eq("id", teamId)
      .single();

  if (error) {

    console.error(error);

    container.innerHTML =
      "Errore nel caricamento della formazione.";

    return;
  }

  container.innerHTML = `

    <div class="panel">

      <h3>Modifica formazione</h3>

      <div class="form-grid">

        <input
          id="edit-team-name"
          type="text"
          value="${escapeHtml(team.name)}"
          placeholder="Nome formazione"
        >

        <input
          id="edit-team-player1"
          type="text"
          value="${escapeHtml(team.player1_name || "")}"
          placeholder="Giocatore 1"
        >

        <input
          id="edit-team-player2"
          type="text"
          value="${escapeHtml(team.player2_name || "")}"
          placeholder="Giocatore 2"
        >

      </div>

      <div style="margin-top:20px">

        <button
          class="primary"
          id="update-team"
        >
          Salva modifiche
        </button>

        <button
          id="cancel-edit-team"
          style="
            margin-left:8px;
            padding:11px 16px;
            border:0;
            border-radius:9px;
            cursor:pointer;
          "
        >
          Annulla
        </button>

      </div>

      <p id="edit-team-message"></p>

    </div>
  `;

  document
    .getElementById("update-team")
    .addEventListener(
      "click",
      function() {

        updateTeam(
          teamId,
          tournamentId
        );

      }
    );

  document
    .getElementById("cancel-edit-team")
    .addEventListener(
      "click",
      function() {

        openTournamentManager(
          tournamentId
        );

      }
    );

}


async function updateTeam(
  teamId,
  tournamentId
) {

  const name =
    document
      .getElementById("edit-team-name")
      .value
      .trim();

  const player1 =
    document
      .getElementById("edit-team-player1")
      .value
      .trim();

  const player2 =
    document
      .getElementById("edit-team-player2")
      .value
      .trim();

  const message =
    document.getElementById(
      "edit-team-message"
    );

  if (!name || !player1 || !player2) {

    message.textContent =
      "Inserisci nome formazione e i due giocatori.";

    return;
  }

  message.textContent =
    "Salvataggio modifiche...";

  const { error } =
    await supabaseClient
      .from("tournament_teams")
      .update({

        name: name,

        player1_name:
          player1,

        player2_name:
          player2

      })
      .eq("id", teamId);

  if (error) {

    console.error(error);

    message.textContent =
      "Errore durante il salvataggio.";

    return;
  }

  openTournamentManager(
    tournamentId
  );

}


async function deleteTeam(
  teamId,
  tournamentId
) {

  const confirmed =
    confirm(
      "Vuoi davvero eliminare questa formazione?"
    );

  if (!confirmed) {
    return;
  }

  const { error } =
    await supabaseClient
      .from("tournament_teams")
      .delete()
      .eq("id", teamId);

  if (error) {

    console.error(error);

    alert(
      "Errore durante l'eliminazione."
    );

    return;
  }

  openTournamentManager(
    tournamentId
  );

}
