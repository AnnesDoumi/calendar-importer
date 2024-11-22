<template>
  <div id="app">
    <!-- Navigation Links -->
    <nav>
      <router-link to="/">Home</router-link>
      |
      <button @click="authenticateGoogle">Authenticate with Google</button>
      <router-link to="/privacy-policy">Datenschutzbestimmungen</router-link>
      <router-link to="terms-of-use">Nutzungsbestimmungen</router-link>
    </nav>

    <!-- Hier wird die aktuelle Route geladen -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',

  methods: {
    authenticateGoogle() {
      window.location.href = `${process.env.VUE_APP_API_BASE_URL}/auth/google`;
    }
  }

};


</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

nav {
  background-color: #f3f3f3;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

nav a {
  color: #42b983;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #35495e;
}
</style>
