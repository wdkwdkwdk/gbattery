// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { roomId, gId } = event
  try {
    return await db.collection('behaviors').where({
      roomId
    }).update({
      data: {
        gId
      }
    })
  } catch (error) {
    if (error) {
      return error
    }
  }
}