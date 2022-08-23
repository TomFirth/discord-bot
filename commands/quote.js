const { EmbedBuilder } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const colours = require("../colours.json")

module.exports = {
  emoji: '👍',
  name: 'quote',
  aliases: ["quote", "randomquote"],
  description: 'Quote people, forever',
  async execute(client, message, args) {
    if (args[0] == "add") {
      await db.collection("quotes").add({
        author: message.mentions.users.first().id,
        quote: args.slice(2).join(" "),
        timestamp: new Date()
      }, {merge: true})
      message.reply(`Thank you ${message.member} for adding a quote! - Use .quote random`)
    } else {      
      const query = await firebase.firestore().collection('quotes').get()
      let quotes = []
			query.forEach(doc => {
				quotes.push({
					quote: doc.data().quote,
					author: doc.data().author,
          timestamp: doc.data().timestamp
				})
			})
      const pickANumber = Math.floor(Math.random() * quotes.length)
      client.users.fetch(quotes[pickANumber].author)
      .then(user => {
        const quote = new EmbedBuilder()
          .setDescription(`"${quotes[pickANumber].quote}"`)
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic:true }) })
          .setColor(colours.black)
        return message.channel.send({ embeds: [quote] })
      })
      .catch(console.error)
    }
  },
}