const { useQueue } = require("discord-player");
const { SlashCommandBuilder, GuildMember, Guild } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music and disconnect from the voice channel"),

  async execute(interaction) {
    if (interaction.guild.members.me.voice.channel)
      useQueue(interaction.guild.id).delete();
    else {
      return interaction.reply("I am not in a voice channel!");
    }
    return interaction.reply("Disconnected from the voice channel!");
  },
};
