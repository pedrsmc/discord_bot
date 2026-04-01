module.exports = {
    name: "kick",
    async execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) {
            return message.reply('❌ Você não tem permissão para expulsar membros!')
        }

        const member = message.mentions.members.first()
        if (!member) {
            return message.reply('❌  Mencione um membro para expulsar!')
        }

        const reason = args.slice(1).join(' ') || 'Não especificado.'

        if (member.id === message.author.id) {
            return message.reply('❌  Você não pode se expulsar!')
        }

        if (!member.kickable) {
            return message.reply('❌  Não tenho permissão para expulsar este membro!')
        }

        try {
            try {
                await member.send(`🔨  Você foi expulso de **${message.guild.name}**\n📝 Motivo: ${reason}`)
            } catch (err) {
            }

            await member.kick(reason)
            await message.reply(`✅  ${member.user.tag} foi expulso!\n\n📝 Motivo: ${reason}`)

        } catch (error) {
            console.error(error)
            await message.reply('❌  Erro ao expulsar membro!')
        }
    }
}