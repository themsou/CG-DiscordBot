const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var createSerieChannel = function createSerieChannel(json, sName, callback){

  var types = '';
  for(var type of json.types){
    types += '\\' + type;
    if(type != json.types[json.types.length-1]){
      types += ' / ';
    }
  }
  client.guilds.get('590252893131767808').createChannel(sName, {type: 'text'}).then(channel => {
    channel.setParent(client.channels.get(Listener.RECAP_CHANNEL_ID).parent);
    channel.setTopic(sName + '\n\n'
                      + json.description
                      + '\n\nGenre·s : ' + types
                      + '\nDurée : ' + json.episodeTime + 'mn par épisode, ≈' + Math.floor((json.episodeTime/60) * json.episodeNumber) + 'h'
                      + '\nÉpisodes : ' + json.seasonsNumber + ' Saisons, ' + json.episodeNumber + ' Épisodes');

    callback(channel.id);
  });
}
var sendSerieMessage = async function sendSerieMessage(json, sName, callback){

  var embed = getSerieEmbed(json, sName);
  client.channels.get(Listener.RECAP_CHANNEL_ID).send({embed}).then(msg => {
    react(msg, ['⚒️', '⭕', '🅾️', '🅱️', '🆎', '🅰️'], 0);
    callback(msg.id);
  });

}
var sendVoteSerieMessage = function sendVoteSerieMessage(json, callback){

  var embed = getVoteSerieEmbed(json);
  client.channels.get(Listener.VOTE_CHANNEL_ID).send({embed}).then(msg => {
    react(msg, ['⚒️', '👍', '👎'], 0);
    callback(msg.id);
  });

}

function getSerieEmbed(json, sName){

  var types = '';
  for(var type of json.types){
    types += '\\' + type + '\n';
  }
  const embed = {
    color: 16746215,
    title: sName,
    fields: [
      {
        name: 'Type·s de la série',
        value: (types === '') ? 'Aucun' : types,
        inline: true
      },{
        name: 'Épisodes / Saisons',
        value: json.seasonsNumber + ' Saisons\n' + json.episodeNumber + ' Épisodes de ' + json.episodeTime + ' min\nEnviron ' + Math.floor((json.episodeTime/60) * json.episodeNumber) + "h",
        inline: true
      },{
        name: 'Description',
        value: json.description
      }
    ],
    footer: {
      text: '⚒️ Éditer | ⭕ Pas vus | 🅾️ Nul | 🅱️ Bof | 🆎 Assez Bien | 🅰️ Génial',
      icon_url: client.user.avatarURL
    }
  }
  return embed;

}
function getVoteSerieEmbed(json){

  var types = '';
  var i = 0;
  for(const type of json.types){
    types += '\\' + json.typesEmojis[i] + ' ' + type + '\n';
    i++;
  }

  var members = client.guilds.get('590252893131767808').members.filter(member => {return (member.user.tag === json.user)});
  var icon_url = "https://quartierdestissus.com/13056-large_default/rouleau-de-tissu-intisse-noir-50-m.jpg";
  if(members.size >= 1){
    icon_url = members.first().user.avatarURL;
  }

  const embed = {
    color: 16746215,
    author: {
      name: json.user,
      icon_url: icon_url
    },
    title: "Ajouter la série " + json.name,
    fields: [
      {
        name: 'Type·s de la série',
        value: (types === '') ? 'Aucun' : types,
        inline: true
      },{
        name: 'Épisodes / Saisons',
        value: json.seasonsNumber + ' Saisons\n' + json.episodeNumber + ' Épisodes de ' + json.episodeTime + ' min\nEnviron ' + Math.floor((json.episodeTime/60) * json.episodeNumber) + "h",
        inline: true
      },{
        name: 'Description',
        value: (json.description === '') ? 'Aucune description définie' : json.description
      }
    ],
    footer: {
      text: '⚒️ Éditer | 👍 Je suis pour | 👎 Je suis contre',
      icon_url: client.user.avatarURL
    }
  }
  return embed;
}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};
function react(msg, emojis, index){
  if(emojis.length > index+1){
    msg.react(emojis[index]).then(() => react(msg, emojis, index+1));
  }else{
    msg.react(emojis[index]);
  }
}

module.exports = {
    sendSerieMessage: sendSerieMessage,
    createSerieChannel: createSerieChannel,
    sendVoteSerieMessage: sendVoteSerieMessage
}
