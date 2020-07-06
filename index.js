console.log('Loading index.js ...');

const auth = require('./auth.json');
const Cron = require('./cron.js');
const Discord = require('discord.js');
const Listener = require('./seriesManager/listener.js');
const SeriesTask = require('./seriesManager/seriesTask.js');
const ActiveMemberManager = require('./activeMemberManager.js');
const JoinNLeaveMessages = require('./joinNLeaveMessages.js');
const Counters = require('./counters.js');
const Instagram = require('./instagram.js');

global.client = new Discord.Client({autofetch:[
    'MESSAGE_DELETE',
    'MESSAGE_CREATE',
    'MESSAGE_UPDATE',
    'MESSAGE_REACTION_ADD',
    'MESSAGE_REACTION_REMOVE',
]});
global.guild = client.guilds.get('590252893131767808');
global.guild1 = client.guilds.get('719110773191737405');

client.on('ready', () => {
  console.log(`Connexion en tant que ${client.user.tag}!`);
  global.guild = client.guilds.get('590252893131767808');
  global.guild1 = client.guilds.get('719110773191737405');

  client.user.setActivity("BOT Privé, développé par themsou#1296");
  new Counters.refreshCounters();
  Cron.setup();
});

client.on('guildMemberAdd', (member) => {
  if(member.guild.id === guild.id){
    new Counters.refreshCounters();
    new JoinNLeaveMessages.join(member);
  }
});
client.on('guildMemberRemove', (member) => {
  if(member.guild.id === guild.id){
    new Counters.refreshCounters();
    new JoinNLeaveMessages.leave(member);
  }
});
client.on('presenceUpdate', (oldMember, newMember) => {
  new Counters.refreshCounters();
});

client.on('message', msg => {
  if(msg.author.bot) return;

  if(msg.content === "ping"){
    msg.channel.send("Pong - " + (Date.now() - msg.createdTimestamp) + " ms");
    return;
  }
  
  if(msg.channel instanceof Discord.TextChannel){
    if(msg.guild.id === guild.id){
      Listener.onMessage(msg);
      ActiveMemberManager.message(msg.author);

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
    }
  }else{
    var command = msg.content.split(' ')[0];
    var length = msg.content.split(' ').length;
    if(command.toLowerCase() === 'linkinsta' && length == 3){
      var userName = msg.content.split(' ')[1];
      var password = msg.content.split(' ')[2];
      Instagram.userRegister(msg.author, userName, password, msg.channel);
    }else{
      const embed = {
        color: 468468,
        title: "Commandes disponibles :",
        fields: [
          {
            name: 'linkinsta <pseudo instagram> <mot de passe instagram>',
            value: 'Connecter son compte discord à Instagram. Cela permet de liker et commenter des posts directement depuis notre serveur Discord.'
          }
        ],
        footer: {
          text: 'Cinéphile Gang - Communauté Netflix',
          icon_url: client.user.avatarURL
        }
      }
      msg.channel.send({embed});
    }
  }
});
client.on('messageReactionAdd', (msgReaction, user) => {
  if(!user.bot && msgReaction.message.channel.id === Listener.VOTE_CHANNEL_ID && (msgReaction.emoji.name === '👍' || msgReaction.emoji.name === '👎')){
    setTimeout(function() {
      SeriesTask.checkAddSerie();
    }, 5000);
  }
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
