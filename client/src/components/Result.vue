<template>
  <div id="result">
    <v-layout>
      <v-flex sm6 offset-xs3 xs12>
        <v-card>
          <v-card-text class="pt-0">
            <v-divider class="mb-4"></v-divider>
            <h4 style="text-align:center;">你好 {{name}} ，以下是你選的的志願。<br>你已完成志願填寫，如需修改請按修改按鈕！</h4>
            <v-layout class="ma-0">
              <ul>
                <li v-for="(item,index) in choose" :key="item.id">{{ "第 "+(index+1)+" 志願："+item.name }}</li>
              </ul>
            </v-layout>
            <v-btn primary block class="red" @click.native.stop="modify">修改</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import api from '../model/api'
export default {
  data () {
    return {
      name: '',
      choose: []
    }
  },
  beforeMount () {
    var self = this
    api.getStatus(window.localStorage.getItem('token')).then(function (res) {
      self.$emit('login', res.data.name)
      self.name = res.data.name
      self.choose = res.data.choose
    })
  },
  methods: {
    modify () {
      this.$router.replace('choose')
    }
  }
}
</script>

<style lang="stylus" scoped>
#result
  ul
    width: 100%
    border: 1px solid grey
    padding: 0
    li
      list-style-type: none
      padding: 0.5rem

</style>
