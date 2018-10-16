// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const LIMIT = 0

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo } = event
  const openId = userInfo.openId
  try {
    const roomIds = await db.collection('behaviors').where({
      user: openId
    }).field({
      roomId: true
    }).limit(LIMIT).get().then(
      res => res.data
    )
    let roomPromises = []
    for (let key of roomIds) {
      roomPromises.push(
        db.collection('rooms').where({
          roomId: key.roomId
        }).limit(LIMIT).get().then(
          res => res.data[0] || null
        )
      )
    }
    return Promise.all(roomPromises).then(
      res => {
        return res.filter(item => !(!item || item === ''))
      }
    )
  } catch (e) {
    if (e) {
      return e
    }
  }
}