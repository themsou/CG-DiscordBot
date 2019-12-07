const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var deleteSerie = function deleteSerie(sName, deleteMessage, deleteChannel){

  let file = EditJsonFile('./seriesManager/series.json');
  if(file.get(sName) != null){

    if(deleteMessage){
      client.channels.get(Listener.RECAP_CHANNEL_ID).fetchMessage(file.get(sName + ".id")).then((msg) => msg.delete());
    }if(deleteChannel){
      client.channels.get(file.get(sName + ".channelid")).delete();
    }

    file.unset(sName);
    file.save();
  }
}
var deleteVoteSerie = function deleteVoteSerie(id, deleteMessage){

  let file = EditJsonFile('./seriesManager/seriesToVote.json');
  if(file.get(id) != null){

    if(deleteMessage){
      client.channels.get(Listener.VOTE_CHANNEL_ID).fetchMessage(id).then((msg) => msg.delete());
    }

    file.unset(id);
    file.save();
  }

}

var addSerie = function addSerie(json, sName){

  if(json.messageId == ''){
    const SeriesMessager = require('./seriesMessager.js');
    json.messageId = SeriesMessager.sendSerieMessage(json, sName);
  }if(json.channelId == ''){
    const SeriesMessager = require('./seriesMessager.js');
    json.channelId = SeriesMessager.createSerieChannel(json, sName);
  }

  saveSerieJson(json, sName);
}
var addVoteSerie = function addVoteSerie(json, messageId){

  if(messageId == ''){
    const SeriesMessager = require('./seriesMessager.js');
    messageId = SeriesMessager.sendVoteSerieMessage(json);
  }
  saveVoteSerieJson(json, messageId);
}

var saveSerieJson = function saveSerie(json, sName){
  let file = EditJsonFile('./seriesManager/series.json');
  file.set(sName, json);
  file.save();
}
var saveVoteSerieJson = function saveVoteSerie(json, messageId){
  let file = EditJsonFile('./seriesManager/seriesToVote.json');
  file.set(messageId, json);
  file.save();
}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};

module.exports = {
    deleteSerie: deleteSerie,
    deleteVoteSerie: deleteVoteSerie,
    addSerie: addSerie,
    addVoteSerie: addVoteSerie
}
