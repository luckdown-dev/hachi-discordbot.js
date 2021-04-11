const Discord = require('discord.js');

exports.run = async (client, message, args ) => {

  message.delete();
  const content = args.join(" ");
  let yes = message.guild.emojis.cache.find(emoji => emoji.name === "accepted");
  let no = message.guild.emojis.cache.find(emoji => emoji.name === "rejected");
  let neutro = message.guild.emojis.cache.find(emoji => emoji.name === "null")
  if (!args[0]) {
    return message.channel.send(`${message.author.username}, escreva a seguestão após o comando.`)
  } else if (content .length > 1000) {
    return message.channel.send(`${message.author.username}, forneça uma sugestão de no máximo 1000 caracteres.`)
  } else {
    var canal = message.guild.channels.cache.find(ch => ch.id === "790938607229468703") //ID do canal
    const msg = await canal.send(
      new Discord.MessageEmbed()
      .setColor("#7F06FC")
      .addField("Autor:", message.author)
      .addField("Conteúdo", content)
      .setFooter("🛡 ID do Autor: " + message.author.id)
      .setTimestamp()
    );
    await message.channel.send(`${message.author} a mensagem foi enviada com sucesso!`)

    const emojis = [`${yes}`, `${neutro}`, `${no}`]

    for (const i in emojis) {
      await msg.react(emojis[i])
    }
  }

}