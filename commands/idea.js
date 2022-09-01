const { SlashCommandBuilder } = require("@discordjs/builders")
const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("feature")
    .setDescription("Suggest a new feature")
    .addStringOption(option =>
      option
      .setName("feature")
      .setDescription("Your idea")
      .setRequired(true)
    ),
  async execute(interaction) {
    await db.collection("ideas").add({
      author: interaction.author.username,
      idea: interaction.options.getString("feature"),
      complete: false
    }, {merge: true})
    message.reply(`Thank you ${interaction.member} for your idea!`)
  }
}