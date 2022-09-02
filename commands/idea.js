const { SlashCommandBuilder } = require("@discordjs/builders")
const firebase = require("firebase-admin")
const db = firebase.firestore()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("idea")
    .setDescription("Suggest a new idea for Barber")
    .addStringOption(option =>
      option
      .setName("idea")
      .setDescription("Your idea")
      .setRequired(true)
    ),
  async execute(interaction) {
    await db.collection("ideas").add({
      author: interaction.user.username,
      idea: interaction.options.getString("idea"),
      complete: false
    }, {merge: true})
    interaction.reply({
      content: `Thank you ${interaction.user.username} for your idea!`,
      ephemeral: true
    })
  }
}