const { Client, GatewayIntentBits, Partials, Routes, REST, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputStyle, SlashCommandBuilder } = require('discord.js');
const { token, clientId, guildId, logChannelId, allowedChannelId } = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const rest = new REST({ version: '10' }).setToken(token);

const commands = [
    new SlashCommandBuilder()
        .setName('start')
        .setDescription('ابدأ اعتراف')
        .toJSON()
];

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const cooldowns = new Map();

client.once('ready', () => {
    console.log(`Bot is Ready as ${client.user.tag}!`);
    console.log(`Code by Wick Studio`);
    console.log(`discord.gg/wicks`);
});

client.on('interactionCreate', async interaction => {
    const now = Date.now();
    const cooldownAmount = 3600000;

    if (interaction.isCommand()) {
        if (interaction.commandName === 'start') {
            if (interaction.channelId !== allowedChannelId) {
                await interaction.reply({ content: 'لا يمكنك استخدام هذا الأمر في هذا الروم.', ephemeral: true });
                return;
            }

            if (cooldowns.has(interaction.user.id)) {
                const expirationTime = cooldowns.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000 / 60;
                    await interaction.reply({ content: `يرجى الانتظار ${timeLeft.toFixed(1)} دقائق قبل إعادة استخدام هذا الأمر.`, ephemeral: true });
                    return;
                }
            }

            const embed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle('🌸 هل تريد أن يكون اعترافك مجهولًا؟ 🌸')
                .setDescription('يرجى اختيار ما إذا كنت تريد أن يكون اعترافك مجهولًا أم لا.');

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('anonymous_yes')
                        .setLabel('مجهول')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('anonymous_no')
                        .setLabel('ليس مجهول')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }
    } else if (interaction.isButton()) {
        if (cooldowns.has(interaction.user.id)) {
            const expirationTime = cooldowns.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60;
                await interaction.reply({ content: `يرجى الانتظار ${timeLeft.toFixed(1)} دقائق قبل إعادة استخدام هذا الأمر.`, ephemeral: true });
                return;
            }
        }

        const modal = new ModalBuilder()
            .setCustomId(interaction.customId === 'anonymous_yes' ? 'confessionModalAnonymous' : 'confessionModalNotAnonymous')
            .setTitle('أرسل اعترافك');

        const confessionInput = new TextInputBuilder()
            .setCustomId('confessionInput')
            .setLabel('اعترافك')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(confessionInput);
        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    } else if (interaction.isModalSubmit()) {
        const isAnonymous = interaction.customId === 'confessionModalAnonymous';
        const confession = interaction.fields.getTextInputValue('confessionInput');
        const user = interaction.user;

        const confessionEmbed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('🌸 اعتراف جديد 🌸')
            .setDescription(`\`\`\`text\n${confession}\n\`\`\``)
            .setThumbnail('https://i.imgur.com/XvMF5sT.png')
            .setTimestamp()
            .setFooter({ text: isAnonymous ? 'اعتراف مجهول' : `By : ${user.tag}`, iconURL: 'https://i.imgur.com/XvMF5sT.png' })
            .setAuthor({ name: 'بوت الاعترافات', iconURL: 'https://i.imgur.com/XvMF5sT.png' });

        await interaction.reply({ content: 'تم إرسال اعترافك.', ephemeral: true });
        await interaction.channel.send({ embeds: [confessionEmbed] });

        const logChannel = await client.channels.fetch(logChannelId);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('📝 تم تسجيل اعتراف 📝')
                .setDescription(`\`\`\`text\n${confession}\n\`\`\``)
                .addFields({ name: 'المستخدم', value: `${user.tag} (ID: ${user.id})` })
                .setTimestamp()
                .setFooter({ text: 'سجل الاعترافات', iconURL: 'https://i.imgur.com/XvMF5sT.png' })
                .setAuthor({ name: 'بوت الاعترافات', iconURL: 'https://i.imgur.com/XvMF5sT.png' });

            await logChannel.send({ embeds: [logEmbed] });
        }

        cooldowns.set(interaction.user.id, now);
    }
});

client.login(token);

process.on('unhandledRejection', (reason, p) => {
    console.log(' [antiCrash] :: Unhandled Rejection/Catch');
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch');
    console.log(err, origin);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
    console.log(err, origin);
});