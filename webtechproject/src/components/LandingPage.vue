<template>
  <div class="landing-page" id="home">
    <section class="hero">
      <h2>Willkommen auf unserer Seite!</h2>
      <p>In Progress.</p>
      <button>Mehr erfahren</button>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #000;
  color: #fff;
}

.hero {
  text-align: center;
}

.hero h2 {
  color: #00ff00;
  font-size: 3em;
}

.hero p {
  color: #fff;
  font-size: 1.2em;
}

.hero button {
  padding: 10px 20px;
  background-color: #00ff00;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.hero button:hover {
  background-color: #fff;
  color: #00ff00;
}
</style>
