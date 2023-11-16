import { ref,  } from 'vue'
import { defineStore } from 'pinia'
import { getVedioApi } from '@/apis/video';

// 视频分类
export const videoTypeStore = defineStore('vedioType', () => { 
  let type = ref("total")
  const urlArr = ref([])
  let index = ref(0)

  // 获取视频
  // 后端返回一组视频的每条视频应该包含视频链接、视频作者id、头像信息、是否被此用户关注点赞或收藏，视频id、点赞数、评论数、收藏数、分享数、等信息

  const getVedio = async (type) =>{
    const res = await getVedioApi(type)
    urlArr.value = res.data.vedioArr
  }

  // 点此侧边栏切换分类
  const clickVideo = (types) =>{
    type.value = types
    urlArr.value = []
    index.value = 0
    getVedio(type.value)
  }


  return {
    index,
    type,
    urlArr,
    getVedio,
    clickVideo
  }
})