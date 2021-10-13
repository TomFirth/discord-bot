const { MessageEmbed } = require('discord.js')

module.exports = {
	emoji: '❓', //OPTIONAL
	name: 'fact',
	description: 'Get your facts here', //OPTIONAL
	execute(interaction) {
	  const fact = new MessageEmbed()
		.setTitle(`Here's your fact!`)
		.setColor('GREEN')
		.setDescription('This is a fact.')
	  return interaction.channel.send({ embeds: [fact] })
	},
  }