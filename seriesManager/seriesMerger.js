const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var getSerieFromVoteSerie = function getSerieFromVoteSerie(json, messageId, channelId){

  var serie = {
    types: [],
    seasonsNumber: json.seasonsNumber,
    episodeNumber: json.episodeNumber,
    description: json.description,
    episodeTime: json.episodeTime,
    messageId: messageId,
    channelId: channelId
  };

  for(var type of json['types']){
    serie.types[serie.types.length] = json.typesEmojis[serie.types.length] + ' ' + type;
  }

  return serie;
}
var getVoteSerieFromAsk = function getVoteSerieFromAsk(addSerieAsk){

  var serieToVote = {
    user: addSerieAsk.user.tag,
    name: addSerieAsk.sName,
    types: addSerieAsk.sTypes,
    typesEmojis: [],
    seasonsNumber: addSerieAsk.sSeasons,
    episodeNumber: addSerieAsk.sEp,
    episodeTime: addSerieAsk.sTime,
    description: addSerieAsk.sDesc
  };

  for(var type of addSerieAsk.sTypes){
    serieToVote.typesEmojis[serieToVote.typesEmojis.length] = addSerieAsk.seriesTypes.get(type);
  }

  return serieToVote;
}
var getAskFromVoteSerie = function getAskFromVoteSerie(json, user){

  const AddSerieAsk = require('./addSerieAsk.js');

  var addSerieAsk = new AddSerieAsk(Listener.users, user, client.channels.get(Listener.CMD_CHANNEL_ID), json.name);
  Listener.users.set(user.tag, addSerieAsk);
  addSerieAsk.sTime = json.episodeTime;
  addSerieAsk.sTypes = json.types;
  addSerieAsk.sEp = json.episodeNumber;
  addSerieAsk.sSeasons = json.seasonsNumber;
  addSerieAsk.sDesc = json.description;

  var i = 0;
  for(var type of json.types){
    addSerieAsk.seriesTypes.set(type, json.typesEmojis[i]);
    i++;
  }

  return addSerieAsk;
}
var getVoteSerieFromSerie = function getVoteSerieFromSerie(json, messageId, user, sName){

  var serieToVote = {
    user: user,
    name: sName,
    types: [],
    typesEmojis: [],
    seasonsNumber: json.seasonsNumber,
    episodeNumber: json.episodeNumber,
    episodeTime: json.episodeTime,
    description: json.description,
    messageId: messageId
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
    getVoteSerieFromSerie: getVoteSerieFromSerie,
    getAskFromVoteSerie: getAskFromVoteSerie
}
