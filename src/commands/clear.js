const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpa mensagens no canal.')
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Número de mensagens para limpar (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const quantity = interaction.options.getInteger('quantidade')
        const user = interaction.user

        try {
            const deleted = await interaction.channel.bulkDelete(quantity, true)

            if (!deleted || deleted.size === 0) {
                return interaction.reply({
                    content: '❌ Nenhuma mensagem para deletar!',
                })
            }

            await interaction.reply({
                content: `✅ ${deleted.size} mensagens deletadas por ${user}.`,
            })

        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: '❌ Erro ao limpar mensagens! Verifique se as mensagens têm menos de 14 dias.',
            })
        }
    }
}