const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  emoji: '❓',
  name: 'feature',
  description: 'Suggest a feature!',
  randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split("")
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
  },
  async execute(client, message, args) {
    const docId = await this.randomString(20)
    await db.collection("ideas").doc(docId).set({
      author: message.member,
      idea: args.join(" ")
    }, {merge: true})
    message.reply(`Thank you ${message.member} for your idea!`)
  }
}