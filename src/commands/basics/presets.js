const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const fs = require("node:fs");
const path = require("node:path");

const presets = JSON.parse(
  fs.readFileSync("./src/start/presets.json"),
  "utf-8",
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("presets")
    .setDescription("Add a preset to the queue")
    .addStringOption((option) =>
      option
        .setName("playlist")
        .setDescription("Choose a playlist to play")
        .setRequired(true)
        .addChoices(
          ...Object.keys(presets).map((name) => ({
            name: name,
            value: name,
          })),
        ),
    ),

  async execute(interaction) {
    const { guild, member, options } = interaction;
    const selectedPreset = options.getString("playlist", true);
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

    const playlistUrl = presets[selectedPreset];

    try {
      const result = await player.search(playlistUrl);
      if (!result.tracks.length) {
        return interaction.followUp("No tracks found!");
      }

      await player.play(voiceChannel, result, { 
        nodeOptions: {
          leaveOnEmpty: false,
          repeatMode: 2,
      }});
      return interaction.followUp(`Playing the playlist: ${selectedPreset}`);
    } catch (error) {
      console.error(error);
      return interaction.followUp("An error occurred while playing the preset");
    }
  },
};
