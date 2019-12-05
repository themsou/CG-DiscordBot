var auth = require('./auth.json');
const Discord = require('discord.js');
const Listener = require('./seriesAdd/listener.js');
const Counters = require('./counters.js');
global.client = new Discord.Client();

client.on('ready', () => {
  console.log(`Connexion en tant que ${client.user.tag}!`);

  client.user.setActivity("Bienvenue sur ce serveur !");
  new Counters.refreshCounters();

});

client.on('guildMemberAdd', () => {
  new Counters.refreshCounters();
});
client.on('guildMemberRemove', () => {
  new Counters.refreshCounters();
});
client.on('presenceUpdate', (oldMember, newMember) => {
  new Counters.refreshCounters();
});

client.on('message', msg => {
  new Listener.onMessage(msg);
});
client.on('messageReactionAdd', (msgReaction, user) => {
  new Listener.onMessageReactionAdd(msgReaction.message, msgReaction.emoji, user);
});
client.on('messageReactionRemove', (msgReaction, user) => {
  new Listener.onMessageReactionRemove(msgReaction.message, msgReaction.emoji, user);
});

client.on('raw', packet => {
  if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  const channel = client.channels.get(packet.d.channel_id);
  if (channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    const reaction = message.reactions.get(emoji);
    if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
    if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
    }
    if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
    }
  });
});

client.login(auth.token);
