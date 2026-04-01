const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Expulsa um membro do servidor.')
        .addStringOption(option =>
            option.setName('membro')
                .setDescription('Marque o membro que deseja expulsar.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Informe o motivo da expulsão.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const member = interaction.options.getMember('membro');
        const reason = interaction.options.getString('motivo') || 'Motivo não informado';

        if (!member) {
            return interaction.reply({ content: '❌ Membro não encontrado!' });
        }

        if (!member.kickable) {
            return interaction.reply({ content: '❌ Não tenho permissão para expulsar este membro!' });
        }

        await member.kick(reason);
        await interaction.reply(`✅ ${member.user.tag} foi expulso!\n\n📝 Motivo: ${reason}`);
    }
}