const { MessageEmbed } = require("discord.js")
const timedCache = require("timed-cache")
const cache = new timedCache({ defaultTtl: 900 * 1000 })
const config = require("../config.json")
const trolls = require("../troll.json")

module.exports = (client, message) => {
  if (message.type === "DM" || message.author.bot) return

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  if (!command_name) return
  else if (command_name.charAt(0) === ".") return
  else if (command_name.charAt(0) === "/") return

  // ADD POLL TO ANY MESSAGE
  if (message.content.toLowerCase() == "add poll") {
    message.delete()
    message.channel.fetchMessages({ limit: 2 })
      .then(messageMappings => {
        let messages = Array.from(messageMappings.values())
        let previousMessage = messages[1]
        previousMessage.react(config.discord.emojis.thumbsUp)
        previousMessage.react(config.discord.emojis.thumbsDown)
      })
      .catch(error => console.error(error))
  }

  // SPECIFIC USER TROLLS
  trolls.forEach(troll => {
    if (troll.includes && !troll.emoji) {
      if (message.content == troll.message && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response)
      }
    } else if (troll.includes && troll.emoji) {
      if (message.content.toLowerCase().includes(troll.message)) {
        message.channel.send(troll.response).then(ownMessage => {
          ownMessage.react(troll.emoji)
        })
      }
    } else if (!troll.includes && !troll.emoji) {
      if (message.content == troll.message) {
        message.channel.send(troll.response)
      }
    }
  })

  // QUIZ ANSWER
  if (message.content.toLowerCase().includes("quiz")) {
    const answer = cache.get("quizAnswer") || null
    const userAnswer = message.content.toLowerCase().replace("quiz ", "")
    if (userAnswer.includes(answer)) {
      const quiz_embed = new MessageEmbed()
        .setTitle(`QUIZ WINNER!`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("GOLD")
        .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
      message.channel.send({ embeds: [quiz_embed] }).then(ownMessage => {
        ownMessage.react(config.discord.emojis.clap)
      })
      cache.remove("quizAnswer")
      // REWARD
      const role = message.guild.roles.cache.find(r => r.id === "860466953582936094")
      message.member.roles.add(role)
      if (message.member.roles.cache.some(role => role.name !== "special")) {
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.special)
        channel.send(`Welcome ${message.member}`)
      }
    } else {
      message.react(config.discord.emojis.thumbsDown)
    }
  }

  // RIDDLES ANSWER
  if (message.content.toLowerCase().includes("riddle")) {
    const answer = cache.get("riddleAnswer") || null
    const userAnswer = message.content.toLowerCase().replace("riddle ","")
    if (userAnswer.includes(answer)) {
      const riddle_embed = new MessageEmbed()
        .setTitle(`RIDDLE SOLVED!`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor("GOLD")
        .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
      message.channel.send({ embeds: [riddle_embed] }).then(ownMessage => {
        ownMessage.react(config.discord.emojis.clap)
      })
      cache.remove("riddleAnswer")
      // REWARD
      const role = message.guild.roles.cache.find(r => r.id === "860466953582936094")
      message.member.roles.add(role)
      if (message.member.roles.cache.some(role => role.name !== "special")) {
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.special)
        channel.send(`Welcome ${message.member}`)
      }
    } else {
      message.react(config.discord.emojis.thumbsDown)
    }
  }

  // SPECIAL ROLE REWARD
  const reactArray = ['⭐','🏆','👏','👍','🥇']
  if (message.member.roles.cache.some(role => role.name === "special")
    && Math.floor(Math.random() * 49) == 0) {
    message.react(reactArray[Math.floor(Math.random() * reactArray.length)])
  }
  
  const command = client.botCommands.get(command_name)
  if (!command) return 
  try {
    command.execute(client, message, args)
  } catch (error) {
    return client.error(error)
  }
}
