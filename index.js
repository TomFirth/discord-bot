const fs = require('fs')
const { Client, Intents, Collection,  MessageEmbed } = require('discord.js')
require('dotenv').config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] })
const config = require('./config')

client.prefix = config.bot.prefix
client.botCommands = new Collection()

//ERROR MESSAGE
client.error = (error_msg, channel) => {
    if(!error_msg || !channel) return
    const error_embed = new MessageEmbed()
        .setTitle('An Error occured!')
        .setColor('RED')
        .setDescription(`\`\`\`${error_msg}\`\`\``)
        .setTimestamp()
    return channel.send({ embeds: [error_embed] }).catch(e => console.log(`Couldn't send error embed!\n${e}`))
}

//EVENT HANDLER
fs.readdir('./events/', (error, files) => {
    if (error) return console.error(err)
    client.removeAllListeners()
    files.forEach(file => {
        if(fs.lstatSync(`./events/${file}`).isDirectory()) return
        var event = require(`./events/${file}`)
        var event_name = file.split(".")[0]
        try{
            client.on(event_name, event.bind(null, client))
        } catch(e) {
            console.log(e)
        }
    })
})

//COMMAND HANDLER
fs.readdir('./commands/', (error, files) => {
    if (error) return console.error(err)
	var command_files = files.filter(fileName => fileName.endsWith(".js"))
	command_files.forEach(file => {
        const command = require(`./commands/${file}`)
		client.botCommands.set(command.name, command)
    })
})

client.login(process.env.token)