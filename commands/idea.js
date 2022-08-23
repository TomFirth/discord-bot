const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  emoji: '❓',
  name: 'feature',
  description: 'Suggest a new bot feature!',
  async run(client, message, args) {
    await db.collection("ideas").add({
      author: message.author.username,
      idea: args.join(" "),
      complete: false
    }, {merge: true})
    message.reply(`Thank you ${message.member} for your idea!`)
  }
}