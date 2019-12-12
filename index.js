console.log('Loading index.js ...');
var auth = require('./auth.json');
const Discord = require('discord.js');
const Listener = require('./seriesManager/listener.js');
const Counters = require('./counters.js');
const Cron = require('./cron.js');
global.client = new Discord.Client({autofetch:[
    'MESSAGE_DELETE',
    'MESSAGE_CREATE',
    'MESSAGE_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
]});

client.on('ready', () => {
  console.log(`Connexion en tant que ${client.user.tag}!`);

  client.user.setActivity("Bienvenue sur ce serveur !");
  new Counters.refreshCounters();
  Cron.setup();

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
  Listener.onMessage(msg);

  var emojis = ['🎁', '🥳', '🤟', '👋', '🙌', '👏', '🎉']

  if(msg.channel.id === '651884727141138462'){ // #Présentations
    var r = Math.floor(Math.random() * Math.floor(7));
    msg.react(emojis[r]);
    if(Math.floor(Math.random() * Math.floor(5)) === 0){
      var r = Math.floor(Math.random() * Math.floor(7));
      msg.react(emojis[r]);
    }

  }else if(msg.channel.id === '593313570909847592'){ // #Idées
    react(msg, ['👍', '👎'], 0);
  }

});
client.on('messageReactionAdd', (msgReaction, user) => {
  Listener.onMessageReactionAdd(msgReaction.message, msgReaction.emoji, user);
});
client.on('messageReactionRemove', (msgReaction, user) => {
  if(msgReaction != undefined){
    Listener.onMessageReactionRemove(msgReaction.message, msgReaction.emoji, user);
  }
});
client.on('messageDelete', (msg) => {
  if(msg != undefined){
    Listener.onDeleteMessage(msg);
  }
});
client.on('channelDelete', (channel) => {
  if(channel != undefined){
    Listener.onDeleteChannel(channel);
  }
});

client.on('raw', packet => {
  if(['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)){

    const channel = client.channels.get(packet.d.channel_id);
    if(channel.messages.has(packet.d.message_id)) return;

    channel.fetchMessage(packet.d.message_id).then(message => {

      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      const reaction = message.reactions.get(emoji);

      if(reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));

      if(packet.t === 'MESSAGE_REACTION_ADD'){
          client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
      }
      if(packet.t === 'MESSAGE_REACTION_REMOVE'){
          client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id));
      }
    });

  }else if(['MESSAGE_DELETE'].includes(packet.t)){

    const channel = client.channels.get(packet.d.channel_id);
    if(channel.messages.has(packet.d.id)) return;
    if(packet.t === 'MESSAGE_DELETE'){
      Listener.onDeleteRawMessage(packet.d.id, packet.d.channel_id);
    }
  }
});


function react(msg, emojis, index){
  if(emojis.length > index+1){
    msg.react(emojis[index]).then(() => react(msg, emojis, index+1));
  }else{
    msg.react(emojis[index]);
  }
}

client.login(auth.token);
console.log('Bot logging in...');
