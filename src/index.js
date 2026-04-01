require('dotenv').config({ path: './src/.env' })
const { Client, GatewayIntentBits, Events, REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})

client.commands = new Map()
const commands = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file))
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
        commands.push(command.data.toJSON())
        console.log(`✅ Comando carregado: ${command.data.name}`)
    } else {
        console.log(`⚠️ Comando em ${file} está faltando data ou execute`)
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`✅ Bot online: ${readyClient.user.tag}`)
    console.log(`📊 Servidores: ${readyClient.guilds.cache.size}`)

    try {
        await rest.put(
            Routes.applicationCommands(readyClient.user.id),
            { body: commands }
        )
        console.log('✅ Comandos slash registrados globalmente!')
    } catch (error) {
        console.error('❌ Erro ao registrar comandos:', error)
    }
})

client.on(Events.GuildMemberAdd, (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'geral')
    if (!channel) return

    const embed = {
        title: '🎉 Novo membro!',
        description: `Bem-vindo(a), ${member.user.tag}!`,
        thumbnail: { url: member.user.displayAvatarURL() },
        color: 0x00ff00
    }
    channel.send({ embeds: [embed] })
})

client.on(Events.GuildMemberRemove, (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'geral')
    if (!channel) return

    const embed = {
        title: '👋 Até mais!',
        description: `${member.user.tag} saiu do servidor.`,
        thumbnail: { url: member.user.displayAvatarURL() },
        color: 0xff0000
    }
    channel.send({ embeds: [embed] })
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        const errorMessage = { content: '❌ Erro ao executar comando!' }

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage)
        } else {
            await interaction.reply(errorMessage)
        }
    }
})

client.login(process.env.DISCORD_TOKEN)