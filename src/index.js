require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

client.once('ready', () => {
    console.log(`✅ Bot online: ${client.user.tag}`)
    console.log(`📊 Servidores: ${client.guilds.cache.size}`)
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (!message.content.startsWith('!')) return

    const args = message.content.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    if (command == "ping") {
        await message.reply('Pong! 🏓')
    }
})

client.login(process.env.DISCORD_TOKEN)