// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo, roomId, batteryInfo } = event
  const openId = userInfo.openId
  const userId = await db.collection('users').where({
    _openid: openId
  }).field({
    _id: true
  }).get().then(
    res => {
      return res.data[0]._id
    }
  )
  try {
    let operateMembers = {}
    let room = await db.collection('rooms').where({
      roomId: roomId
    }).get()
    const member = {
      user: userInfo.openId,
      updateTime: new Date().getTime(),
      batteryInfo: {
        "level": batteryInfo.level,
        "isCharging": batteryInfo.isCharging ? 1 : 0
      }
    }
    if (room.data.length === 0) {
      operateMembers = await db.collection('rooms').add({
        data: {
          roomId,
          members: [
            member
          ]
        }
      })
    } else {
      const members = room.data[0].members
      for (let i = 0; i < members.length; i++) {
        if (members[i].user === openId) {
          members.splice(i, 1)
        }
      }
      members.push(member)
      operateMembers = await db.collection('rooms').where({
        roomId
      }).update({
        data: {
         members 
        }
      })
    }
    let allRankPromsie = []
    room = await db.collection('rooms').where({
      roomId
    }).get()
    let roomMembers = room.data[0].members
    for (let key of roomMembers) {
      let user = db.collection('users').where({
        _openid: key.user
      }).field({
        _openid: false
      }).get().then(
        res => {
          return Object.assign(key, {user: res.data[0]})
        }
      )
      allRankPromsie.push(user)
    }
    
    return await Promise.all(allRankPromsie).then(
      res => {
        let rank = res
        let me = {}
        let sort = (a, b) => {
          return a.batteryInfo.level < b.batteryInfo.level
        }
        rank = rank.sort(sort)
        for (let i = 0; i < rank.length; i++) {
          if (rank[i].user._id === userId) {
            me = {
              index: i
            }
          }
        }
        return {
          rank,
          me
        }
      }
    )
  } catch (error) {
    return error
  }
}