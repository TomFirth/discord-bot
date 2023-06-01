const { SlashCommandBuilder } = require("@discordjs/builders")
const { fetchSubreddit } = require("fetch-subreddit")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rrr")
    .setDescription("Reddit Rhythm Roulette - randomly selects three songs for you."),
  async execute(interaction) {
    utilities.cooldown(interaction.client, interaction.member.id)
    utilities.reportCommand(interaction.client, interaction.user.username, "rrr")
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
    .catch(console.error)
  }
}