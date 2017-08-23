<template>
  <v-app light>
    <v-toolbar class="orange" dark>
      <v-icon class="white--text">cloud</v-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="name !== ''">
        <v-btn flat @click.native="logout">你好 {{ name }}! 登出</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container fluid>
        <transition name="slide" mode="out-in">
          <router-view @login="display"></router-view>
        </transition>
      </v-container>
    </main>
    <v-footer>
      <div style="width:100%;text-align:right;">&copy; 2017 <a href="https://dacsc.club" target="_blank">大安高工電腦研究社</a> 16th 網管 IU</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        title: '大安高工綜合活動選課系統',
        name: ''
      }
    },
    methods: {
      display (name) {
        this.name = name
      },
      logout () {
        window.localStorage.removeItem('token')
        this.$router.replace('/')
        this.name = ''
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'

  h2 
    font-size: 1.5rem
    text-align: center
    display: block
    width: 100%
    line-height: 1.5rem
  h4
    font-size: 1.2rem
    display: block
    width: 100%
    line-height: 1.2rem
</style>
