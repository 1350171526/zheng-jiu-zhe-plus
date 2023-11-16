<script setup>
import {getHomeApi} from '@/apis/video'
import VideoItem from './components/VideoItem.vue'
import { onMounted, ref } from 'vue'

onMounted(()=>{
  getHome()
})

const listArr = ref([])
const heightArr = ref([])
const getHome =async () =>{
  const res = await getHomeApi()
  listArr.value = res.data.vedioArr
  listArr.value.forEach(()=>{
    heightArr.value.push(Math.floor(Math.random() * (450 - 200 + 1)) + 200)
  })
}

</script>

<template>
  <div class="main">
    <div class="box" v-if="listArr">
      <div class="item" v-for="(item,index) in listArr" :key="index">
        <VideoItem :item="item" :height="heightArr[index]"></VideoItem>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    .box{
      column-count: auto; // 定义列数自动
      column-gap: 20px; // 列与列的距离为20px
      column-width: 270px;
      .item{
        text-align: center;
        border-radius: 16px;
        grid-row-start: auto;
        margin-bottom: 20px;
        break-inside: avoid; // 不被截断
    }
    }
    
  }

</style>
