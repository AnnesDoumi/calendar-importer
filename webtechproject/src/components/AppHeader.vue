<template>
  <header class="app-header">
    <h1>LandingPage</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/impressum">Impressum</router-link>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #000;
  color: #fff;
}

.app-header h1 {
  color: #00ff00;
}

.app-header nav {
  display: flex;
}

.app-header nav a {
  color: #fff;
  text-decoration: none;
  margin-left: 20px;
  font-weight: bold;
}

.app-header nav a:hover {
  color: #00ff00;
}
</style>
