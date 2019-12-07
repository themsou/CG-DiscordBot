const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var sendSerieMessage = function sendSerieMessage(json, sName){

  var embed = getSerieEmbed(json, sName);
  client.channels.get(Listener.RECAP_CHANNEL_ID).send({embed}).then(msg => {
    react(msg, ['⭕', '🅾️', '🅱️', '🆎', '🅰️'], 0);
    return msg.id;
  });

}
var createSerieChannel = function createSerieChannel(json, sName){



}
var sendVoteSerieMessage = function sendVoteSerieMessage(json){

  client.channels.get(Listener.VOTE_CHANNEL_ID).send({embed}).then(msg => {

    react(msg, ['👍', '👎', '⚒️'], 0);

    return msg.id;

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
      text: '⭕ Pas vus | 🅾️ Nul | 🅱️ Bof | 🆎 Assez Bien | 🅰️ Génial',
      icon_url: client.user.avatarURL
    }
  }
  return embed;

}
function getVoteSerieEmbed(json, messageId){

  var types = '';
  for(const type of json.sTypes){
    types += '\\' + json.seriesTypes.get(type) + ' ' + type + '\n';
  }

  var users = client.guilds.get('590252893131767808').members.filter(member => {return member.tag == json.user});
  var icon_url = "https://quartierdestissus.com/13056-large_default/rouleau-de-tissu-intisse-noir-50-m.jpg";
  if(users.length >= 1){
    icon_url = users[0].avatarURL;
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
      text: '👍 Je suis pour | 👎 Je suis contre | ⚒️ Modifier',
      icon_url: client.user.avatarURL
    }
  }
  return embed;
}


var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};

module.exports = {
    sendSerieMessage: sendSerieMessage,
    createSerieChannel: createSerieChannel,
    sendVoteSerieMessage: sendVoteSerieMessage
}
