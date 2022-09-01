const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("Check that Barber\'s ok")
    .addUserOption(option => 
      option
        .setName('target')
        .setDescription("Who said it"))
    .addStringOption(option =>
      option
        .setName("quote")
        .setDescription("What did they say?")
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.options.getString("user")) {
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
          .setColor(utilities.randomColour())
        return interaction.channel.send({ embeds: [quote] })
      })
      .catch(console.error)
    } else {
      await db.collection("quotes").add({
        author: interaction.options.getString("user"),
        quote: interaction.options.getString("quote"),
        timestamp: new Date()
      }, {merge: true})
      interaction.reply({
        content: "Thank you for adding a quote!",
        ephemeral: true
      })
    }
  }
}