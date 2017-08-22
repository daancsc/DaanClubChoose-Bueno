<template>
  <div class="hello">
    <v-layout row wrap>
      <v-flex sm8 xs12>
        <v-card>
          <v-card-title><h2 class="mb-0">大安高工106學年度高一綜合活動 選課說明</h2></v-card-title>
          <v-card-text class="pt-0">
            <iframe id="viewer" src="https://docs.google.com/viewer?hl=en&amp;embedded=true&amp;url=https://clubs.taivs.tp.edu.tw/choose/tmp/howto.pdf" style="width:100%;height:75vh;" scrolling="auto" allowfullscreen="" webkitallowfullscreen="" frameborder="0"></iframe>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex sm4 xs12>
        <v-card>
          <v-card-title><h2 class="ma-0">學生登入</h2></v-card-title>
          <v-alert info value="true" class="ma-2" v-if="disabled">系統未開放</v-alert>
          <v-card-text class="pt-0">
            <v-text-field id="account" name="account" label="請輸入學校系統帳號" v-model="account" :disabled="disabled" :autofocus="!disabled"></v-text-field>
            <v-text-field id="password" type="password" name="password" label="請輸入學校系統密碼" v-model="password"  :disabled="disabled"></v-text-field>
            <v-btn block primary :disabled="disabled" @click="login" :loading="dialog">登入</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="headline">使用者條款</v-card-title>
        <v-card-text class="text-xs-center">我已看完選課須知與課程總覽</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue" block secondary dark @click.native="dialog = false">完成</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      disabled: false,
      dialog: false,
      account: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.dialog = true
      this.$router.push('choose')
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
</style>
<style>
.input-group__details {
  min-height: 2px;
}
</style>

