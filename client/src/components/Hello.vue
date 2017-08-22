<template>
  <div class="hello">
    <v-layout row wrap>
      <v-flex sm8 xs12>
        <v-card>
          <v-card-title><h2 class="mb-0">大安高工106學年度高一綜合活動 選課說明</h2></v-card-title>
          <v-card-text class="pt-0">
            <iframe id="viewer" src="https://docs.google.com/viewer?hl=en&amp;embedded=true&amp;url=https://clubs.taivs.tp.edu.tw/choose/static/help.pdf" style="width:100%;height:75vh;" scrolling="auto" allowfullscreen="" webkitallowfullscreen="" frameborder="0"></iframe>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4 xs12>
        <v-card>
          <v-card-title><h2 class="ma-0">學生登入</h2></v-card-title>
          <v-alert info value="true" class="ma-2" v-if="disabled">系統未開放</v-alert>
          <v-alert error value="true" class="ma-2" v-if="error !== ''">{{ error }}</v-alert>
          <v-card-text class="pt-0">
            <v-divider class="mb-2"></v-divider>
            <v-text-field id="account" name="account" label="請輸入學校系統帳號" v-model="account" :disabled="disabled" :autofocus="!disabled"></v-text-field>
            <v-text-field id="password" type="password" name="password" label="請輸入學校系統密碼" v-model="password"  :disabled="disabled"></v-text-field>
            <v-btn block primary :disabled="disabled" @click="login" :loading="dialog">登入</v-btn>
            <v-divider class="mt-3"></v-divider>
            <a href="static/clubs.pdf">&gt;&gt;課程總覽&lt;&lt;</a>
            <a href="static/prove.docx">&gt;&gt;佐證資料&lt;&lt;</a>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">使用者條款</v-card-title>
        <v-card-text class="text-xs-center">我已看完<a href="static/help.pdf">選課須知</a>與<a href="static/clubs.pdf">課程總覽</a></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue" block primary @click.native="closeDig" :loading="!finishNet" :disabled="!finishNet">完成</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import api from '../model/api'
export default {
  name: 'hello',
  data () {
    return {
      disabled: false,
      dialog: false,
      finishNet: false,
      account: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login () {
      var self = this
      this.dialog = true
      api.login(this.account, this.password).then(function (res) {
        if (res.data.status) {
          self.finishNet = true
          window.localStorage.setItem('token', res.data.token)
        }
        api.getStatus(window.localStorage.getItem('token')).then(function (res) {
          self.$emit('login', res.data.name)
          if (res.data.choose.length > 0) {
            self.$router.replace('result')
          }
        }).catch(function (error) {
          this.dialog = false
          console.log(error)
          alert('發生錯誤')
          self.$router.replace('/')
        })
      }).catch(function (error) {
        console.log(error)
        self.dialog = false
        self.error = '帳號密碼輸入錯誤'
      })
    },
    closeDig () {
      this.dialog = false
      this.$router.replace('choose')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input-group {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
a {
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  font-size: 1.2rem;
}
</style>
<style>
.input-group__details {
  min-height: 2px;
}
</style>

