const { SlashCommandBuilder } = require("@discordjs/builders")
const google = require("google-it")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Google search.")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("What are you looking for?")
        .setRequired(true)
    ),
  async execute(interaction) {
    utilities.cooldown(interaction.client, interaction.member.id)
    utilities.reportCommand(interaction.client, interaction.user.username, "search")
    google({'query': interaction.options.getString("search")}).then(results => {
      interaction.reply({
        content: "Searching...",
        ephemeral: false
      })
      interaction.deleteReply()
      interaction.channel.send(`${results[0].link || "0 results"}`)
    })
  }
}