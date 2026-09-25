const SUPABASE_URL = "https://qrsvakoflmuertillpod.supabase.co";
const SUPABASE_KEY = "sb_publishable_xMBIXZPhX7mkSIMfQT3HBA_sPnhjFb9";

let supabaseClient = null;

const sections = [
  "dashboard",
  "players",
  "courts",
  "bookings",
  "payments",
  "tournaments"
];

async function init() {
  try {
    const script = document.createElement("script");

    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

    script.onload = async () => {
      supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

      document.getElementById("status").textContent =
        "Connessione a Supabase riuscita.";

      await loadDashboard();
    };

    script.onerror = () => {
      document.getElementById("status").textContent =
        "Errore nel caricamento di Supabase.";
    };

    document.head.appendChild(script);

  } catch (error) {
    console.error(error);

    document.getElementById("status").textContent =
      "Errore di connessione.";
  }
}

function setupNavigation() {
  const buttons = document.querySelectorAll(".nav");

  buttons.forEach(button => {
    button.addEventListener("click", () => {

      const sectionId = button.dataset.section;

      document.querySelectorAll(".nav").forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
      });

      document.getElementById(sectionId).classList.add("active");

      const title = button.textContent.trim();

      document.getElementById("page-title").textContent = title;
    });
  });
}

async function countRows(tableName) {
  const { count, error } = await supabaseClient
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

  if (!supabaseClient) {
    return;
  }

  const players = await countRows("players");
  const courts = await countRows("courts");
  const bookings = await countRows("bookings");
  const tournaments = await countRows("tournaments");

  document.getElementById("players-count").textContent = players;
  document.getElementById("courts-count").textContent = courts;
  document.getElementById("bookings-count").textContent = bookings;
  document.getElementById("tournaments-count").textContent = tournaments;
}

async function logout() {

  if (!supabaseClient) {
    return;
  }

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Errore durante l'uscita.");
    console.error(error);
    return;
  }

  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {

  setupNavigation();

  document
    .getElementById("logout-btn")
    .addEventListener("click", logout);

  init();

});
