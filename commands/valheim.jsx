const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("valheim")
    .setDescription("Create a Valheim server and voice channel"),
  async execute(interaction) {
    // start valheim server
    // create voice channel
    // announce when server is up (create joinable link?)
    // post ip address
  }
}