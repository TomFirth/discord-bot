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
	let scheduledMessage = new cron.CronJob("00 03 20 * * 3", () => {
    const number = pad(Math.floor(Math.random() * 151))
    const pokeEmbed = new EmbedBuilder()
      .setTitle("Who's that Pokemon?")
      .setDescription(`Reply with: "answer <your answer>`)
      .setImage(`attachment://${number}.jpg`)
    const pokemon = kanto[number + 1]
    console.log("kanto", kanto)
    console.log("kanto", kanto[number + 1])
    cache.set("answer", pokemon)
    utilities.channel(client, config.discord.channels.general, { embeds: [pokeEmbed], files: [`../images/pokemon/questions/${number}.jpg`] })
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