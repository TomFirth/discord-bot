const { MessageEmbed } = require('discord.js')

module.exports = {
    emoji: '📊', //OPTIONAL
    name: 'server',
    description: 'Show server information', //OPTIONAL
    async execute(client, interaction) {
        //FETCHING ALL SERVER MEMBERS
        var members = await interaction.guild.members.fetch()
        //GETTING THE AMOUNT OF BOTS
        var botSize = members.filter(member => member.user.bot).size
        //GETTING THE AMOUNT OF USERS
        var userSize = interaction.guild.memberCount - botSize
        //FORMAT guild.createdAt DATE
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
          .setDescription(`\`👤\` \`Owner\` **- <@${interaction.guild.ownerId}>**\n\`🙂\` \`Members\` **- \`${message.guild.memberCount}\`**\n\n\`🤖\` \`Bots\` **- \`${botSize}\`**\n\`👋\` \`Users\` **- \`${userSize}\`**\n\n\`🎉\` \`Roles\` **- \`${message.guild.roles.cache.size}\`**\n\`📆\` \`Created\` **- \`${createdAt}\`**`)
        return interaction.channel.send({ embeds: [server_embed] })
    },
}
