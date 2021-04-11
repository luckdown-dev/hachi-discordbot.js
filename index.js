const express = require("express");
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(
    `Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`
  );
  response.sendStatus(200);
});
app.listen(process.env.PORT); // Recebe solicitações que o deixa online

// Constantes
const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } }, { partials: ["MESSAGE", "CHANNEL", "REACTION"] }); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos
const size = config.colors;
const rainbow = new Array(size);

for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

    rainbow[i] = '#' + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
}

let place = 0;
const servers = config.servers;

function changeColor() {
    for (let index = 0; index < servers.length; ++index) {
        let server = client.guilds.cache.get(servers[index]);
        if (!server) {
            if (config.logging) {
                console.log(`[Rainbow-Role] Server ${servers[index]} was not found. Skipping.`);
            }
            continue;
        }

        let role = server.roles.cache.find(r => r.id === config.roleID);
        if (!role) {
            if (config.logging) {
                console.log(`[Rainbow-Role] The role ${config.roleID} was not found on the server ${servers[index]}. Skipping.`);
            }
            continue;
        }

        role.setColor(rainbow[place]).catch(console.error);

        if (config.logging) {
            console.log(`[Rainbow-Role] Mudou a cor para ${rainbow[place]} no server: ${servers[index]}`);
        }
    }

    if (place == (size - 1)) {
        place = 0;
    } else {
        place++;
    }
}

// Eventos
client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(config.prefix)) return;
  if (
    message.content.startsWith(`<@!${client.user.id}>`) ||
    message.content.startsWith(`<@${client.user.id}>`)
  )
    return;

  const args = message.content
    .trim().slice(config.prefix.length)
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  }
  catch (err) {
    console.error("Erro:" + err);
  }
});

//welcome
client.on("guildMemberAdd", async (member) => {

  let guild = client.guilds.cache.get("790937909691023380"); //id do servidor
  let channel = client.channels.cache.get("791004302075494450"); // id do canal
  let emoji = member.guild.emojis.cache.find(emoji => emoji.name === "welcomeglitch"); //nome do emoji no servidor
  let emoji2 = member.guild.emojis.cache.find(emoji => emoji.name === "heartbeat_anim")
  if (guild != member.guild) {
    return console.log("Sem boas-vindas pra você!");
  }
  else {
    let embed = new Discord.MessageEmbed()
      .setColor("#7F06FC")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Boas-vindas ${emoji}`)
      .setImage("https://i.imgur.com/CySXJDb.gif")
      .setDescription(`**${member.user}**, bem-vindo(a) ao servidor **${guild.name}**! Atualmente estamos com **${member.guild.memberCount} membros**, divirta-se conosco! ${emoji2}`)
      .addField('👔 Cargos!', 'Saiba um pouco melhor como funciona o sistema de cargos em: <#790938491378597969>')
      .addField('👮 Evite punições!', 'Leia as nossas <#790938442804101150> para evitar ser punido no servidor!')
      .addField('📛 Precisando de ajuda?', 'Caso você tenha alguma dúvida ou problema, abra um ticket em: <#790987045471649834>')
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter('🛡 ID do usuário: ' + member.user.id)
      .setTimestamp();

    await channel.send(embed);
  }
});

//leave
client.on("guildMemberRemove", async (member) => {
  let guild = client.guilds.cache.get("790937909691023380"); //id do servidor
  let channel = client.channels.cache.get("790941745709187092"); // id do canal
  let emoji = member.guild.emojis.cache.find(emoji => emoji.name === "SataniaCry"); //nome do emoji no servidor
  if (guild != member.guild) {
    return console.log("Sem boas-vindas pra você! Sai daqui saco pela.");
  }
  else {
    let embed = new Discord.MessageEmbed()
      .setColor("#FF0000")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${emoji} Espero que volte logo ${emoji}`)
      .setDescription(`**${member.user}**, acaba de sair de **${guild.name}**!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
      .setFooter('🛡 ID do usuário: ' + member.user.id)
      .setTimestamp();

    await channel.send(embed);
  }
});
// Status 
client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}!`);
  console.log("Estou Online!")
  if (config.speed < 60000) {
      console.log("The minimum speed is 60.000, if this gets abused your bot might get IP-banned");
      process.exit(1);
  }
  setInterval(changeColor, config.speed);
  changeColor();
  let activities = [
    //`${config.prefix}help para obter ajuda.`,
    `${client.guilds.cache.size} servidores.`,
    `${client.channels.cache.size} canais.`,
    `${client.users.cache.size} usuários.`,
  ],
    i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ %
    activities.length]}`, {
      type: "WATCHING" // WATCHING, LISTENING, PLAYING, STREAMING
    }), 1000 * 10);
  client.user
    .setStatus("online") // idle, dnd, online, invisible
    .catch(console.log);
});

client.login(process.env.TOKEN); //Ligando o Bot caso ele consiga acessar o token