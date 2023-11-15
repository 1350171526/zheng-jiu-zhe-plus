import axios from 'axios'
// 获取不同分类的视频接口
export function getVedioApi(type){
  return axios({
    url: `/api/total`,
    params: {type}
  })
}