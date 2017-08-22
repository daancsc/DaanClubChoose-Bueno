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
                <li v-for="(item,index) in choose" :key="item.id" @click="select(item.id)" :class="{select: item.id===selectId}">{{ "第 "+(index+1)+" 志願："+item.name }}</li>
              </ul>
            </v-layout>
            <v-btn primary block class="red" :disabled="check" @click="submit">修改</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      choose: [
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
        }
      ]
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
