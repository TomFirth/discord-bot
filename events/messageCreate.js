const config = require('../config.json')

module.exports = (client, message) => {
    if(message.type === "DM" || message.author.bot) return
    // Troll Adam
    if(message.content == "Hello" && Math.floor(Math.random() * 3) == 0) message.channel.send("Lmao")
    // Special reward
    if(message.member.roles.cache.some(role => role.name === "Special") && Math.floor(Math.random() * 10) == 0) message.react('⭐')

    // Start normal bot commands
    if(!message.content.toLowerCase().startsWith(config.bot.prefix)) return

    const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)

    const command_name = args.shift().toLowerCase()
    if(!command_name) return
    if(command_name.charAt(0) === '.') return
    if(command_name.charAt(0) === '/') return
    
    const command = client.botCommands.get(command_name)
    if(!command) return message.reply(`**Sorry, that command does not exist!**`)
    try {
        command.execute(client, message, args)
    } catch (error) {
        console.log(error)
        return client.error(error, message.channel)
    }
}
