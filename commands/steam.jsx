// https://steamcommunity.com/dev
// https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0001.29

/* script that allows users to add their entire steam library to the bot
  the bot is then able to find other users with the same games
  both users are then contacted, and hopefully will want to play together */

const { EmbedBuilder } = require("discord.js")
const colours = require("../colours.json")

module.exports = {
  emoji: '📝',
  name: 'steam',
  description: 'Steam helper',
  execute(client, message) {
    // add library
    // remove library
    // find players
  },
}