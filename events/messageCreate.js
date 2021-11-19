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

  // TROLL ADAM
  if (message.content == "Hello" && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("Lmao")
  }

  // TROLL BORIS
  if (message.content.includes("LOL") && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("LOL")
  }

  // TROLL LUKE
  if (message.content.tolowercase().includes("martin")) {
    message.channel.send("Do you like Martins?").then(ownMessage => {
      ownMessage.react("🦦")
    })
  }

  // SPECIAL ROLE REWARD
  const reactArray = ['⭐','🏆','👏','👍','🥇']
  if (message.member.roles.cache.some(role => role.name === "Special")
    && Math.floor(Math.random() * 49) == 0) {
    message.react(reactArray[Math.floor(Math.random() * reactArray.length)])
  }

  // QUIZ ANSWER
  if(message.content.toLowerCase().includes("answer")) {
    const answer = cache.get("answer") || null
    const userAnswer = message.content.toLowerCase().replace('answer ','')
    if(userAnswer.includes(answer)) {
      const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bin)
      channel.send(`Congratulations ${message.member} with the correct answer of: ${userAnswer}`).then(ownMessage => {
        ownMessage.react(config.discord.emojis.clap)
      })
      cache.remove("answer")
      // REWARD
      const role = message.guild.roles.cache.find(r => r.id === "860466953582936094")
      message.member.roles.add(role)
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
