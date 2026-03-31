require('dotenv').config({ path: './src/.env' })
const { Client, GatewayIntentBits } = require('discord.js')

const on = require('./commands/on.js')
const clear = require('./commands/clear.js')

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
    const commandName = args.shift().toLowerCase()

    if (commandName === 'on') {
        on.execute(message)
    }

    if (commandName === 'clear') {
        clear.execute(message, args)
    }
})

client.login(process.env.DISCORD_TOKEN)