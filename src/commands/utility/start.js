const { SlashCommandBuilder, CommandInteraction, PermissionsBitField } =  require('discord.js');
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts the music preset in the current voice channel')
        .addStringOption(
            (option) => option
                .setName('song')
                .setDescription('The song to play')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { guild, member, options } = interaction;
        const query = options.getString('song', true);
        const voiceChannel = member?.voice?.channel;

        if (!guild || !voiceChannel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        const botVoiceChannel = guild.members.me?.voice?.channel;
        if (botVoiceChannel && botVoiceChannel !== voiceChannel) {
            return interaction.reply('The bot is already playing in another channel!');
        }

        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
            return interaction.reply('I do not have permission to join the voice channel!');
        }

        if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
            return interaction.reply('I do not have permission to speak in the voice channel!');
        }

        await interaction.deferReply();
        const searchQuery = query;
        
        const result = await player.search(searchQuery);
        interaction.followUp('The song has been added to the queue!');
        await player.play(voiceChannel, result);
    }
};

