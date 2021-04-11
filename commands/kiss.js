const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  var list = [
    'https://i.imgur.com/0E6WyIH.gif',
    'https://i.imgur.com/wgoePWr.gif',
    'https://i.imgur.com/vLCWne7.gif',
    'https://i.imgur.com/Y8ZL7QU.gif',
    'https://i.imgur.com/LG4ePWr.gif',
    'https://i.imgur.com/N0hHQZq.gif'
  ];

  var rand = list[Math.floor(Math.random() * list.length)];
  let user = message.mentions.users.first() || client.users.cache.get(args[0]);
  let emoji = message.guild.emojis.cache.find(emoji => emoji.name === "mwah");
  if (!user) {
    return message.reply('Lembre-se de mencionar um usuário válido!');
  }

  // message.channel.send(`${message.author.username} **acaba de beijar** ${user.username}! :heart:`, {files:[rand]});
  let avatar = message.author.displayAvatarURL({format: "png"});
  const embed = new Discord.MessageEmbed()
    .setTitle(`${emoji} Beijoqueiro(a) ${emoji}`)
    .setColor('#7F06FC')
    .setDescription(`${message.author} acaba de beijar ${user}`)
    .setImage(rand)
    .setTimestamp()
    .setThumbnail(avatar)
    .setFooter("🛡 ID do Autor: " + message.author.id)
    .setAuthor(message.author.tag, avatar);
  await message.channel.send(embed);
};