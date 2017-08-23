<template>
  <div id="choose">
    <v-card>
      <v-card-title><h2 class="mb-0">選擇志願</h2></v-card-title>
      <v-card-text class="pt-0">
        <v-divider class="mb-4"></v-divider>
        <h4>1. 選擇課程，加入下列清單！</h4>
        <v-layout class="ma-0">
          <v-select :items="noChoose" v-model="add" label="Select" item-text="name" item-value="id" return-object></v-select>
          <v-btn class="blue" dark @click="addClass">
            <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
        <v-divider class="mb-4"></v-divider>
        <h4>2. 點選課程，使用按鈕移動志願序</h4>
        <p class="red--text">{{ (choose.length < 10)?"請填滿 10 個志願":"" }}</p>
        <p class="red--text">{{ (!limit)?"必須填寫 跨群科體驗課程":"" }}</p>
        <v-layout class="ma-0" wrap row>
          <v-flex xs12 sm10>
            <ul>
              <li v-for="(item,index) in choose" :key="item.id" @click="select(item.id)" :class="{select: item.id===selectId}">{{ "第 "+(index+1)+" 志願："+item.name }}</li>
            </ul>
          </v-flex>
          <v-flex xs12 sm2>
            <v-btn class="blue" dark block @click.native="up">
              <v-icon>arrow_upward</v-icon>
            </v-btn>
            <v-btn class="blue" dark block @click.native="down">
              <v-icon>arrow_downward</v-icon>
            </v-btn>
            <v-btn class="blue" dark block @click.native="del">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider class="mb-4 mt-4"></v-divider>
        <h4>3.（選填）選擇想要繳交的佐證資料的課</h4>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-select :items="optitem" v-model="opti1" label="Select" item-text="name" item-value="id"></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-layout>
              <v-checkbox label="得獎經歷" v-model="optiBody1" value="得獎經歷"></v-checkbox>
              <v-checkbox label="校隊經驗" v-model="optiBody1" value="校隊經驗"></v-checkbox>
            </v-layout>
            <v-layout>
              <v-checkbox label="學習經驗" v-model="optiBody1" value="學習經驗"></v-checkbox>
              <v-checkbox label="其他" v-model="optiBody1" value="其他"></v-checkbox>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-select :items="optitem" v-model="opti2" label="Select" item-text="name" item-value="id"></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-layout>
              <v-checkbox label="得獎經歷" v-model="optiBody2" value="得獎經歷"></v-checkbox>
              <v-checkbox label="校隊經驗" v-model="optiBody2" value="校隊經驗"></v-checkbox>
            </v-layout>
            <v-layout>
              <v-checkbox label="學習經驗" v-model="optiBody2" value="學習經驗"></v-checkbox>
              <v-checkbox label="其他" v-model="optiBody2" value="其他"></v-checkbox>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-divider class="mb-4 mt-4"></v-divider>
        <h4>4.送出志願</h4>
        <v-btn primary block class="blue" :disabled="check" @click="submit" :loading="network">送出</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import api from '../model/api'
export default {
  data () {
    return {
      add: null,
      list: [],
      choose: [],
      selectId: 0,
      opti1: 0,
      optiBody1: [],
      opti2: 0,
      optiBody2: [],
      network: false
    }
  },
  computed: {
    noChoose: function () {
      var self = this
      return this.list.filter((element) => {
        var result = true
        for (var i = 0; i < self.choose.length; i++) {
          if (self.choose[i].id === element.id) {
            result = false
            break
          }
        }
        return result
      })
    },
    check: function () {
      var result = false
      if (this.choose.length < 10) {
        result = true
      }
      if (this.opti1 !== 0) {
        if (this.optiBody1.length === 0) {
          result = true
        }
      }
      if (this.opti2 !== 0) {
        if (this.optiBody2.length === 0) {
          result = true
        }
      }
      return (result || !this.limit)
    },
    limit: function () {
      var result = false
      for (var i = 0; i < this.choose.length; i++) {
        if (this.choose[i].id === 1) {
          result = true
          break
        }
      }
      return result
    },
    optitem: function () {
      if (this.choose.length !== 0) {
        var result = this.choose.slice()
        result.splice(0, 0, {id: 0, name: ''})
        return result
      } else {
        return []
      }
    }
  },
  methods: {
    addClass () {
      if (this.add !== null) {
        if (this.choose.indexOf(this.add) === -1) {
          this.choose.push(this.add)
        }
      }
    },
    select (id) {
      this.selectId = id
    },
    up () {
      var index = 0
      for (var i = 0; i < this.choose.length; i++) {
        if (this.choose[i].id === this.selectId) {
          index = i
          break
        }
      }
      if (index > 0) {
        var temp = this.choose[index - 1]
        this.$set(this.choose, index - 1, this.choose[index])
        this.$set(this.choose, index, temp)
      }
    },
    down () {
      var index = 0
      for (var i = 0; i < this.choose.length; i++) {
        if (this.choose[i].id === this.selectId) {
          index = i
          break
        }
      }
      if (index < this.choose.length - 1) {
        var temp = this.choose[index + 1]
        this.$set(this.choose, index + 1, this.choose[index])
        this.$set(this.choose, index, temp)
      }
    },
    del () {
      var index = -1
      for (var i = 0; i < this.choose.length; i++) {
        if (this.choose[i].id === this.selectId) {
          index = i
          break
        }
      }
      if (index !== -1) {
        this.choose.splice(index, 1)
      }
    },
    submit () {
      var self = this
      for (var i = 0; i < self.choose.length; i++) {
        delete self.choose[i].more
      }
      for (i = 0; i < self.choose.length; i++) {
        if (self.opti1 === self.choose[i].id) {
          self.choose[i].more = self.optiBody1
        }
        if (self.opti2 === self.choose[i].id) {
          self.choose[i].more = self.optiBody2
        }
      }
      self.network = true
      api.setChoose(window.localStorage.getItem('token'), self.choose).then(function (res) {
        self.network = false
        alert('儲存成功')
        self.$router.replace('result')
      })
    }
  },
  beforeMount () {
    var self = this
    self.network = true
    api.getClubs(window.localStorage.getItem('token')).then(function (res) {
      self.list = res.data
      self.network = false
    }).catch(function (error) {
      console.log(error)
      alert('發生錯誤')
      self.$router.replace('/')
    })
    api.getStatus(window.localStorage.getItem('token')).then(function (res) {
      self.$emit('login', res.data.name)
      self.choose = res.data.choose
      var times = 1
      for (var i = 0; i < self.choose.length; i++) {
        if (self.choose[i].more !== undefined) {
          self['opti' + times] = self.choose[i].id
          self['optiBody' + times] = self.choose[i].more
          times++
        }
      }
      self.network = false
    }).catch(function (error) {
      console.log(error)
      alert('發生錯誤')
      self.$router.replace('/')
    })
  }
}
</script>

<style lang="stylus" scoped>
#choose
  ul
    border: 1px solid grey
    padding: 0
    li
      list-style-type: none
      padding: 0.5rem
      &:hover
        cursor: crosshair
      &.select
        background-color: #4286f4
        color: white

</style>

