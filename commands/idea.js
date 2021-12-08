const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  emoji: '❓',
  name: 'feature',
  description: 'Suggest a feature!',
  async execute(client, message, args) {
    await db.collection("ideas").add({
      author: message.member,
      idea: args.join(" ")
    }, {merge: true})
    message.reply(`Thank you ${message.member} for your idea!`)
  }
}