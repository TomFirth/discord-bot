const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const colours = require("../colours.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Check that Barber\'s ok"),
  async execute(interaction) {
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
  }
}