const { SlashCommandBuilder } = require("@discordjs/builders")
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("question")
    .setDescription("OpenAI Code helper")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Ask a question")
        .setRequired(true)
    ),
  async execute(interaction) {
    const response = await openai.createCompletion({
      model: "text-embedding-ada-002",
      prompt: interaction.options.getString("question"),
      'response_length': 512,
      'top_p': 1,
      'echo': true,
      'max_tokens': 4096,
      'temperature': 0.9,
      'frequency_penalty': 0,
      'presence_penalty': 0,
      'best_of': 1,
      'stream': false,
      'start': '\nAI',
      'user': interaction.user.id
    })
    await interaction.deferReply()
    setTimeout(async () => {
      console.log(response.data)
      await interaction.editReply(String(response.data.choices[0].text)).catch(console.error)
    }, 4000)
  }
}