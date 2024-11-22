<template>
  <div class="terms-of-use container my-5">
    <div class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Nutzungsbedingungen</h1>
        <p class="lead">
          Willkommen auf meiner Website! Durch den Zugriff und die Nutzung dieser
          Website erklären Sie sich mit den folgenden Nutzungsbedingungen einverstanden. Bitte lesen Sie diese
          sorgfältig durch, bevor Sie unsere Dienste in Anspruch nehmen.
        </p>

        <h2 class="mt-4">1. Allgemeines</h2>
        <p>
          Diese Nutzungsbedingungen regeln die Nutzung unserer Website und der über sie
          angebotenen Dienste. Durch den Zugriff auf diese Website stimmen Sie zu, sich
          an diese Bedingungen zu halten.
        </p>

        <h2 class="mt-4">2. Nutzung der Google API und anderer externer Dienste</h2>
        <p>
          Diese Website verwendet die Google API, um Ihnen spezifische Funktionen wie den
          Import von Kalenderdaten bereitzustellen. Durch die Nutzung dieser Dienste
          erklären Sie sich mit den Nutzungsbedingungen von Google einverstanden, die Sie
          <a :href="googleTermsLink" target="_blank" rel="noopener noreferrer" class="text-primary">hier</a> einsehen können.
        </p>

        <h2 class="mt-4">3. Haftungsausschluss</h2>
        <p>
          Ich übernehme keine Verantwortung für direkte oder indirekte Schäden, die durch
          die Nutzung dieser Website oder der hier angebotenen Dienste entstehen könnten.
          Ich bemühe mich, die Website und die angebotenen Inhalte aktuell und
          korrekt zu halten, übernehme jedoch keine Gewähr für deren Richtigkeit,
          Vollständigkeit oder Aktualität.
        </p>

        <h2 class="mt-4">4. Benutzerverhalten</h2>
        <p>
          Sie verpflichten sich, die Website nur für legale Zwecke und in einer Weise zu
          nutzen, die keine Rechte anderer verletzt oder die Nutzung und den Betrieb der
          Website einschränkt. Es ist untersagt, die Website zu nutzen, um Inhalte zu
          verbreiten, die gegen geltendes Recht verstoßen oder die Rechte Dritter
          beeinträchtigen.
        </p>

        <h2 class="mt-4">5. Geistiges Eigentum</h2>
        <p>
          Die auf dieser Website bereitgestellten Inhalte, einschließlich Texte, Bilder und
          Software, sind, sofern nicht anders angegeben, mein geistiges Eigentum oder das
          geistige Eigentum meiner Partner. Sie dürfen ohne meine ausdrückliche Zustimmung
          nicht vervielfältigt, weitergegeben oder veröffentlicht werden.
        </p>

        <h2 class="mt-4">6. Änderungen der Nutzungsbedingungen</h2>
        <p>
          Ich behalte mir das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern.
          Änderungen treten mit der Veröffentlichung der aktualisierten Bedingungen auf der
          Website in Kraft. Bitte überprüfen Sie diese regelmäßig, um über mögliche
          Änderungen informiert zu bleiben.
        </p>

        <h2 class="mt-4">7. Beendigung der Nutzung</h2>
        <p>
          Ich behalte mir das Recht vor, Ihren Zugriff auf die Website und deren Dienste
          jederzeit und ohne Angabe von Gründen zu beenden, wenn gegen diese
          Nutzungsbedingungen verstoßen wird oder wenn ich dies aus rechtlichen oder
          betrieblichen Gründen für notwendig halte.
        </p>

        <h2 class="mt-4">8. Kontakt</h2>
        <p>
          Für Fragen oder Anmerkungen zu diesen Nutzungsbedingungen erreichen Sie mich
          unter:<br />
          <a :href="'mailto:' + contactEmail" class="btn btn-primary mt-2">{{ contactEmail }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TermsOfUse",
  data() {
    return {
      contactEmail: "doumi.annes@gmail.com",
      googleTermsLink: "https://policies.google.com/terms"
    };
  }
};
</script>

<style scoped>
.terms-of-use {
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
</style>
