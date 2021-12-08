const { MessageEmbed } = require("discord.js")
const timedCache = require("timed-cache")
const cache = new timedCache({ defaultTtl: 900 * 1000 })
const config = require("../config.json")

module.exports = (client, message) => {
  if (message.type === "DM" || message.author.bot) return

  const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  if (!command_name) return
  if (command_name.charAt(0) === ".") return
  if (command_name.charAt(0) === "/") return

  // TROLL ADAM
  if (message.content == "Hello" && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("Lmao")
  }

  // TROLL BORIS
  else if (message.content.includes("LOL") && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("LOL")
  }

  // TROLL LUKE
  else if (message.content.toLowerCase().includes("martin")) {
    message.channel.send("Do you like Martins?").then(ownMessage => {
      ownMessage.react("🦦")
    })
  }

  // TROLL TOM
  else if (message.content.toLowerCase().includes("streamer") && Math.floor(Math.random() * 5) == 0) {
    message.channel.send("Are they a c***?")
  }

  // QUIZ ANSWER
  else if(message.content.toLowerCase().includes("quiz")) {
    const answer = cache.get("quizAnswer") || null
    const userAnswer = message.content.toLowerCase().replace("quiz ','")
    if(userAnswer.includes(answer)) {
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
    }
  }

  // RIDDLES ANSWER
  else if(message.content.toLowerCase().includes("riddle")) {
    const answer = cache.get("riddleAnswer") || null
    const userAnswer = message.content.toLowerCase().replace("riddle ','")
    if(userAnswer.includes(answer)) {
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
    }
  }

  // GUESS THE NUMBER
  else if(cache.get("guess") && message.content.toLowerCase().includes("guess")) {
    const answer = cache.get("guess")
    const userAnswer = message.content.toLowerCase().replace("guess ','")
    if (message.content.includes(answer)) {
      message.channel.send(`Congratulations ${message.member} with the correct answer of: ${answer}!`).then(ownMessage => {
        ownMessage.react(config.discord.emojis.clap)
        cache.delete("guess")
      })
    } else if (parseInt(userAnswer) > answer) {
      message.channel.send(`The number is BIGGER!`)
    } else if (parseInt(userAnswer) < answer) {
      message.channel.send(`The number is SMALLER!`)
    } else {
      message.channel.send(`**You lose!**`)
      cache.delete("guess")
      const thread = channel.threads.cache.find(c => c.name === '🔢-guess-the-number')
      await thread.delete()
    }
  }

  // HIGHER LOWER GAME
  else if(cache.get("highlow") && message.content.toLowerCase().includes("higher") || message.content.toLowerCase().includes("lower")) {
    const answer = cache.get("highlow")
    const answerNew = cache.get("highlownew")
    const streak = cache.get("highlowstreak")
    const newRandom = Math.floor(Math.random() * 12)
    if (message.content.toLowerCase().includes("higher") && answerNew > answer) {
      cache.put("highlow", answerNew)
      cache.put("highlownew", newRandom)
      const newStreak = parseInt(streak) + 1
      cache.put("highlowstreak", parseInt(newStreak))
      message.channel.send(`${answerNew} was HIGHER! - You have a streak of ${streak}`)
    } else if (message.content.toLowerCase().includes("lower") && answerNew < answer) {
      cache.put("highlow", answerNew)
      cache.put("highlownew", newRandom)
      const newStreak = parseInt(streak) + 1
      cache.put("highlowstreak", parseInt(newStreak))
      message.channel.send(`${answerNew} was LOWER! - You have a streak of ${streak}`)
    } else {
      message.channel.send(`**You lose!** With a streak of ${streak}`)
      const thread = channel.threads.cache.find(c => c.name === '🔢-higher-or-lower')
      await thread.delete()
    }
  }

  // STOP HIGHER LOWER
  else if(cache.get("highlow") && message.content.toLowerCase().includes("higherlower stop")) {
    cache.delete("highlow")
    cache.delete("highlownew")
    cache.delete("highlowstreak")
    const streak = cache.get("highlowstreak")
    message.channel.send(`**Thank you for playing!** You end with a streak of ${streak}`)
    const thread = channel.threads.cache.find(c => c.name === '🔢-higher-or-lower')
    await thread.delete()
  }

  // SPECIAL ROLE REWARD
  const reactArray = ['⭐','🏆','👏','👍','🥇']
  if (message.member.roles.cache.some(role => role.name === "Special")
    && Math.floor(Math.random() * 49) == 0) {
    message.react(reactArray[Math.floor(Math.random() * reactArray.length - 1)])
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
