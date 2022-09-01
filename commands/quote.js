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
        .setDescription("Who said it")
        .setRequired(false))
    .addStringOption(option =>
      option
        .setName("quote")
        .setDescription("What did they say?")
        .setRequired(false)),
  async execute(interaction) {
    if (!interaction.options.getString("user")) {
      const query = await db.collection('quotes').get()
      let quotes = []
			query.forEach(doc => {
				quotes.push({
					quote: doc.data().quote,
					author: doc.data().author,
          timestamp: doc.data().timestamp
				})
			})
      interaction.reply({
        content: "thinking...",
        ephemeral: false
      })
      interaction.deleteReply()
      const interactionUser = await interaction.guild.members.fetch(doc.data().author)
      const quote = new EmbedBuilder()
        .setDescription(`"${quotes[Math.floor(Math.random() * quotes.length)].quote}"`)
        .setAuthor({ name: interactionUser.user.username, iconURL: interactionUser.user.displayAvatarURL({ dynamic:true }) })
        .setColor(utilities.randomColour())
      return interaction.channel.send({ embeds: [quote] })
    } else {
      await db.collection("quotes").add({
        author: interaction.options.getUser('target'),
        quote: interaction.options.getString("quote"),
        timestamp: new Date()
      }, {merge: true})
      await interaction.deferReply({
        content: "Thank you for adding a quote!",
        ephemeral: true
      })
    }
  }
}