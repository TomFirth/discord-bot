const { MessageEmbed } = require('discord.js')

module.exports = {
    emoji: '📊',
    name: 'server',
    description: 'Server information',
    async execute(client, message) {
        var members = await message.guild.members.fetch()
        var botSize = members.filter(member => member.user.bot).size
        var userSize = message.guild.memberCount - botSize
        var dd = message.guild.createdAt.getDate()
        var mm = message.guild.createdAt.getMonth()+1 
        var yyyy = message.guild.createdAt.getFullYear()
        if (dd<10) dd = '0' + dd
        if (mm<10) mm = '0' + mm
        var createdAt = dd + '/' + mm + '/' + yyyy
        const server_embed = new MessageEmbed()
          .setTitle(message.guild.name)
          .setThumbnail(message.guild.iconURL())
          .setColor('NAVY')
          .setDescription(`\`🙂\` \`Members\` **- \`${message.guild.memberCount}\`**\n\n\`🤖\` \`Bots\` **- \`${botSize}\`**\n\`👋\` \`Users\` **- \`${userSize}\`**\n\n\`📆\` \`Created\` **- \`${createdAt}\`**`)
        return message.channel.send({ embeds: [server_embed] })
    },
}
