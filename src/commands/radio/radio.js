const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");
const presets = require("../../config/presets.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Manage this radio bot")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("start")
        .setDescription("Start a preset in the current voice channel you are in")
        .addStringOption((option) =>
          option
            .setName("preset")
            .setDescription("Selection of presets to play")
            .setRequired(true)
            .addChoices(
              ...Object.keys(presets).map((name) => ({
                name: name,
                value: name,
              }))
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("stop")
        .setDescription("Stops the current playing preset, and disconnects the bot")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("replace")
        .setDescription("Replaces the playing preset with a different one")
        .addStringOption((option) =>
          option
            .setName("replace_with")
            .setDescription("Replace with this preset")
            .setRequired(true)
            .addChoices(
              ...Object.keys(presets).map((name) => ({
                name: name,
                value: name,
              }))
            )
        )
    ),
    
    // TODO: the user can control the timer the preset is played for
    // TODO: the user can choose to set it as a pomodoro timer instead
    // .addSubcommand((subcommand) =>
    //     subcommand
    //         .setName("timer")
    //         .setDescription("Adjusts the time the bot plays the music for")),
    

  async execute(interaction) {
    const { guild, member } = interaction;
    const voiceChannel = member?.voice?.channel;
    const player = useMainPlayer();

    if (interaction.options.getSubcommand() == "start") {
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
        const playlistUrl = presets[interaction.options.getString("preset")];

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
    
          return interaction.followUp(`Playing the preset: **${interaction.options.getString("preset")}**`);
        } catch (error) {
          console.error(error);
          return interaction.followUp("An error occurred while playing the preset");
        }
    }

    if (interaction.options.getSubcommand() == "stop") {
        if (guild.members.me.voice.channel)
            useQueue(guild.id).delete();
        else {
            return interaction.reply("I am not in a voice channel!");
        }
        return interaction.reply("Disconnected from the voice channel!");
    }
  },
};
