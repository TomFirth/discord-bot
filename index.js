const fs = require("fs")
const config = require("./config.json")
const { Client, Intents, Collection, MessageEmbed } = require("discord.js")
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
})
const firebase = require("firebase-admin")
firebase.initializeApp({
	credential: firebase.credential.cert(require("./credentials.json")),
})
const db = firebase.firestore()
const timedCache = require("timed-cache")
const cache = new timedCache({ defaultTtl: 18 * 1000000 }) // 5hrs
if (process.env.NODE_ENV) require("dotenv").config()

const quiz = require("./scheduled/quiz")
const riddles = require("./scheduled/riddles")
const unSpecial = require("./scheduled/unSpecial")
const prune = require("./scheduled/prune")

// const patches = require("./streams/patches")
const reddit = require("./streams/reddit")
const rss = require("./streams/rss")

const twitter = require("./streams/socials/twitter")
// const youtube = require("./streams/socials/youtube")
// const instagram = require("./streams/socials/instragram")
// const twitch = require("./streams/socials/twitch")

client.prefix = config.bot.prefix
client.botCommands = new Collection()

// ERROR MESSAGE
client.error = (error_msg) => {
  if (!error_msg || !channel) return
  const error_embed = new MessageEmbed()
    .setTitle("An Error occured!")
    .setColor("RED")
    .setDescription(`\`\`\`${error_msg}\`\`\``)
    .setTimestamp()
  let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bot)
  return channel.send({ embeds: [error_embed] }).catch(e => console.log(`Couldn't send error embed!\n${e}`))
}

// EVENT HANDLER
fs.readdir("./events/", (error, files) => {
  if (error) return console.error(err)
  client.removeAllListeners()
  files.forEach(file => {
    if (fs.lstatSync(`./events/${file}`).isDirectory()) return
    const event = require(`./events/${file}`)
    const event_name = file.split(".")[0]
    try {
      client.on(event_name, event.bind(null, client))
    } catch(error) {
      console.error(error)
    }
  })
})

// SCHEDULED HANDLER
unSpecial.start(client)
prune.start(client)
quiz.start(client, db, cache)
riddles.start(client, db, cache)

// STREAMS
config.rss.forEach(feed => {
  rss.start(client, feed, db)
})

// PATCH NOTES
// config.streams.forEach(target => {
//   if (target.url !== "") {
//     patches.start(client, target, db)
//   }
// })

// SUBREDDITS
config.reddit.forEach(subreddit => {
  reddit.start(client, subreddit, db)
})

// BETAS

// SOCIALS
twitter.start(client)
// youtube.start(client, config.socials.youtube.channel1)
// youtube.start(client, config.socials.youtube.channel2)
// instagram.start()
// twitch.start()

// COMMAND HANDLER
fs.readdir("./commands/", (error, files) => {
  if (error) return console.error(err)
  const command_files = files.filter(fileName => fileName.endsWith(".js"))
  command_files.forEach(file => {
    const command = require(`./commands/${file}`)
    client.botCommands.set(command.name, command)
  })
})

client.login(process.env.TOKEN).catch(error => console.error(error))