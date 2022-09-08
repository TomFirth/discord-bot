const fs = require("node:fs")
const cron = require("cron")
const { Client, Collection, EmbedBuilder, IntentsBitField, Routes } = require("discord.js")
const { REST } = require('@discordjs/rest')
const myIntents = new IntentsBitField();
myIntents.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent);
const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: myIntents
})
const firebase = require("firebase-admin")
firebase.initializeApp({
	credential: firebase.credential.cert(require("./credentials.json")),
})
const db = firebase.firestore()
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 }) // 5hrs
if (process.env.NODE_ENV) require("dotenv").config()
const colours = require("./colours.json")
const config = require("./config.json")

client.commands = new Collection()
client.prefix = config.bot.prefix

// SCHEDULED
// fs.readdir("./scheduled/", (error, files) => {
//   if (error) return console.error(error)
//   files.forEach(file => {
//       require("./scheduled/" + file)(client, db, cache)
//   })
// })
const leet = require("./scheduled/1337")(client)
const birthdays = require("./scheduled/birthday")(client, db)
// const gameCheck = require("./scheduled/gameCheck")(client, db)
const games = require("./scheduled/games")
const jokes = require("./scheduled/jokes")(client, db)
const lucky = require("./scheduled/lucky")(client)
const pokemon = require("./scheduled/pokemon")(client, db, cache)
const prune = require("./scheduled/prune")(client)
const riddles = require("./scheduled/riddles")(client, db, cache)
const unlucky = require("./scheduled/unlucky")(client)
const unSpecial = require("./scheduled/unSpecial")(client)

const patches = require("./streams/patches")
const primeGaming = require("./streams/primeGaming.js")
const reddit = require("./streams/reddit")
const rss = require("./streams/rss.js")

const twitter = require("./streams/socials/twitter")
// const youtube = require("./streams/socials/youtube")
// const instagram = require("./streams/socials/instragram")
// const twitch = require("./streams/socials/twitch")

// ERROR MESSAGE
client.error = (error) => {
  const errorEmbed = new EmbedBuilder()
    .setTitle("An Error occured!")
    .setColor(colours.red)
    .setDescription(`\`\`\`${error}\`\`\``)
    .setTimestamp()
  let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bot)
  if (!error || !channel) return
  return channel.send({ embeds: [errorEmbed] }).catch(e => console.log(`Couldn't send error embed!\n${e}`))
}

// EVENT HANDLER
fs.readdir("./events/", (error, files) => {
  if (error) return console.error(error)
  client.removeAllListeners()
  files.forEach(file => {
    if (fs.lstatSync(`./events/${file}`).isDirectory()) return
    const event = require(`./events/${file}`)
    const eventName = file.split(".")[0]
    try {
      client.on(eventName, event.bind(null, client))
    } catch(error) {
      console.error(error)
    }
  })
})

// PRIME GAMING
let scheduledMessage = new cron.CronJob("00 */15 * * * *", async () => {
  await primeGaming.start(client, db)
})
scheduledMessage.start()

// PATCH NOTES
config.patchNotes.forEach(patch => {
  let scheduledMessage = new cron.CronJob("00 */15 * * * *", async () => {
    await patches.start(client, patch, db)
  })
  scheduledMessage.start()
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
const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.push(command.data.toJSON())
  client.commands.set(command.data.name, command)
}
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN); // semicolon is required!
(async () => {
	try {
		await rest.put(
      Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
			{ body: commands },
		)
	} catch (error) {
		console.error(error)
	}
})()

client.login(process.env.TOKEN).catch(error => console.error(error))