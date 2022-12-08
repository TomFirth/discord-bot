const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Configuration, OpenAIApi } = require("openai")
const utilities = require("../scripts/utilities")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("OpenAI Image creator")
    .addStringOption(option =>
      option
        .setName("create")
        .setDescription("What should I draw?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const response = await openai.createImage({
      prompt: interaction.options.getString("create"),
      n: 1,
      size: "1024x1024",
    })
    await interaction.deferReply()
    await wait(4000)
    setTimeout(async () => {
      console.log("++", response.data.data[0].url)
      await interaction.editReply(response.data.data[0].url)
    }, 4000)
  }
}