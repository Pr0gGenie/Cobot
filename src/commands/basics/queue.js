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
