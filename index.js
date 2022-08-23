const fs = require("fs")
const cron = require("cron")
const { Client, IntentsBitField, Collection, EmbedBuilder } = require("discord.js")
const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages);
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents
})
client.commands = new Collection();
const firebase = require("firebase-admin")
firebase.initializeApp({
	credential: firebase.credential.cert(require("./credentials.json")),
})
const db = firebase.firestore()
const Cache = require("node-cache")
cache = new Cache({ stdTTL: 18 * 1000000 }) // 5hrs
const config = require("./config.json")
if (process.env.NODE_ENV) require("dotenv").config()

// SCHEDULED
// fs.readdir("./scheduled/", (error, files) => {
//   if (error) return console.error(error)
//   files.forEach(file => {
//       require("./scheduled/" + file)(client, db)
//   })
// })
const leet = require("./scheduled/1337")(client)
const birthdays = require("./scheduled/birthday")(client, db)
// const gameCheck = require("./scheduled/gameCheck")(client, db)
const games = require("./scheduled/games")
const jokes = require("./scheduled/jokes")(client, db)
const lucky = require("./scheduled/lucky")(client)
const prune = require("./scheduled/prune")(client)
const unlucky = require("./scheduled/unlucky")(client)
const unSpecial = require("./scheduled/unSpecial")(client)

// const patches = require("./streams/patches")
const reddit = require("./streams/reddit")
const rss = require("./streams/rss.js")

const twitter = require("./streams/socials/twitter")
// const youtube = require("./streams/socials/youtube")
// const instagram = require("./streams/socials/instragram")
// const twitch = require("./streams/socials/twitch")

client.prefix = config.bot.prefix
client.botCommands = new Collection()

// ERROR MESSAGE
client.error = (error_msg) => {
  if (!error_msg || !channel) return
  const error_embed = new EmbedBuilder()
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

// STREAMS
config.rss.forEach(feed => {
  let scheduledMessage = new cron.CronJob("00 */15 * * * *", async () => {
    await rss.start(client, feed, db)
  })
  scheduledMessage.start()
})

// GAMES
config.games.forEach(async game => {
  await games.start(client, db, cache, game)
})

// SUBREDDITS
config.reddit.forEach(async subreddit => {
  let scheduledMessage = new cron.CronJob("00 * */3 * * *", async () => {
    await reddit.start(client, subreddit, db)
  })
  scheduledMessage.start()
})

// PATCH NOTES
// config.streams.forEach(target => {
//   if (target.url !== "") {
//     patches.start(client, target, db)
//   }
// })

// BETAS

// SOCIALS
twitter.start(client, config.socials.twitter.user, config.discord.channels.socials)
// youtube.start(client, config.socials.youtube.channel1)
// youtube.start(client, config.socials.youtube.channel2)
// instagram.start()
// twitch.start()

// COMMAND HANDLER
fs.readdir("./commands/", (error, files) => {
  if (error) return console.error(err)
  const commandFiles = files.filter(fileName => fileName.endsWith(".js"))
  for (const file of commandFiles) {
    const commandName = file.split(".")[0]
    const command = require(`./commands/${file}`)
    client.commands.set(commandName, command)
  }
})

client.login(process.env.TOKEN).catch(error => console.error(error))