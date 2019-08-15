<template>
  <v-container>
    <v-layout
      text-center
      wrap
      justify-center
    >
      <v-flex xs12 md4>

        <v-card>
          <v-card-title>學生登入</v-card-title>
          <v-card-text>
            <v-alert v-if="isError" type="error">
              {{errorMsg}}
            </v-alert>
            <form>
              <v-text-field
                v-model="id"
                label="學號"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="身份證字號後四碼"
                required
              ></v-text-field>
              <v-btn class="mr-4" @click="submit">登入</v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../api'
export default {
  data: () => ({
    id: '',
    password: '',
    isError: false,
    errorMsg: ''
  }),
  methods: {
    submit () {
      let self = this
      api.login(self.id, self.password).then(function (res) {
        if (res.data.status) {
          window.localStorage.setItem('token', res.data.token)
        }
        api.getStatus(window.localStorage.getItem('token')).then(function (res) {
          self.$emit('login', res.data.name)
          if (res.data.choose.length > 0) {
            self.$router.replace('choose')
          }
        }).catch(function (error) {
          self.errorMsg = "學號或身份證字號後四碼錯誤"
          self.isError = true
          window.console.log(error)
          self.$router.replace('/')
        })
      }).catch(function (error) {
        self.errorMsg = "學號或身份證字號後四碼錯誤"
        self.isError = true
        window.console.log(error)
      })
    }
  }
}
</script>
