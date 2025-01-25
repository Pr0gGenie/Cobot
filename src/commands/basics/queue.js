const { useQueue } = require("discord-player");
const { SlashCommandBuilder, GuildMember, Guild } = require("discord.js");
const fs = require("node:fs");
const presets = JSON.parse(
    fs.readFileSync("./src/start/presets.json"),
    "utf-8",
)

// TODO: Make it possible for users to add presets to the queue and remove them as needed
// ALSO: Instead of a presets command, just use queue command, and add another command to start the bot to play music
module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Manage the server queue")
    .addStringOption((option) =>
      option
        .setName("list")
        .setDescription("View the current queue"))   
    .addStringOption((option) =>
      option
        .setName("add")
        .setDescription("Add a preset to the queue")
        .addChoices(
            ...Object.keys(presets).map((name) => ({
                name: name,
                value: name,
            })),
        )
    ),

    async execute(interaction) {
        const queue = useQueue({
          interaction: interaction,
          metadata: {
            channel: interaction.channel,
          },
        });
      
        if (interaction.options.getString("list") === "list") {
        }
      
        if (interaction.options.getString("add") === "add") {
          }
        }
};