const { MessageEmbed } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  emoji: '👍',
  name: 'quote',
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
      const titles = [
        "It\'s just a matter of time before this person\'s on a list.",
        "This person is legally an adult.",
        "Some things are best left unsaid."
      ]
      
      const query = await firebase.firestore().collection('quotes').get()
      let quotes = []
			query.forEach(doc => {
				quotes.push({
					quote: doc.data().quote,
					author: doc.data().author,
          timestamp: doc.data().timestamp
				})
			})
      const pickANumber = Math.floor(Math.random() * quotes.length - 1)
      client.fetchUser(quotes[pickANumber].author)
      .then(user => {
        const quote = new MessageEmbed()
          .setTitle(titles[Math.floor(Math.random() * titles.length - 1)])
          .setDescription(quotes[pickANumber].quote)
          .setAuthor(user.username)
          .setThumbnail(user.displayAvatarURL)
          .setColor("RANDOM")
        return message.channel.send({ embeds: [quote] })
      })
      .catch(console.error)
    }
  },
}