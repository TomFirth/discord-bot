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
    .setName("openai")
    .setDescription("OpenAI Code helper")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Ask a question")
        .setRequired(true)
    ),
  async execute(interaction) {
    const response = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: interaction.options.getString("question"),
    })
    const code = new EmbedBuilder()
      .setDescription(response.data.choices[0].text)
      .setColor(utilities.randomColour())
    return interaction.channel.send({ embeds: [code] })
  }
}