import axios from 'axios'
// 获取不同分类的视频接口
export function getVedioApi(type){
  return axios({
    url: `/api/total`,
    params: {type}
  })
}

// 获取首页接口
export function getHomeApi(){
  return axios({
    url: `/api/home`
  })
}