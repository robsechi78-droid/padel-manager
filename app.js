const SUPABASE_URL = "https://qrsvakoflmuertillpod.supabase.co";
const SUPABASE_KEY = "INSERIREMO_LA_CHIAVE_PUBBLICA";

let supabaseClient;

async function init() {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  script.onload = () => {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    document.getElementById("status").textContent =
      "Connessione pronta";
  };

  script.onerror = () => {
    document.getElementById("status").textContent =
      "Errore di connessione";
  };

  document.head.appendChild(script);
}

init();
