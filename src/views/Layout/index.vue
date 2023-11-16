<script setup>
  import Aside from "./components/Aside.vue";
  import Headers from "./components/Header.vue";
  // import { ElMessage } from 'element-plus'
  import {videoTypeStore} from '@/stores/videoTypeStore.js'
  const videoType = videoTypeStore()

// 点击侧边栏分类视频
const clickVideo = (types) =>{
  videoType.clickVideo(types)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header"><Headers ></Headers></el-header>
      <el-container>
        <el-aside class="aside">
          <Aside
          @getVedio="clickVideo"
          >
          </Aside>
        </el-aside>
        <el-main>
          <!-- 二级路由的出口组件 -->
          <RouterView /> 
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style lang="scss" scoped>
  @media screen and (max-width :375px){
    .common-layout{
      .header{
        height: 0 !important;
      }
      .aside{
        width: 0 !important;
      }
      .el-main{
        padding: 3vh !important;
        margin-left: 0 !important; 
        width: 100vw !important;
      height: 100vh !important;
      }
    }
  }

  .common-layout{
    color: #fff;

    .header{
      width: 100vw;
      height: 10vh;
    }

    .aside{
      position: fixed;
      z-index: 1000;
      width: 10vw;
      height: 90vh;
    }
    .el-main{
      width: 90vw;
      height: 90vh;
      margin-left: 10vw;
    }

  }

</style>
