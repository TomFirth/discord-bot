const { EmbedBuilder } = require("discord.js")
const colours = require("../colours.json")

module.exports = {
  emoji: '📝',
  name: 'help',
  description: 'A list of my commands!',
  execute(client, message) {
    const exclusions = ["help", "ping", "server", "uptime", "message", "quote", "gamedev", "special"]
    const help_embed = new EmbedBuilder()
      .setTitle(`${client.user.username}'s Commands`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(colours.green)
      .setDescription(client.botCommands.filter(command => { return !exclusions.includes(command.name) }).map(command => {
        return `\`${command.emoji || '✔️'}\` \`.${command.name}\` - *${command.description || `No description available.`}*`
      }).join(`\n`))
    return message.channel.send({ embeds: [help_embed] })
  },
}