<script setup>
defineProps({
  item: {
    type: String,
    default:''
  },
  height: {
    type: Number,
    default: 200
  }
})

// Math.floor(Math.random() * (450 - 200 + 1)) + 200; 
</script>

<template>
  <div class="video" :style="{ height: `${height}px`}">
    <video 
    :src="item"
    controls="controls" 
    type="video/mp4"
    playsinline="true"
    muted
    loop
    controlsList="nodownload  noremoteplayback noplaybackrate" 
    disablePictureInPicture="true"
    >
    </video>
    <!-- <div class="title">{{ item }}</div> -->
  </div>
</template>

<style lang="scss" scoped>
  .video{
      position: relative;
      width: 100%;  
      // height: 120px; 
      overflow: hidden;
      display: flex;
      border-radius: 20px;
      video{
        height: 120px;
        flex: 1;
        position: absolute;
        width: 100%;  
        height: 100%;  
        z-index: 99;
        // object-fit: contain; 
        object-fit: cover; 
        background-color: rgba(127, 255, 212, 0.331);
      }
  }
</style>
