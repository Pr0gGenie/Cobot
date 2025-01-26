const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const fs = require("node:fs");
const path = require("node:path");

const presets = JSON.parse(
  fs.readFileSync("./src/config/presets.json"),
  "utf-8",
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start the queue in your current voice channel"),

  async execute(interaction) {
    const { guild, member, options } = interaction;
    const voiceChannel = member?.voice?.channel;
    const player = useMainPlayer();

    if (!guild || !voiceChannel) {
      return interaction.reply(
        "You need to be in a voice channel to play music!",
      );
    }

    const botVoiceChannel = guild.members.me?.voice?.channel;
    if (botVoiceChannel && botVoiceChannel !== voiceChannel) {
      return interaction.reply(
        "The bot is already playing in another channel!",
      );
    }

    if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
      return interaction.reply(
        "I do not have permission to join the voice channel!",
      );
    }

    if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
      return interaction.reply(
        "I do not have permission to speak in the voice channel!",
      );
    }

    await interaction.deferReply();

    const currentSelection = queue[queue.length - queue.length];
    const playlistUrl = presets[currentSelection];

    try {
      const result = await player.search(playlistUrl);
      if (!result.tracks.length) {
        return interaction.followUp("No tracks found!");
      }

      await player.play(voiceChannel, result, {
        nodeOptions: {
          leaveOnEmpty: false,
          repeatMode: 2,
        },
      });

      // TODO: Play the next preset in queue after this current preset finishes

      queue.shift();
      return interaction.followUp(`Playing the playlist: ${currentSelection}`);
    } catch (error) {
      console.error(error);
      return interaction.followUp("An error occurred while playing the preset");
    }
  },
};
