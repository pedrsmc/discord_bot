module.exports = {
    name: "clear",
    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply("❌ Você não tem permissão para relizar este comando!")
        }

        const user = message.author

        const quantity = parseInt(args[0])

        if (isNaN(quantity) || quantity < 1 || quantity > 100) {
            return message.reply('❌ Use: !clear [1-100]')
        }

        const deleted = await message.channel.bulkDelete(quantity, true)
        if (!deleted) return

        await message.channel.send(`✅ ${deleted.size} mensagens deletadas por ${user}.`)
    }
}