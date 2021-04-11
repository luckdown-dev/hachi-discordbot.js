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