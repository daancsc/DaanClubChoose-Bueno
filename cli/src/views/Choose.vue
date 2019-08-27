<template>
  <v-container>
    <v-layout
      justify-center
      wrap
    >
      <v-flex xs12 sm12 md4 class="pa-2">
        <v-card>
          <v-card-title>{{stu.class}} {{stu.name}}</v-card-title>
          <v-card-text><br>
            <a target="_blank" rel="noopener noreferrer" href="/choosev3/allClass.pdf">課程總覽</a><br>
            系統開放時間： 8/23(五) 09:00 ~ 8/28(三) 12:00 <br>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="logout">登出</v-btn>
          </v-card-actions>
        </v-card>
        <br>
        <v-card v-if="result.name!=''">
          <v-card-title class="title">選修課程結果： {{result.name}}</v-card-title>
          <v-card-text>
            老師： {{result.teacher}}<br>
            地點： {{result.location}}<br>
            備註： {{result.others}}<br>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md8 class="pa-2">
        <v-card>
          <v-card-title>選擇志願</v-card-title>
          <v-card-text>
            <v-alert
              border="bottom"
              colored-border
              :type="status.type"
              elevation="2"
              v-if="status.show"
            >
              {{status.msg}}
            </v-alert>
            <div v-for="(item, index) in alreadyChosen" :key="index" @click="openSelectDialog(index)">
              <v-overflow-btn
                :items="[]"
                :label="`第 ${index+1} 志願 - ${alreadyChosen[index].name}`"
                readonly
                target="#dropdown-example-1"
                :disabled="disableSystem"
              ></v-overflow-btn>
            </div>
            <v-btn class="mr-4" @click="submit" color="primary" :disabled="disableSystem">儲存志願</v-btn>
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
              <div class="">
                <v-radio
                  label="未選擇"
                  color="orange darken-3"
                  value="-1"
                ></v-radio>
                <br>
              </div>
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
    <br>
    <v-footer class="text-center pa-0 ma-0">
      <v-card
        flat
        tile
        color="#fafafa"
        width="100vw"
        class="text-center"
      >
        <v-card-text class="orange--text">
          {{ new Date().getFullYear() }} - <a target="_blank" rel="noopener noreferrer" href="https://dacsc.club" class="orange--text"><strong>DAAN Computer Study Club</strong></a>
        </v-card-text>
      </v-card>
    </v-footer>
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
    nowSelect: 0,
    noFullError: false,
    disableSystem: false,
    status: {
      msg: '',
      type: '',
      show: false
    },
    stu: {
      name: '',
      class: ''
    },
    result: {
      name: '',
      teacher: '',
      location: '',
      others: ''
    }
  }),
  beforeMount() {
    let self = this
    let today = new Date();
    let d = today.getDate()
    let h = today.getHours()
    let m = today.getMonth() + 1
    let yyyy = today.getFullYear()
    self.disableSystem = false
    if (yyyy>=2019&&m>=8&&d>=28&&h>=12) {
      self.disableSystem = true
    }
    api.getClubs(window.localStorage.getItem('token')).then((res) => {
      self.allChoose = res.data
      res.data.forEach(i=>{
        self.avaiableChoose.push({
          name: i.name,
          id: i.id,
          reject: i.reject,
          selected: -1
        })
      })
      api.getStatus(window.localStorage.getItem('token')).then((res) => {
        let stuClass = res.data.class[0]+res.data.class[1]
        self.stu = {
          name: res.data.name,
          class: res.data.class
        }
        let result = res.data.result
        if (result) {
          //self.setResult(res.data.result)
        }
        if (res.data.choose.length!=0) {
          self.alreadyChosen = res.data.choose
          let index = 0
          self.alreadyChosen.forEach(i=>{
            self.avaiableChoose[i.id-1].selected = index
            index++
          })
        } else {
          self.init()
        }
        self.avaiableChoose.forEach(i=>{
          if (i.reject!=null) {
            i.reject.split(',').forEach(j=>{
              if (j==stuClass) {
                i.selected = 100
              }
            })
          }
        })
        self.$emit('login', res.data.name)
        if (self.result.name == '') {
          self.disabled = true
        }
      }).catch((error) => {
        window.console.log(error)
        self.showMsg('error', `發生錯誤`)
        self.$router.replace('/')
      })
    }).catch((error) => {
      window.console.log(error)
      self.showMsg('error', `發生錯誤`)
      self.$router.replace('/')
    })
  },
  methods: {
    init: function () {
      for (let i = 0; i < this.maxChoose; i++) {
        this.alreadyChosen.push({id: -1, name: '未選擇'})
      }
    },
    setResult: function (id) {
      api.getClubInfo(id ,window.localStorage.getItem('token')).then((res) => {
        this.result = res.data
        this.result.others = this.result.others!='' ? this.result.others : '無'
      })
      this.disableSystem = true
    },
    openSelectDialog: function (index) {
      this.tempSelect=this.alreadyChosen[index].id
      this.nowSelect=index
      //if has result then disabled button
      this.dialog=!this.disableSystem
    },
    saveChoose: function (index, id) {
      if (id==-1) {
        //no choose
        this.alreadyChosen[index].id = -1
        this.alreadyChosen[index].name = '未選擇'
      } else {
        //put choose in alreadyChosen
        this.alreadyChosen[index].id = id
        this.alreadyChosen[index].name = this.allChoose[id-1].name
        this.avaiableChoose[id-1].selected = index
      }
      //clean old choose
      this.avaiableChoose.forEach(i=>{
        if (i.selected==index&&i.id!=id) {
          i.selected = -1
        }
      })

      this.tempSelect = null
      this.nowSelect = 0
      this.dialog = false
    },
    showMsg: function (type, msg) {
      this.status = {
        type: type,
        msg: msg,
        show: true
      }
      this.$vuetify.goTo(0, 'easeInOutCubic')
    },
    submit: function () {
      let self = this
      self.noFullError = false
      this.alreadyChosen.forEach(i=>{
        if (i.id==-1) {
          self.noFullError = true
          self.showMsg('warning', `需要填滿 ${self.maxChoose} 個志願！`)
          return
        }
      })
      if (self.noFullError) {
        return
      }
      api.setChoose(window.localStorage.getItem('token'), self.alreadyChosen).then((res) => {
        if (res.data.status) {
          self.showMsg('success', `儲存成功！`)
        } else {
          self.showMsg('error', `發生錯誤`)
        }
      })
    },
    logout: function () {
      window.localStorage.removeItem('token')
      this.$router.replace('/')
      this.name = ''
    }
  }
}
</script>
