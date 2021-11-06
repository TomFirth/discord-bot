const config = require('../config.json')

module.exports = (client, message) => {
  if(message.type === "DM" || message.author.bot) return

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  if(!command_name) return
  if(command_name.charAt(0) === '.') return
  if(command_name.charAt(0) === '/') return
  
  const command = client.botCommands.get(command_name)
  if(!command) return 
  try {
    command.execute(client, message, args)
  } catch (error) {
    console.log(error)
    return client.error(error, message.channel)
  }
}
