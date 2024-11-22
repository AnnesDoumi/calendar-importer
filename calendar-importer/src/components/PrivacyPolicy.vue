<template>
  <div class="privacy-policy container my-5">
    <div class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Datenschutzerklärung</h1>
        <p class="lead">
          Der Schutz Ihrer persönlichen Daten ist mir wichtig. Ich behandle Ihre
          personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung. Hier erfahren Sie,
          wie ich personenbezogene Daten im Zusammenhang mit der Nutzung der Google API
          auf dieser Website erhebe und verwende.
        </p>

        <h2 class="mt-4">1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website bin ich, der
          Betreiber der Seite:
          <br />
          <strong>{{ ownerName }}</strong><br />
          Kontakt: <a :href="'mailto:' + contactEmail">{{ contactEmail }}</a>
        </p>

        <h2 class="mt-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>
          Bei der Nutzung dieser Website und der eingebundenen Funktionen der Google API
          können personenbezogene Daten erhoben und verarbeitet werden. Diese Daten werden
          genutzt, um Ihnen die angebotenen Dienste zur Verfügung zu stellen und die
          Website zu verbessern.
        </p>

        <h2 class="mt-4">3. Nutzung der Google API</h2>
        <p>
          Diese Website nutzt die Google API, insbesondere für die Integration des
          Google Kalenders. Durch die Nutzung dieser API können bestimmte Informationen
          an Google übermittelt werden.
        </p>

        <h2 class="mt-4">4. Art der erhobenen Daten</h2>
        <p>
          Je nach Nutzung und Interaktion mit der Google API können die folgenden Daten
          erhoben werden:
        </p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">IP-Adresse</li>
          <li class="list-group-item">Kalenderdaten (falls explizit von Ihnen importiert)</li>
          <li class="list-group-item">Nutzungsdaten (z. B. besuchte Seiten, angeklickte Links)</li>
          <li class="list-group-item">Geräteinformationen (z. B. Browsertyp, Betriebssystem)</li>
        </ul>
        <p class="mt-3">
          Die Erfassung dieser Daten erfolgt direkt durch Google und unterliegt deren
          Datenschutzrichtlinien. Weitere Informationen finden Sie unter:
          <a
              :href="googlePrivacyLink"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary"
          >Google-Datenschutzbestimmungen</a>.
        </p>

        <h2 class="mt-4">5. Zweck der Datenverarbeitung</h2>
        <p>
          Die Nutzung der Google API erfolgt, um Ihnen als Nutzer zusätzliche Funktionen
          wie den Google Kalender-Import zur Verfügung zu stellen. Die Datenverarbeitung
          erfolgt auf Grundlage meines berechtigten Interesses gemäß Art. 6 Abs. 1 lit. f
          DSGVO, die Website nutzerfreundlich und funktional zu gestalten.
        </p>

        <h2 class="mt-4">6. Übermittlung personenbezogener Daten an Google</h2>
        <p>
          Bei Nutzung der Google API können die erhobenen Daten an Google weitergegeben
          werden. Google verarbeitet diese Daten gemäß den eigenen
          Datenschutzbestimmungen, die Sie <a :href="googlePrivacyLink" target="_blank"
                                              rel="noopener noreferrer" class="text-primary">hier</a> nachlesen können.
        </p>

        <h2 class="mt-4">7. Speicherung und Löschung von Daten</h2>
        <p>
          Ich speichere keine persönlichen Daten.
          Die hochgeladenen Bilder werden nur einmalig ausgewertet.
          Einbindung von Google API / GROQ LLAMA API ist vorhanden, und weitere Handhabung der Daten werden durch ihre
          Datenschutzbestimmungen festgehalten.
        </p>

        <h2 class="mt-4">8. Ihre Rechte</h2>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Recht auf Auskunft über die Verarbeitung Ihrer Daten (Art. 15 DSGVO)</li>
          <li class="list-group-item">Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li class="list-group-item">Recht auf Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li class="list-group-item">Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li class="list-group-item">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li class="list-group-item">Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
        </ul>

        <h2 class="mt-4">9. Änderungen dieser Datenschutzerklärung</h2>
        <p>
          Diese Datenschutzerklärung kann gelegentlich aktualisiert werden, um
          gesetzlichen Anforderungen oder neuen Funktionen auf der Website zu
          entsprechen. Die jeweils aktuelle Version finden Sie auf dieser Seite.
        </p>

        <h2 class="mt-4">10. Kontakt</h2>
        <p>
          Für Fragen zum Datenschutz oder zur Geltendmachung Ihrer Rechte erreichen Sie
          mich unter:<br />
          <a :href="'mailto:' + contactEmail" class="btn btn-primary mt-2">{{ contactEmail }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  data() {
    return {
      ownerName: "Annes Bani Al Doumi",
      contactEmail: "doumi.annes@gmail.com",
      googlePrivacyLink: "https://policies.google.com/privacy"
    };
  }
};
</script>

<style scoped>
.privacy-policy {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border-radius: 0.5rem;
  border: none;
}

.card-title {
  font-size: 1.75rem;
}

.card-body {
  background-color: #f8f9fa;
}

.list-group-item {
  background-color: transparent;
  border: none;
  padding: 0.5rem 0;
}
</style>
