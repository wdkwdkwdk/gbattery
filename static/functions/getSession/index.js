// 云函数入口文件
const APP_ID = 'wx39b3851c9e79a341'
const SECRET = '740704c5138c48ae877c2f0da4914b47'
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { JSCODE } = event
  return new Promise((resolve, reject) => {
    rp.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${SECRET}&js_code=${JSCODE}&grant_type=authorization_code`).then(
      res => {
        resolve(res)
      }
    ).catch(
      error => {
        if (error) {
          reject(error)
        }
      }
    )
  })
}
