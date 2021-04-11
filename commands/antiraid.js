const Discord = require('discord.js');

exports.run = async(client, message, args) => {

  const role_member = await message.guild.roles.cache.find(r => r.id === "790942398976622602");
  const role_everyone = await message.guild.roles.cache.find(r => r.id === "790937909691023380");
  // adicionar configuração dos levels tbm
  const sender = message.author;

  if (!message.member.roles.cache.some(r => [
    "790942459055308802",
    "790942532896423966",
    "790943060418625546",
    "790942588411576360",
    "790942611266338826",
    "790942665137979392"
  ].includes(r.id))) {
    return message.channel.send(`${sender} este comando é **restrito!**`)
  } else if (message.content.includes("on")) {
      await role_member.setPermissions(1025);
      await role_everyone.setPermissions(0);
      await message.channel.send(`**O sistema de antiraid foi ligado por** ${sender}`)
  } else if (message.content.includes("off")) {
      await role_member.setPermissions(1117249);
      await role_everyone.setPermissions(66625);
      await message.channel.send(`**O sistema de antiraid foi desligado for** ${sender}`);
  } else {
      return message.channel.send(`${sender} a sintaxe correta é h!antiraid *on | off*`)
  }
};
