// 云函数入口文件
const WXBizDataCrypt = require('./WXBizDataCrypt')
const cloud = require('wx-server-sdk')
cloud.init()
const APP_ID = 'wx39b3851c9e79a341'

// 云函数入口函数
exports.main = async (event, context) => {
  const { encryptedData, sessionKey, iv } = event
  const pc = new WXBizDataCrypt(APP_ID, sessionKey)
  const data = pc.decryptData(encryptedData, iv)
  return data
}
