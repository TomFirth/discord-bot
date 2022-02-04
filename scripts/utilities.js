module.exports = {
  channel: (client, destination, send) => {
    const channel = client.channels.cache.find(channel => channel.name === destination)
    channel.send(send)
  }
}