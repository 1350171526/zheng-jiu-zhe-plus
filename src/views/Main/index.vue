<script setup>
import Avatar from './components/Avatar.vue'
import Collect from './components/Collect.vue'
import Comment from './components/Comment.vue'
import Like from './components/Like.vue'
import Share from './components/Share.vue'
import More from './components/More.vue'

import { getVedioApi } from '@/apis/video';
import {videoTypeStore} from '@/stores/videoTypeStore.js'
const videoType = videoTypeStore()
import { onMounted, ref, onBeforeUnmount, provide  } from "vue"
onMounted(()=>{
  videoType.getVedio(videoType.type)
  findvideocover()
  keyListen()
})
// 页面卸载钱移除监听事件
onBeforeUnmount(() => {
  document.removeEventListener('keydown', changeVideo);
})

// 全局键盘上下键监听事件
const keyListen = () =>{
  document.addEventListener('keydown', changeVideo);
}
const changeVideo = (e) =>{
  if(e.key == "ArrowUp"){
      lastVedio()
  }
  if(e.key == "ArrowDown"){
    nextVedio()
  }
}
let change = ref(false)
// 下一个视频
let nextTigger = 0
provide('change',change)
const nextVedio =async () =>{
  // 节流防止频繁触发事件
  const now = Date.now()
  if(now - nextTigger<1000){
    return 
  }else if(videoType.index<videoType.urlArr.length-2){
    change.value = !change.value
    videoType.index++
  }else{
    change.value = !change.value
    // 判断视频的分类
    const res = await getVedioApi(videoType.type)
    videoType.urlArr = [...videoType.urlArr,...res.data.vedioArr]
    videoType.index++
  }
  nextTigger = now
}
// 上一个视频
let lastTigger = 0
const lastVedio = () =>{
  // 节流防止频繁触发事件
  let now = Date.now()
  if(now - lastTigger<1000){
    return
  }else if(videoType.index>0){
    change.value = !change.value
    videoType.index--
  }else{
    ElMessage({
      message: '已经是第一条视频',
      type: 'success',
      center: true,
    })
  }
  lastTigger = now
}


// 鼠标滚轮事件
const mousewheel = (e) =>{
  if(e.deltaY>0){
    nextVedio()
  }else if(e.deltaY<0){
    lastVedio()
  }
}
// canvas绘制视频第一帧作为视频空白区域背景
const findvideocover = () =>{
    const  video = document.getElementById("upvideo"); 
    var canvas = document.getElementById('mycanvas') 
    const ctx = canvas.getContext('2d'); 
    video.crossOrigin = 'anonymous' 
    video.currentTime = 1 // 第一帧
    video.oncanplay = () => {
    canvas.width = video.clientWidth ; // 获取视频宽度
    canvas.height = video.clientHeight ; //获取视频高度
    // 利用canvas对象方法绘图
    ctx.drawImage(video, 0, 0, video.clientWidth,video.clientHeight)
  }
}

// 鼠标双击点赞
let timer = null
let changeLike = ref(false)
const like = () =>{
  clearTimeout(timer);
  changeLike.value = !changeLike.value
}

const video = ref(null)
// 控制视频播放和暂停
const isplay = () =>{
  clearTimeout(timer); //清除未执行的定时器
  timer = setTimeout(function () {
    if(video.value.paused){
      video.value.play()
    }else{
      video.value.pause()
    }
  }, 400);
}
</script>

<template>
  <div class="main">
    <!-- 视频区域 -->
    <div class="video" @mousewheel="mousewheel">
      <!-- 预加载前一个视频 -->
      <div class="left">
        <video 
          playsinline="true"
          :src="videoType.urlArr[videoType.index-1]" 
          controls="controls" 
          type="video/mp4"
          preload
          muted
          controlsList="nodownload  noremoteplayback noplaybackrate" 
          disablePictureInPicture="true"
          v-if="videoType.urlArr"
        ></video>
      </div>
      <!-- 当前视频 -->
      <div class="left">
        <video 
          ref="video"
          id="upvideo"
          playsinline="true"
          :src="videoType.urlArr[videoType.index]" 
          controls="controls" 
          type="video/mp4"
          loop
          autoplay="autoplay"
          muted
          controlsList="nodownload  noremoteplayback noplaybackrate" 
          disablePictureInPicture="true"
        ></video>
        <div class="list">
          <div><Avatar/></div>
          <div><Like :changeLike ="changeLike" ></Like></div>
          <div><Comment/></div>
          <div><Collect/></div>
          <div><Share/></div>
          <div><More/></div>
        </div>
        <canvas id='mycanvas'></canvas>
        <div class="layer" @dblclick="like" @click="isplay"></div>
      </div>
      <!-- 预加载后一个视频 -->
      <div class="left">
        <video 
          preload
          playsinline="true"
          :src="videoType.urlArr[videoType.index+1]" 
          controls="controls" 
          type="video/mp4"
          muted
          controlsList="nodownload  noremoteplayback noplaybackrate" 
          disablePictureInPicture="true"
          v-if="videoType.urlArr"
        ></video>
      </div>
    </div>
    <!-- 右侧按钮 -->
    <div class="right">
      <span class="iconfont icon-jiantoushang" @click="lastVedio()"></span>
      <span class="iconfont icon-jiantouxia" @click="nextVedio()"></span>

    </div>
  </div>
</template>

<style lang="scss" scoped>
  @media screen and (max-width :375px){
    .main{
      .video{
        width: 100% !important;
        height: 100vh - 6vh !important;
      }
      .right{
        display: none;
      }
    }  
}
@media screen and (max-width :876px){
    .main{
      .video{
        .left{
          &:nth-child(2){
            .list{
              display: none;
            }
          }
        }
      }
    }  
}


.main{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  .video{
    display: flex;
    flex-direction: column;
    width: 95%;
    height: 100%;
    .left{
      position: relative;
      border-radius: 20px;
      border: none;
      background-color: rgba(0, 0, 0, 0.3); 
      overflow: hidden;
      .layer{
      content: '';
      position: absolute;
      width: 100%;
      height: 90%;
      z-index: 100;
    }
      &:nth-child(2){
        height: 100%;
        width: 100%;
      }
    .list{
      height: 60%;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-right: 30px;
      right: 0;
      top: 25%;
      transform: translateX(-50%);
      z-index: 101;

    }
    video{
      position: absolute;
      width: 100%;  
      height: 100%;  
      z-index: 99;
      object-fit: contain; 
    }
    canvas{
      width: 200%;
      height: 200%;
      position: absolute;
      left: -50%;
      top: -50%;
      filter: blur(40px);
    }
    video:focus { //取消视频边框外部出现白线
    outline: -webkit-focus-ring-color auto 0px;
    }
    video::-webkit-media-controls-timeline {
        width: 100%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%); 
        // margin: 0 auto;
        margin-bottom: 30px;
      }



    // 所有控件
    video::-webkit-media-controls {  
      border-radius: 20px;
      }
    
    } 
  }


  }
  .right{
    height: 100px;
    width: 50px;
    border-radius: 25px;
    background-color: rgba(0, 0, 0, 0.6);
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: #8F8F95;
    cursor: pointer;
    &:hover{
      color: #cec8c8;
      background-color: rgba(0, 0, 0, 0.8);
    }
    span{
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover{
        color: #fff;
      }
    }
}


</style>
