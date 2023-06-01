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
    utilities.cooldown(interaction.client, interaction.member.id)
    utilities.reportCommand(interaction.client, interaction.user.username, "openai")
    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
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
      'stop': '\nHuman',
      'user': interaction.user.id
    })
    .then(async response => {
      await interaction.deferReply()
      await interaction.editReply(String(response.data.choices[0].message.content)).catch(console.error)
    })
  }
}