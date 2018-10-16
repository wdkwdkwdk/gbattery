// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    items: [
      {
        icon: 'http://ojrbqzf6q.qnssl.com/FhfKQ8JIT1GJg0iHCroh8wwMhUHD.png',
        name: '决定决定机',
        brief: '一台帮你作决定的神秘机器。',
        appId: 'wx7cea2706dbd472a7'
      },
      {
        icon: 'http://ojrbqzf6q.qnssl.com/FqqczGP9y3Gvn0RO6C1-7KFZZaOc.png',
        name: '小见证',
        brief: '好友见证，生活中的承诺更当真。',
        appId: 'wxdff769880f712e72'
      },
      {
        icon: 'http://ojrbqzf6q.qnssl.com/FpcdfAtmWmqkukkGDmdwaOe7lo0v.png',
        name: '芥子专注',
        brief: '放下手机，专心做你想做的事情。',
        appId: 'wxbacc44917271c609'
      }
    ]
  }
}