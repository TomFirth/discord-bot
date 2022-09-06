const { Discord } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities")

const config = require("../config.json")
const { kanto } = require("../pokemon.json")

const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 })

function pad (n) {
  var len = 3 - (''  +n).length
  return (len > 0 ? new Array(++len).join('0') : '') + n
}

function init(client, db, cache) {
	let scheduledMessage = new cron.CronJob("00 00 19 * * 3", () => {
    const number = pad(Math.floor(Math.random() * 151))
    const attachment = new Discord
      .MessageAttachment(`./images/questions/${number}.jpg`, "pokemon")
    const pokeEmbed = new Discord.MessageEmbed()
      .setTitle("Who's that Pokemon?")
      .setDescription(`Reply with: "answer <your answer>`)
      .attachFiles(attachment)
      .setImage(`attachment://pokemon`)
    const pokemon = kanto[number + 1]
    cache.set("answer", pokemon)
    utilities.channel(client, config.discord.channels.general, { embeds: [pokeEmbed] })
    db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
      answer: pokemon,
      id: null,
      db: "pokemon",
      used: false
    })
  })
	scheduledMessage.start()
}

module.exports = init