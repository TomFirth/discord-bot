const { SlashCommandBuilder } = require("@discordjs/builders")

// https://steamcommunity.com/dev
// https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0001.29

/* script that allows users to add their entire steam library to the bot
  the bot is then able to find other users with the same games
  both users are then contacted, and hopefully will want to play together */

module.exports = {
  data: new SlashCommandBuilder()
    .setname("steam")
    .setDescription("Find someone to play with"),
  async execute(interaction) {
    // add library
    // remove library
    // find players
  }
}