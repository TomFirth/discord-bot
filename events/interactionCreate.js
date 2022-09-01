const config = require("../config.json")

module.exports = (client, interaction) => {
	if (!interaction.isCommand()) return
  const { commandName, options } = interaction
  const command = client.commands.get(commandName)
  if (!command) return
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: "There was an error with this command",
      ephemeral: true
  })
}


// if (message.content.charAt(0) == config.bot.prefix) {
//   if (message.type !== "DM" || !message.author.bot) { // this is messy
//   const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
//   const commandName = args.shift().toLowerCase();
//   const commandGet = client.commands.get(commandName)
//     || client.commands.find(command => command.aliases && command.aliases.includes(commandName))
//   if (!commandGet) return
//   else {
//     try {
//       commandGet.execute(client, message, args, config.bot.prefix)
//     } catch (error) {
//       console.error(error)
//     }
//   }
// }
// }