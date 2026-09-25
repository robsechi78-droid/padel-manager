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

          <p
            id="login-message"
            style="margin-top:15px;"
          ></p>

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

    });

  });

}


function setupButtons() {

  document.querySelectorAll(".primary").forEach(button => {

    if (button.textContent.includes("Nuovo giocatore")) {

      button.addEventListener("click", openPlayerForm);

    }

  });

}


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

    <table>

      <thead>

        <tr>

          <th>Nome</th>
          <th>Telefono</th>
          <th>Email</th>
          <th>Livello</th>

        </tr>

      </thead>

      <tbody>

  `;


  data.forEach(player => {

    html += `

      <tr>

        <td>
          ${player.first_name} ${player.last_name}
        </td>

        <td>
          ${player.phone || "-"}
        </td>

        <td>
          ${player.email || "-"}
        </td>

        <td>
          ${player.level || "-"}
        </td>

      </tr>

    `;

  });


  html += `

      </tbody>

    </table>

  `;


  container.innerHTML = html;

}


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
