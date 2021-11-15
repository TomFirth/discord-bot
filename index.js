const fs = require('fs')
const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
  presence: {
    status: "online",
    activity: {
      name: "Barber",
      type: "LISTENING"
    }
  }
})
const config = require('./config.json')
if (process.env.NODE_ENV) require('dotenv').config()

const rmeme = require('./scheduled/rmeme')
const meme = require('./scheduled/meme')
const quiz = require('./scheduled/quiz')
const unSpecial = require('./scheduled/unSpecial')
const prune = require("./scheduled/prune")

const freeGames = require('./streams/free')
const news = require('./streams/news')

const twitter = require('./streams/socials/twitter')
// const youtube = require('./streams/socials/youtube')
// const instagram = require('./streams/socials/instragram')
// const twitch = require('./streams/socials/twitch')

client.prefix = config.bot.prefix
client.botCommands = new Collection()

// ERROR MESSAGE
client.error = (error_msg, channel) => {
  if (!error_msg || !channel) return
  const error_embed = new MessageEmbed()
    .setTitle('An Error occured!')
    .setColor('RED')
    .setDescription(`\`\`\`${error_msg}\`\`\``)
    .setTimestamp()
  return channel.send({ embeds: [error_embed] }).catch(e => console.log(`Couldn't send error embed!\n${e}`))
}

// EVENT HANDLER
fs.readdir('./events/', (error, files) => {
  if (error) return console.error(err)
  client.removeAllListeners()
  files.forEach(file => {
    if (fs.lstatSync(`./events/${file}`).isDirectory()) return
    const event = require(`./events/${file}`)
    const event_name = file.split(".")[0]
    try {
      client.on(event_name, event.bind(null, client))
    } catch(error) {
      console.log(error)
    }
  })
})

// SCHEDULED HANDLER
meme.start(client)
rmeme.start(client)
unSpecial.start(client)
prune.start(client)
quiz.start(client)

// STREAMS
freeGames.start(client)
news.start(client)
// patch notes
// meme of the day
// alphas and betas

// SOCIALS
twitter.start(client)
// youtube.start(client, config.socials.youtube.channel1)
// youtube.start(client, config.socials.youtube.channel2)
// instagram.start()
// twitch.start()

// COMMAND HANDLER
fs.readdir('./commands/', (error, files) => {
  if (error) return console.error(err)
  const command_files = files.filter(fileName => fileName.endsWith(".js"))
  command_files.forEach(file => {
    const command = require(`./commands/${file}`)
    client.botCommands.set(command.name, command)
  })
})

client.login(process.env.TOKEN).catch(console.error)