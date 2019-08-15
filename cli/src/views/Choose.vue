<template>
  <v-container>
    <v-layout
      text-center
      wrap
      justify-center
    >
      <v-flex xs12 md6>

        <v-card>
          <v-card-title>選擇志願</v-card-title>
          <v-card-text>
            <div v-for="(item, index) in alreadyChosen" :key="index">
              <v-overflow-btn
                :items="[]"
                :label="`第 ${index+1} 志願 ${alreadyChosen[index].name}`"
                readonly
                target="#dropdown-example-1"
                @click="openSelectDialog(index)"
              ></v-overflow-btn>
            </div>
            <v-btn class="mr-4" @click="submit">儲存志願</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog v-model="dialog" width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">選擇社團</span>
          </v-card-title>
          <v-card-text>
            <v-radio-group v-model="tempSelect" @change="saveChoose(nowSelect, tempSelect)">
            <div v-for="(item, index) in avaiableChoose" :key="index">
              <v-radio
                :label="item.name"
                color="orange darken-3"
                :value="item.id"
                :disabled="item.selected!=-1&&item.selected!=nowSelect"
              ></v-radio>
              <br>
            </div>
            </v-radio-group>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../api'
export default {
  data: () => ({
    maxChoose: 15,
    alreadyChosen: [],
    avaiableChoose: [],
    allChoose: [],
    dialog: false,
    tempSelect: 0,
    nowSelect: 0
  }),
  beforeMount() {
    let self = this
    api.getClubs(window.localStorage.getItem('token')).then(function (res) {
      self.allChoose = res.data
      res.data.forEach(i=>{
        self.avaiableChoose.push({
          name: i.name,
          id: i.id,
          selected: -1
        })
      })
      self.init()
    }).catch(function (error) {
      window.console.log(error)
      alert('發生錯誤')
      self.$router.replace('/')
    })
    api.getStatus(window.localStorage.getItem('token')).then(function (res) {
      if (res.data.choose.length!=0) {
        self.alreadyChosen = res.data.choose
        let index = 0
        self.alreadyChosen.forEach(i=>{
          self.avaiableChoose[i.id-1].selected = index
          index++
        })
      }
      self.$emit('login', res.data.name)
    }).catch(function (error) {
      window.console.log(error)
      self.$router.replace('/')
    })
  },
  methods: {
    init: function () {
      for (let i = 0; i < this.maxChoose; i++) {
        this.alreadyChosen.push({id: -1, name: ''})
      }
    },
    openSelectDialog: function (index) {
      this.tempSelect=this.alreadyChosen[index].id
      this.nowSelect=index
      this.dialog=true
    },
    saveChoose: function (index, id) {
      //put choose in alreadyChosen
      this.alreadyChosen[index].id = id
      this.alreadyChosen[index].name = this.allChoose[id-1].name

      this.tempSelect = null
      this.nowSelect = 0
      this.dialog = false

      this.avaiableChoose[id-1].selected = index
      this.avaiableChoose.forEach(i=>{
        if (i.selected==index&&i.id!=id) {
          i.selected = -1
        }
      })
      window.console.log(this.alreadyChosen)
    },
    submit: function () {
      let self = this
      api.setChoose(window.localStorage.getItem('token'), self.alreadyChosen).then(function (res) {
        alert('儲存成功')
      })
    }
  }
}
</script>
