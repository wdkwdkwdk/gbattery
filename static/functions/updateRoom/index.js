// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo, roomId, batteryInfo } = event
  const openId = userInfo.openId
  const userId = await db.collection('users').where({
    _openid: openId
  }).field({
    _id: true
  }).limit(LIMIT).get().then(
    res => {
      return res.data[0] && res.data[0]._id || null
    }
  )
  const match = {
    user: openId,
    roomId
  }
  const getRank = async () => {
    const roomList = await db.collection('behaviors').where({
      roomId
    }).limit(LIMIT).get().then(
      res => res.data
    )
    let promiseList = []
    for (let key of roomList) {
      let user = db.collection('users').where({
        _openid: key.user
      }).field({
        _openid: false
      }).limit(LIMIT).get().then(
        res => {
          return Object.assign(key, {user: res.data[0]})
        }
      )
      promiseList.push(user)
    }
    const result = await Promise.all(promiseList).then(
      rankList => {
        let rank = rankList
        let me = {}
        let sort = (a, b) => {
          return a.batteryLevel < b.batteryLevel
        }
        rank = rank.sort(sort)
        for (let i = 0; i < rank.length; i++) {
          if (rank[i].user && rank[i].user._id === userId) {
            me = {
              index: i
            }
          }
        }
        return { rank, me }
      }
    )
    const roomInfo = await db.collection('rooms').where({
      roomId
    }).limit(LIMIT).get().then(
      res => res.data
    )
    const count = await db.collection('behaviors').where({roomId}).count()
    let updateResult = null
    if (roomInfo.length) {
      updateResult = await db.collection('rooms').where({
        roomId
      }).update({
        data: {
          updateTime: new Date().getTime(),
          count: count.total
        }
      }).then(
        res => {
          return {index: 1}
        }
      )
    } else {
      updateResult = await db.collection('rooms').add({
        data: {
          roomId,
          gId: 0,
          updateTime: new Date().getTime(),
          count: count.total
        }
      }).then(
        res => {
          return {index: 2}
        }
      )
    }
    return result
  }
  const itemData = {
    roomId,
    user: openId,
    batteryLevel: batteryInfo.level,
    isCharging: batteryInfo.isCharging ? 1 : 0,
    updateTime: new Date().getTime()
  }
  const getRoomArray = () => {
    return db.collection('behaviors').where(match).limit(LIMIT).get().then(
      res => res.data
    )
  }
  const roomArray = await db.collection('behaviors').where({roomId, user: openId}).limit(LIMIT).get().then(
    res => res.data
  )
  if (roomArray.length) {
    return await db.collection('behaviors').where(match).update({
      data: itemData
    }).then(
      res => getRank()
    )
  } else {
    return await db.collection('behaviors').add({
      data: itemData
    }).then(
      res => getRank()
    )
  }
}
