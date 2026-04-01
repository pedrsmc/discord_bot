const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('on')
        .setDescription('Verifica se o bot está online.'),
    async execute(interaction) {
        await interaction.reply(':green_circle: Estou online.')
    }
}