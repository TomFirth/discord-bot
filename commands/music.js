const ytdl = require("ytdl-core")
const config = require("../config.json")

module.exports = {
  emoji: '🎵',
  name: 'music',
  description: 'Listen to music',
  async execute(client, message) {
    const args = message.content.split(" ")
    if (args[1] !== "play" || args[1] !== "skip" || args[1] !== "stop") return false
    const serverQueue = queue.get(message.guild.id)
    console.log("args[1]", args[1])
    if (args[1] == "play") {
      console.log("play")
      module.exports.start(message, serverQueue)
      return
    } else if (args[1] == "skip") {
      console.log("skip")
      module.exports.skip(message, serverQueue)
      return
    } else if (args[1] == "stop") {
      console.log("stop")
      module.exports.stop(message, serverQueue)
      return
    } else {
      message.channel.send("You need to enter a valid command!");
    }
  },
  async start(message, serverQueue) {
    const args = message.content.split(" ")
    if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to play music!")
  
    const songInfo = await ytdl.getInfo(args[1])
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
     }
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      }
      queue.set(message.guild.id, queueContruct)
      queueContruct.songs.push(song)
      try {
        const channel = client.channels.cache.find(channel => channel.name === config.discord.music)
        var connection = await channel.join()
        queueContruct.connection = connection
        module.exports.play(message.guild, queueContruct.songs[0])
      } catch (err) {
        queue.delete(message.guild.id)
        return message.channel.send(err)
      }
    } else {
      serverQueue.songs.push(song)
      return message.channel.send(`${song.title} has been added to the queue!`)
    }
  },
  async skip(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!")
    if (!serverQueue) return message.channel.send("There is no song that I could skip!")
    serverQueue.connection.dispatcher.end()
  },
  async stop(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send("You have to be in a voice channel to stop the music!")
    if (!serverQueue) return message.channel.send("There is no song that I could stop!")
      
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
  },
  async play(guild, song) {
    const serverQueue = queue.get(guild.id)
    if (!song) {
      serverQueue.voiceChannel.leave()
      queue.delete(guild.id)
      return
    }
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift()
        module.exports.play(guild, serverQueue.songs[0])
      })
      .on("error", error => console.error(error))
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
    serverQueue.textChannel.send(`Start playing: **${song.title}**`)
  }
}