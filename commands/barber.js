const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const colours = require("../colours.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("barber")
    .setDescription("Barber's commands")
    .addStringOption(option =>
      option
        .setName("command")
        .setDescription("Barber's commands")
        .setRequired(true)
        .addChoices(
          { name: 'Ping', value: 'barber_ping' },
          { name: 'Server', value: 'barber_server' },
          { name: 'Uptime', value: 'barber_uptime' },
        )
    ),
  async execute(interaction) {
    if (interaction.options.getString("command") === "barber_ping") {
      const initial = interaction.createdTimestamp
      const now = new Date()
      interaction.reply({
        content: `${now - initial}ms`,
        ephemeral: true
      })
    } else if (interaction.options.getString("command") === "barber_server") {
      var members = await interaction.guild.members.fetch()
      var botSize = members.filter(member => member.user.bot).size
      var userSize = interaction.guild.memberCount - botSize
      var dd = interaction.guild.createdAt.getDate()
      var mm = interaction.guild.createdAt.getMonth()+1 
      var yyyy = interaction.guild.createdAt.getFullYear()
      if (dd<10) dd = '0' + dd
      if (mm<10) mm = '0' + mm
      var createdAt = dd + '/' + mm + '/' + yyyy
      const server_embed = new EmbedBuilder()
        .setTitle(interaction.guild.name)
        .setThumbnail(interaction.guild.iconURL())
        .setColor(colours.navy)
        .setDescription(`\`🙂\` \`Members\` **- \`${interaction.guild.memberCount}\`**\n\n\`🤖\` \`Bots\` **- \`${botSize}\`**\n\`👋\` \`Users\` **- \`${userSize}\`**\n\n\`📆\` \`Created\` **- \`${createdAt}\`**`)
        interaction.reply({
          content: "thinking...",
          ephemeral: false
        })
        interaction.deleteReply()
      interaction.channel.send({ embeds: [server_embed] })
    } else if (interaction.options.getString("command") === "barber_uptime") {
      let totalSeconds = (interaction.client.uptime / 1000)
      let days = Math.floor(totalSeconds / 86400)
      totalSeconds %= 86400
      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds %= 3600
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = Math.floor(totalSeconds % 60)
      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`
      await interaction.reply({
        content: uptime,
        ephemeral: true
      })
    }
  }
}