<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Padel Manager</title>

  <link rel="stylesheet" href="style.css">
</head>

<body>

  <div class="app">

    <aside class="sidebar">

      <div class="brand">
        🎾 Padel Manager
      </div>

      <button class="nav active" data-section="dashboard">
        Dashboard
      </button>

      <button class="nav" data-section="players">
        Giocatori
      </button>

      <button class="nav" data-section="courts">
        Campi
      </button>

      <button class="nav" data-section="bookings">
        Prenotazioni
      </button>

      <button class="nav" data-section="payments">
        Pagamenti
      </button>

      <button class="nav" data-section="tournaments">
        Tornei
      </button>

    </aside>

    <main>

      <header>
        <div>
          <h1 id="page-title">Dashboard</h1>
          <p>Gestionale del centro padel</p>
        </div>

        <button class="primary" id="logout-btn">
          Esci
        </button>
      </header>

      <!-- DASHBOARD -->

      <section id="dashboard" class="section active">

        <div class="cards">

          <div class="card">
            <span>Giocatori</span>
            <strong id="players-count">0</strong>
          </div>

          <div class="card">
            <span>Campi</span>
            <strong id="courts-count">0</strong>
          </div>

          <div class="card">
            <span>Prenotazioni</span>
            <strong id="bookings-count">0</strong>
          </div>

          <div class="card">
            <span>Tornei</span>
            <strong id="tournaments-count">0</strong>
          </div>

        </div>

        <div class="panel">

          <div class="panel-head">
            <h2>Benvenuto</h2>
          </div>

          <p>
            Il tuo Padel Manager è online.
          </p>

          <p id="status">
            Connessione a Supabase in preparazione...
          </p>

        </div>

      </section>

      <!-- GIOCATORI -->

      <section id="players" class="section">

        <div class="panel">

          <div class="panel-head">
            <h2>Giocatori</h2>

            <button class="primary">
              + Nuovo giocatore
            </button>
          </div>

          <div id="players-content" class="empty">
            Nessun giocatore presente.
          </div>

        </div>

      </section>

      <!-- CAMPI -->

      <section id="courts" class="section">

        <div class="panel">

          <div class="panel-head">
            <h2>Campi</h2>

            <button class="primary">
              + Nuovo campo
            </button>
          </div>

          <div id="courts-content" class="empty">
            Nessun campo presente.
          </div>

        </div>

      </section>

      <!-- PRENOTAZIONI -->

      <section id="bookings" class="section">

        <div class="panel">

          <div class="panel-head">
            <h2>Prenotazioni</h2>

            <button class="primary">
              + Nuova prenotazione
            </button>
          </div>

          <div id="bookings-content" class="empty">
            Nessuna prenotazione presente.
          </div>

        </div>

      </section>

      <!-- PAGAMENTI -->

      <section id="payments" class="section">

        <div class="panel">

          <div class="panel-head">
            <h2>Pagamenti</h2>

            <button class="primary">
              + Nuovo pagamento
            </button>
          </div>

          <div id="payments-content" class="empty">
            Nessun pagamento presente.
          </div>

        </div>

      </section>

      <!-- TORNEI -->

      <section id="tournaments" class="section">

        <div class="panel">

          <div class="panel-head">
            <h2>Tornei</h2>

            <button class="primary">
              + Nuovo torneo
            </button>

          </div>

          <div id="tournaments-content" class="empty">
            Nessun torneo presente.
          </div>

        </div>

      </section>

    </main>

  </div>

  <script src="app.js"></script>

</body>
</html>
