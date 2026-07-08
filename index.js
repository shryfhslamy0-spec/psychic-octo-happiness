
const {
Client,
GatewayIntentBits,
EmbedBuilder,
ButtonBuilder,
ButtonStyle,
ActionRowBuilder,
ChannelType,
PermissionsBitField
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
 intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages
 ]
});


client.once("ready",()=>{
 console.log(`Logged as ${client.user.tag}`);
});


client.on("messageCreate", async message=>{

 if(message.content === "!shop"){

 const embed = new EmbedBuilder()
 .setTitle("🟣 Nitro Shop")
 .setDescription(`
**المنتجات:**

💎 Nitro Basic
💎 Nitro Boost
💎 Nitro Gift

اضغط الزر للشراء
 `)
 .setImage("ضع رابط صورة المتجر هنا");


 const button = new ButtonBuilder()
 .setCustomId("buy")
 .setLabel("🛒 شراء")
 .setStyle(ButtonStyle.Success);


 const row = new ActionRowBuilder()
 .addComponents(button);


 message.channel.send({
  embeds:[embed],
  components:[row]
 });

 }

});



client.on("interactionCreate", async interaction=>{


if(!interaction.isButton()) return;


if(interaction.customId === "buy"){


let channel = await interaction.guild.channels.create({

name:`ticket-${interaction.user.username}`,

type:ChannelType.GuildText,

parent:config.categoryID,


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


channel.send({
content:`<@${interaction.user.id}>`,
embeds:[
new EmbedBuilder()
.setTitle("🎟️ طلب جديد")
.setDescription(`
اختر المنتج الذي تريده.

💎 Nitro
💳 طريقة الدفع
`)
],

components:[
new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setLabel("إغلاق التذكرة")
.setCustomId("close")
.setStyle(ButtonStyle.Danger)

)

]

});


interaction.reply({
content:"تم فتح التذكرة ✅",
ephemeral:true
});


}



if(interaction.customId === "close"){

interaction.channel.delete();

}


});


client.login(config.token);
