// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo } = event
  const openId = userInfo.openId
  try {
    return await db.collection('users').where({
      _openid: openId
    }).count()
  } catch (error) {
    return error
  }
}