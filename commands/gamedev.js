const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { google } = require('googleapis')
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamedev")
    .setDescription("Randomly selects a game idea from Beardmachine's gamedev ideas doc."),
  async execute(interaction) {
    if (interaction.channel.id !== "836600267976867930") {
      interaction.reply({
        content: `This command only works in #${config.discord.channels.gamedev}`,
        ephemeral: true
      })
    }
    const credentials = require('../credentials.json')
    const scopes = [
      'https://www.googleapis.com/auth/drive'
    ];
    const auth = new google.auth.JWT(
      credentials.client_email, null,
      credentials.private_key, scopes
    )
    const drive = google.drive({ version: "v3", auth })
    drive.files.list({}, (err, res) => {
      if (err) throw err
      const files = res.data.files
      if (files.length) {
        files.map(async (file) => {
          const docs = google.docs({version: 'v1', auth})
          const res = await docs.documents.get({
            documentId: file.id,
          });
          const total = res.data.body.content.length - 10
          const start = Math.floor(Math.random() * total)
          let title = ""
          let game = []
          let current = true
          for (let i = start; i < total; i++) {
            if (res.data.body.content[i].paragraph.paragraphStyle.namedStyleType == "HEADING_3" && current) {
              title = res.data.body.content[i].paragraph.elements[0].textRun.content
              let j = i + 1
              while (res.data.body.content[j] !== undefined && current) {
                if (res.data.body.content[j].paragraph.paragraphStyle.namedStyleType == "NORMAL_TEXT") {
                  let newString = res.data.body.content[j].paragraph.elements[0].textRun.content
                  game.push(newString)
                  j++
                } else {
                  current = false
                }
              }
            }
          }
          interaction.reply({
            content: "thinking...",
            ephemeral: false
          })
          interaction.deleteReply()
          game = game.join("")
          const game_embed = new EmbedBuilder()
            .setTitle(`Random game idea: ${title}`)
            .setThumbnail()
            .setColor(utilities.randomColour())
            .setDescription(game.toString())
          return interaction.channel.send({ embeds: [game_embed] })
        });
      } else {
        console.error('No files found')
      }
    });
  }
}