const { MessageEmbed } = require('discord.js')

module.exports = {
    emoji: '📊',
    name: 'server',
    description: 'Server information',
    async execute(client, interaction) {
        var members = await interaction.guild.members.fetch()
        var botSize = members.filter(member => member.user.bot).size
        var userSize = interaction.guild.memberCount - botSize
        var dd = interaction.guild.createdAt.getDate()
        var mm = interaction.guild.createdAt.getMonth()+1 
        var yyyy = interaction.guild.createdAt.getFullYear()
        if (dd<10) dd = '0' + dd
        if (mm<10) mm = '0' + mm
        var createdAt = dd + '/' + mm + '/' + yyyy
        const server_embed = new MessageEmbed()
          .setTitle(interaction.guild.name)
          .setThumbnail(interaction.guild.iconURL())
          .setColor('NAVY')
          .setDescription(`\`🙂\` \`Members\` **- \`${interaction.guild.memberCount}\`**\n\n\`🤖\` \`Bots\` **- \`${botSize}\`**\n\`👋\` \`Users\` **- \`${userSize}\`**\n\n\`📆\` \`Created\` **- \`${createdAt}\`**`)
        return interaction.channel.send({ embeds: [server_embed] })
    },
}
