const { EmbedBuilder } = require("discord.js")
const https = require("https")
const cheerio = require("cheerio")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

class Patches {
  static start(client, target, db) {
    const url = new URL(config.streams[target.name].url)
    https.get({
      hostname: url.hostname,
      path: url.pathname,
      headers: {'User-Agent': 'agent'}
    }, async response => {
      response.on("data", data => {
        const $ = cheerio.load(data)
      })
      response.on("end", async () => {
        const title = ""
        const href = ""
        $(target.find, data).each(() => {
          title = $(this).text
          href = $(this).find("a").attr("href")
        })
        const query = await db.collection("patches").doc(target.docId).get()
        if (query.data() !== undefined
        && query.data().title !== title) {
          const patchNotes = new EmbedBuilder()
            .setAuthor({ name: target.name })
            .setTitle(title)
            .setColor(target.colour)
            .setThumbnail("")
            .setURL(href)
            // .addField("") // scheduled release date
            // .addField("") // headlines
            .setTimestamp()
          utilities.channel(client, config.discord.channels.updates, { embeds: [patchNotes]})
          db.collection("patches").doc(target.docId).set({
            title: title
          }, {merge: true})
        }
      })
      response.on("error", (error) => {
        console.error(error)
      })
    })
  }
}

module.exports = Patches