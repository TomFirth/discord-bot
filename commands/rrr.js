const { fetchSubreddit } = require('fetch-subreddit')

module.exports = {
  emoji: '🎵',
  name: 'rrr',
  description: 'Reddit Rhythm Roulette',
  execute(client, interaction) {
    let randomTracks = []
    let everything = []
    let array = []
    fetchSubreddit([
      'vintageobscura',
      'SoulMusic',
      'JazzMusic',
      'Jazz',
      'Disco'
    ])
    .then(urls => {
      urls.forEach(tracks => {
        everything.push(tracks.urls)
      })
      const completeList = array.concat(everything[0], everything[1], everything[2], everything[3])
      while (randomTracks.length < 3) {
        const rand = Math.floor(Math.random() * completeList.length)
        if (completeList[rand] && (randomTracks.indexOf(completeList[rand]) > -1 ||
          completeList[rand].includes('youtu'))) {
            if(!randomTracks.includes(completeList[rand])) {
              randomTracks.push(completeList[rand])
            }
        }
      }
      interaction.channel.send(randomTracks.slice(0, 3))
    })
    .catch(error => console.error(error))
  }
}