require('dotenv').config({ path: './src/.env' })
const { Client, GatewayIntentBits } = require('discord.js')

const on = require('./commands/on.js')
const clear = require('./commands/clear.js')
const kick = require('./commands/kick.js')

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

client.on('guildMemberAdd', (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'geral')

    const embed = {
        title: '🎉 Novo Membro!',
        description: `Bem-vindo(a) ${member.user.tag}!`,
        thumbnail: { url: member.user.displayAvatarURL() },
        color: 0x00ff00
    }

    channel.send({ embeds: [embed] })
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

    if (commandName === 'kick') {
        kick.execute(message, args)
    }
})

client.login(process.env.DISCORD_TOKEN)