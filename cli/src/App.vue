<template>
  <v-app>
    <v-app-bar app class="orange accent-3" style="color: white">
      <v-toolbar-title class="headline text-uppercase">
        <b>大安高工彈性學習選課系統</b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="white" v-if="false&&name!=''">
        <span class="mr-2">{{name}}</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <br>
      <router-view @login="display"></router-view>
    </v-content>
    <br>
    <br>
    <v-footer class="orange lighten-1 text-center pa-0 ma-0">
      <v-card
        flat
        tile
        width="100vw"
        class="orange lighten-1 text-center"
      >
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} - <a target="_blank" rel="noopener noreferrer" href="https://dacsc.club" class="white--text"><strong>DAAN Computer Study Club</strong></a>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    name: ''
  }),
  methods: {
    display: function (name) {
      this.name = `你好 ${name}`
    }
  }
}
</script>
<style>
  a {
   text-decoration: none;
  }
</style>
