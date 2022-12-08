const { SlashCommandBuilder } = require("@discordjs/builders")
const { fetchSubreddit } = require("fetch-subreddit")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rrr")
    .setDescription("Reddit Rhythm Roulette - randomly selects three songs for you."),
  async execute(interaction) {
    if (client.cooldowns.has(interaction.user.id)) {
      interaction.reply({ content: "Please wait for cooldown to end", ephemeral: true });
    } else {
      let randomTracks = []
      let everything = []
      fetchSubreddit([
        'vintageobscura',
        'SoulMusic',
        'JazzMusic',
        'Jazz',
        'Disco'
      ])
      .then(urls => {
        everything = urls[0].urls.concat(urls[1].urls, urls[2].urls, urls[3].urls, urls[4].urls)
        while (randomTracks.length < 3) {
          let rand = Math.floor(Math.random() * everything.length)
          if (everything[rand]
            && !randomTracks.includes(everything[rand])
            && everything[rand].includes("youtu")) {
              randomTracks.push(everything[rand])
          }
        }
        interaction.reply({
          content: "thinking...",
          ephemeral: false
        })
        interaction.deleteReply()
        randomTracks = randomTracks.slice(0, 3)
        randomTracks.forEach((track, index) => {
          interaction.channel.send(track)
        })
      })
      .catch(error => console.error)
      client.cooldowns.set(interaction.user.id, true)
      setTimeout(() => {
        client.cooldowns.delete(interaction.user.id)
      }, client.COOLDOWN_SECONDS * 1000)
    }
  }
}