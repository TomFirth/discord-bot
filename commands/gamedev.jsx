const { SlashCommandBuilder } = require("@discordjs/builders")
const { google } = require('googleapis')
const { authenticate } = require('@google-cloud/local-auth')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamedev")
    .setDescription("Gamedev doc access"),
  async execute(interaction) {
    const docs = google.docs('v1')
    const auth = await authenticate({
      keyfilePath: "../oauth2.keys.json",
      scopes: 'https://www.googleapis.com/auth/documents',
    })
    google.options({ auth })
  
    const res = await docs.documents.get({
      documentId: '1IQ1nh0nUn-1Rbt6D_jqcxfZi5YULU1hS6jJKRDHbRhI',
    })
    console.log("res.data", res.data)

    // const game_embed = new EmbedBuilder()
    //   .setTitle()
    //   .setThumbnail()
    //   .setColor("RANDOM")
    //   .setDescription()
    // return message.channel.send({ embeds: [game_embed] })
  }
}