const Discord = require("discord.js");

module.exports.run = async (console, message, args) => {
  const sayMessage = args.join(" ");
  message.delete().catch(O_o => {});
  message.channel.send(sayMessage);
};
