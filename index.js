const {
Client,
GatewayIntentBits,
EmbedBuilder,
ButtonBuilder,
ButtonStyle,
ActionRowBuilder,
ChannelType,
PermissionsBitField,
REST,
Routes,
SlashCommandBuilder
} = require("discord.js");

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds
 ]
});

const TOKEN = process.env.BOT_TOKEN;
const CATEGORY_ID = process.env.CATEGORY_ID;

client.once("ready", async () => {

console.log(`✅ Online as ${client.user.tag}`);

const commands = [
 new SlashCommandBuilder()
 .setName("shop")
 .setDescription("فتح المتجر")
].map(command => command.toJSON());


const rest = new REST({version:"10"}).setToken(TOKEN);

await rest.put(
 Routes.applicationCommands(client.user.id),
 {body: commands}
);

console.log("✅ Commands registered");

});


client.on("interactionCreate", async interaction => {

if(interaction.isChatInputCommand()){

if(interaction.commandName === "shop"){

const embed = new EmbedBuilder()
.setTitle("🟣 Nitro Shop")
.setDescription(
"اختر المنتج واضغط شراء 🛒"
)
.setImage("ضع صورة المتجر هنا");


const button = new ButtonBuilder()
.setCustomId("buy")
.setLabel("🛒 شراء")
.setStyle(ButtonStyle.Success);


await interaction.reply({
embeds:[embed],
components:[
new ActionRowBuilder()
.addComponents(button)
]
});

}

}


if(interaction.isButton()){

if(interaction.customId === "buy"){

const channel = await interaction.guild.channels.create({

name:`ticket-${interaction.user.username}`,

type:ChannelType.GuildText,

parent:CATEGORY_ID,

permissionOverwrites:[
{
id:interaction.guild.id,
deny:[
PermissionsBitField.Flags.ViewChannel
]
},
{
id:interaction.user.id,
allow:[
PermissionsBitField.Flags.ViewChannel,
PermissionsBitField.Flags.SendMessages
]
}
]

});


await channel.send(
`🎟️ تكت جديد لـ <@${interaction.user.id}>`
);


interaction.reply({
content:"تم فتح التكت ✅",
ephemeral:true
});

}

}

});


client.login(TOKEN);
