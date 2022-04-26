const { MessageEmbed } = require("discord.js")
const timedCache = require("timed-cache")
const cache = new timedCache({ defaultTtl: 18 * 1000000 })
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")
const trolls = require("../troll.json")

module.exports = (client, message) => {
  if (message.type === "DM" || message.author.bot) return

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  if (!command_name) return
  else if (command_name.charAt(0) === ".") return
  else if (command_name.charAt(0) === "/") return

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

  // GAMES RESPONSES
  if (message.content.toLowerCase().split(' ')[0] == "answer") {
    const answer = cache.get("answer") || false
    config.games.forEach(game => {
      const userAnswer = message.content.toLowerCase().replace("answer ", "")
      if (userAnswer.includes(answer)) {
        const gameType = game.game.charAt(0).toUpperCase() + game.game.slice(1)
        const gameEmbed = new MessageEmbed()
          .setTitle(`${gameType} WINNER!`)
          .setThumbnail(message.author.displayAvatarURL())
          .setColor("GOLD")
          .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
        message.channel.send({ embeds: [gameEmbed] }).then(ownMessage => {
          ownMessage.react(config.discord.emojis.clap)
        })
        cache.remove("answer")
        // REWARD
        if (!message.member.roles.cache.some(role => role.name === "special")) {
          utilities.channel(client, config.discord.channels.special, `Welcome ${message.member}`)
          const role = message.guild.roles.cache.find(role => role.name === "special")
          message.member.roles.add(role)
        }
      } else {
        if (answer != "" || !answer) {
          const guessArray = userAnswer.split(' ')
          const answerArray = answer.split(' ')
          answerArray.forEach(value => {
            if (guessArray.includes(value)) {
              message.react("🤏")
              return
            }
          })
          message.react(config.discord.emojis.thumbsDown)
        }
      }
    })
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
