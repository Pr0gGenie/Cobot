const { useQueue } = require("discord-player");
const { SlashCommandBuilder, GuildMember, Guild } = require("discord.js");
const fs = require("node:fs");
const presets = JSON.parse(
  fs.readFileSync("./src/config/presets.json"),
  "utf-8",
);

const queue = [];
// TODO: Make it possible for users to add presets [✓ done] to the queue and remove them as needed
module.exports = {
  queue,
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Manage the server queue")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a preset to the queue")
        .addStringOption((option) =>
          option
            .setName("preset")
            .setDescription("Add a preset to the queue")
            .setRequired(true)
            .addChoices(
              ...Object.keys(presets).map((name) => ({
                name: name,
                value: name,
              })),
            ),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List the presets in the queue"),
    ),
  async execute(interaction) {
    // SO right now the problem with this way of managing the queue for the purpose of having a custom preset names displayed is that it be will the same across all the guild the bot is on
    // So will have to find a different way
    // And another problem will be I won't be able to use custom names for each preset for each guild
    // Unless I create a database or some for each guild
    // For now it shall be considered a bot for ones own server 
    if (interaction.options.getSubcommand() == "add") {
      presetToAdd = interaction.options.getString("preset");
      const queueCount = queue.push(presetToAdd);
      return interaction.reply(
        `Added **${queue[queue.length - 1]}** to the queue`,
      );
    }
    if (interaction.options.getSubcommand() == "list") {
      let queueList = "";
      for (let i = 0; i < queue.length; i++) {
        queueList += `${i + 1}. ${queue[i]}\n`;
      }
      return interaction.reply(
        queue.length
          ? `**Current Queue:**\n${queueList}`
          : "The queue is empty!",
      );
    }
  },
};
