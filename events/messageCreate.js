const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })
const config = require('../config.json')

module.exports = (client, message) => {
  if (message.type === "DM" || message.author.bot) return

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  if (!command_name) return
  if (command_name.charAt(0) === '.') return
  if (command_name.charAt(0) === '/') return

  // Troll Adam
  if (message.content == "Hello" && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("Lmao")
  }

  // Special reward
  const reactarray = ['⭐','🏆','👏','👍','🥇']
  if (message.member.roles.cache.some(role => role.name === "Special")
    && Math.floor(Math.random() * 99) == 0) {
    message.react(reactArray[Math.floor(Math.random() * reactarray.length)])
  }

  // Quiz answer
  if(message.content.toLowerCase().includes("answer")) {
    const answer = cache.get("answer") || null
    const userAnswer = message.content.toLowerCase().replace('answer ','')
    if(userAnswer.includes(answer)) {
      let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.secret)
      channel.send(`Congratulations ${message.member} with the correct answer of: ${userAnswer}`)
      const guild = client.guilds.cache.get(config.discord.guildId)
      guild.members.fetch()
      .then(members => {
        members.forEach(member => {
          if (member.user.username !== config.discord.owner.name && member.user.username == message.member) {
            const role = member.guild.roles.cache.find(role => role.name === "Special")
            member.roles.add(role)
            cache.put("answer", null)
          }
        })
      })
      .catch(error => console.log(error))
    }
  }
  
  const command = client.botCommands.get(command_name)
  if (!command) return 
  try {
    command.execute(client, message, args)
  } catch (error) {
    console.log(error)
    return client.error(error, message.channel)
  }
}
