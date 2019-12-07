const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var getSerieFromVoteSerie = function getSerieFromVoteSerie(json, messageId, channelId){

  var serie = {
    episodeTime: json.episodeTime,
    seasonsNumber: json.seasonsNumber,
    episodeNumber: json.episodeNumber,
    description: json.description,
    messageId: messageId,
    channelId: channelId
  };

  for(var type of json['types']){
    serie.types[types.length] = json.typeEmojis[types.length] + ' ' + type;
  }

  return serie;
}
var getVoteSerieFromAsk = function saveVoteSerieFromAsk(addSerieAsk){

  var serieToVote = {
    user: addSerieAsk.user.tag,
    name: addSerieAsk.sName,
    types: addSerieAsk.sTypes,
    episodeTime: addSerieAsk.sTime,
    seasonsNumber: addSerieAsk.sSeasons,
    episodeNumber: addSerieAsk.sEp,
    description: addSerieAsk.sDesc
  };

  for(var type of addSerieAsk.sTypes){
    serieToVote.typesEmojis[serieToVote.typesEmojis.length] = addSerieAsk.seriesTypes.get(type);
  }

  return serieToVote;
}
var getVoteSerieFromSerie = function getVoteSerieFromSerie(json, messageId, user, sName){

  var serieToVote = {
    user: user,
    name: sName,
    types: addSerieAsk.sTypes,
    episodeTime: json.episodeTime,
    seasonsNumber: json.seasonsNumber,
    episodeNumber: json.episodeNumber,
    description: json.description
  };
  for(var type of json.types){
    var name = type.split(' '); name.shift(); name = name.join(' ');
    serieToVote.types[serieToVote.types.length] = name;
    serieToVote.typesEmojis[serieToVote.typesEmojis.length] = type.split(' ')[0];
  }
  return serieToVote;
}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};

module.exports = {
    getSerieFromVoteSerie: getSerieFromVoteSerie,
    getVoteSerieFromAsk: getVoteSerieFromAsk,
    getVoteSerieFromSerie: getVoteSerieFromSerie
}
