const HashMap = require('hashmap');
const EditJsonFile = require("edit-json-file");
const Listener = require('./listener.js');

var checkAddSerie = function checkAddSerie(){

  var seriesToVote = requireReload('./seriesToVote.json');
  var seriesToVoteChannel = client.channels.get(Listener.VOTE_CHANNEL_ID);

  for(var messageId in seriesToVote){
    seriesToVoteChannel.fetchMessage(messageId).then(msg => {
      if(msg.reactions.has('👍') && msg.reactions.has('👎') && (!msg.reactions.has('❌'))){
        var up = msg.reactions.get('👍').count;
        var down = msg.reactions.get('👎').count;
        var score = up / Math.sqrt(down); // y=\frac{x}{\sqrt{d}}

        //console.log("Serie " + seriesToVote[msg.id].name + ' is identified with ' + up + ' likes and ' + down + ' dislikes and a score of ' + score + "pts");

        if(score >= (guild.memberCount / 6)){ // Add Serie

          //console.log("Add serie " + seriesToVote[msg.id].name);

          var SeriesManager = requireReload('./seriesManager.js');
          var SeriesMerger = requireReload('./seriesMerger.js');
          var json = SeriesMerger.getSerieFromVoteSerie(seriesToVote[msg.id], '', '');
          SeriesManager.addSerie(json, seriesToVote[msg.id].name);
          new SeriesManager.deleteVoteSerie(msg.id, true);
        }
      }
    });
  }

}

var checkRemoveSerie = function checkRemoveSerie(){

  var series = requireReload('./series.json');
  var seriesChannel = client.channels.get(Listener.RECAP_CHANNEL_ID);

  var seriesScores = new HashMap();
  var maxScore = 0; var minScore = 999; var totalScores = 0; var average = 0;
  for(var sNameTmp in series){
    const sName = sNameTmp;
    seriesChannel.fetchMessage(series[sName].messageId).then(msg => {
      if(msg.reactions.has('🅾️') && msg.reactions.has('🅱️') && msg.reactions.has('🆎') && msg.reactions.has('🅰️')&& (!msg.reactions.has('📌'))){

        var up = (msg.reactions.get('🅰️').count * 2) + msg.reactions.get('🆎').count;
        var down = (msg.reactions.get('🅾️').count * 2) + msg.reactions.get('🅱️').count;
        var score = up / Math.sqrt(down); // y=\frac{a\cdot2+b}{\sqrt{d\cdot2+c}}

        //console.log("Serie " + sName + ' is identified with ' + up + ' +sc and ' + down + ' -sc and a score of ' + score + "pts");

        seriesScores.set(score, sName);
        totalScores += score;
        if(score > maxScore) maxScore = score;
        if(score < minScore) minScore = score;
      }
    });
  }
  setTimeout(function() {
    average = totalScores / seriesScores.size;
    console.log("average = " + average);
    console.log(seriesScores);
    seriesScores.forEach((score, sName) => {
      if((score * 2) < average){

        console.log("Remove serie " + sName);

        var SeriesManager = requireReload('./seriesManager.js');
        var SeriesMerger = requireReload('./seriesMerger.js');
        var json = new SeriesMerger.getVoteSerieFromSerie(series[sName], '', client.user.tag, sName);
        new SeriesManager.addVoteSerie(json, '');
        new SeriesManager.deleteSerie(sName, true, true);

      }
    });
  }, 30 * 1000);

}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};

module.exports = {
    checkAddSerie: checkAddSerie,
    checkRemoveSerie: checkRemoveSerie
}
