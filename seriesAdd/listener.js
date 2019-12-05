const UserAdder = require('./userAdder.js');
const HashMap = require('hashmap');

const CHANNEL_ID = "615888027339980800";
const VOTE_CHANNEL_ID = "650735233276313630";
const SERIES_TYPES = new HashMap(
  'Action', '👊🏻',
  'Ados', '🙆‍♀️',
  'Comédie', '🎭',
  'Documentaire', '📚',
  'Drames', '😳',
  'Enfants', '👼',
  'Musique et comédie musicale', '🎵',
  'Humour', '😆',
  'Horreur', '😨',
  'Noël', '🎄',
  'Policier', '👥',
  'Romance', '💕',
  'SF et fantastique', '👽',
  'Stand up et talk shows', '🗣️');
const EMOJI_REGEX = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

var users = new HashMap();

var onMessage = function onMessage(msg){

  var args = msg.content.split(" ");

  if(msg.channel.id == CHANNEL_ID){
    if(args[0] === '/add'){
      if(args.length >= 2){

        args.shift();
        var name = args.join(' ');

        if(users.get(msg.author.tag) == null){
          var userAdder = new UserAdder(users, msg.author, msg.channel, name);
          users.set(msg.author.tag, userAdder);
          userAdder.sendTypeMessage();
        }else{
          msg.reply('une procédure d\'ajout de série est déjà en cours, vous devez l\'annuler');
        }
      }
    }else if(args[0].replace(EMOJI_REGEX, 'a18862256') === 'a18862256'){
      if(args.length >= 2){

        var userAdder = users.get(msg.author.tag);
        if(userAdder != null){
          var emoji = args[0];
          args.shift();
          var name = args.join(' ');
          userAdder.userSendMessageWithReaction(msg, emoji, name);
        }
      }
    }else if(!isNaN(args[0])){

      var userAdder = users.get(msg.author.tag);
      if(userAdder != null){
        userAdder.userSendMessageWithNumber(msg, args[0]);
      }
    }else if(args[0] === '/debug'){

      var content = 'Liste de toute les instances en cours de userAdder (Procédure d\'ajout de série)\n';
      for(const entry of users.entries()){
        content += entry[0] + ' : sName=' + entry[1].sName + ' | status=' + entry[1].status + ' | sType=' + entry[1].sType + ' | sTime=' + entry[1].sTime + '\n';
      }
      msg.channel.send(content);
    }else{
      var userAdder = users.get(msg.author.tag);
      if(userAdder != null){
        userAdder.userSendOtherMessage(msg);
      }
    }
  }
}
var onMessageReactionAdd = function onMessageReactionAdd(msg, emoji, user){

  if(msg.channel.id == CHANNEL_ID){

    var userAdder = users.get(user.tag);
    if(userAdder != null){
      if(userAdder.isCurrent(msg.id)){
        userAdder.userAddReact(emoji);
      }
    }
  }else if(msg.channel.id == VOTE_CHANNEL_ID){

    var seriesToAdd = require('./seriesToAdd.json');


    if(user.bot){
      return;
    }

    if(seriesToAdd[msg.id] != null){
      if(emoji.name === '👍'){

      }else if(emoji.name === '👎'){

      }else if(emoji.name === '⚒️'){

        if(users.get(user.tag) == null){

          var userAdder = new UserAdder(users, user, client.channels.get(CHANNEL_ID), seriesToAdd[msg.id]['name']);
          users.set(user.tag, userAdder);
          userAdder.sTime = seriesToAdd[msg.id]['epTime'];
          userAdder.sTypes = seriesToAdd[msg.id]['type'];
          userAdder.sEp = seriesToAdd[msg.id]['epNumber'];
          userAdder.sSeasons = seriesToAdd[msg.id]['seasonsNumber'];
          userAdder.sDesc = seriesToAdd[msg.id]['description'];

          var i = 0;
          for(var type of seriesToAdd[msg.id]['type']){
            userAdder.seriesTypes.set(type, seriesToAdd[msg.id]['typeEmojis'][i]);
            i++;
          }

          userAdder.sendTypeMessage();

        }else{
          client.channels.get(CHANNEL_ID).send('<@' + user.id + '>, une procédure d\'ajout de série est déjà en cours, vous devez l\'annuler');
        }

      }else if(emoji.name === '❌'){

      }else if(emoji.name === '✅'){

      }
    }

  }
}
var onMessageReactionRemove = function onMessageReactionRemove(msg, emoji, user){

  if(msg.channel.id == CHANNEL_ID){

    var userAdder = users.get(user.tag);
    if(userAdder != null){
      if(userAdder.isCurrent(msg.id)){
        userAdder.userRemoveReact(emoji);
      }
    }
  }
}
module.exports = {
    onMessage: onMessage,
    onMessageReactionAdd: onMessageReactionAdd,
    onMessageReactionRemove: onMessageReactionRemove,
    users: users
}
