<template>
  <v-app>
    <v-app-bar app class="orange accent-3" style="color: white">
      <v-toolbar-title class="headline text-uppercase">
        <b>大安高工綜合活動選課系統</b>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="white">
        <span class="mr-2" @click="logout">{{name}}</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <br>
      <router-view @login="display"></router-view>
    </v-content>
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
      this.name = `你好 ${name} 登出`
    },
    logout: function () {
      window.localStorage.removeItem('token')
      this.$router.replace('/')
      this.name = ''
    }
  }
}
</script>
