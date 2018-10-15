// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { userInfo, user } = event
  const openId = userInfo.openId
  const userData = Object.assign({_openid: openId}, user)
  // try {
  //   return await db.collection('users').where({
  //     _openid: openId
  //   }).get()
  // } catch (error) {
  //   return error
  // }
  let userArray = await db.collection('users').where({
    _openid: openId
  }).get()
  userArray = userArray.data
  if (userArray.length) {
    const ID = userArray[0]._id
    return await db.collection('users').doc(ID).set({
      data: userData
    })
  } else {
    return await db.collection('users').add({
      data: userData
    })
  }
}
