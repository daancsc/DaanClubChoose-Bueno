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
        <v-btn primary block class="blue" :disabled="check" @click="submit">送出</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      add: null,
      list: [
        {
          id: 1,
          name: '木棉手札精進班'
        },
        {
          id: 2,
          name: '法語班'
        },
        {
          id: 3,
          name: '德語班'
        },
        {
          id: 4,
          name: '日文班'
        },
        {
          id: 5,
          name: '棒球班'
        },
        {
          id: 6,
          name: '籃球班'
        },
        {
          id: 7,
          name: '德語班'
        },
        {
          id: 8,
          name: '日文班'
        },
        {
          id: 9,
          name: '棒球班'
        },
        {
          id: 10,
          name: '籃球班'
        },
        {
          id: 11,
          name: '德語班'
        },
        {
          id: 12,
          name: '日文班'
        },
        {
          id: 13,
          name: '棒球班'
        },
        {
          id: 14,
          name: '籃球班'
        }
      ],
      choose: [],
      selectId: 0,
      opti1: 0,
      optiBody1: [],
      opti2: 0,
      optiBody2: []
    }
  },
  computed: {
    noChoose: function () {
      var self = this
      return this.list.filter((element) => {
        return self.choose.indexOf(element) === -1
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
    submit () {
      this.$router.replace('result')
    }
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

