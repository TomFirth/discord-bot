const { EmbedBuilder } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities")

const config = require("../config.json")
const { kanto } = require("../pokemon.json")

function pad (n) {
  var len = 3 - ('' + n).length
  return (len > 0 ? new Array(++len).join('0') : '') + n
}

function init(client, db, cache) {
	let scheduledMessage = new cron.CronJob("00 00 19 * * 3", () => {
    const random = Math.floor(Math.random() * kanto.length + 1)
    const number = pad(random)
    const pokeEmbed = new EmbedBuilder()
      .setTitle("Who's that Pokemon?")
      .setDescription(`Reply with: "answer <your answer>`)
      .setImage(`attachment://${number}.jpg`)
    const pokemon = kanto[random + 1]
    cache.set("answer", pokemon.toString())
    utilities.channel(client, config.discord.channels.general, { embeds: [pokeEmbed], files: [`../discord-bot/images/pokemon/questions/${number}.jpg`] })
    db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
      answer: pokemon,
      id: "null",
      db: "pokemon",
      used: false
    })
  })
	scheduledMessage.start()
}

module.exports = init