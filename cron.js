var CronJob = require('cron').CronJob;
const HashMap = require('hashmap');
const Listener = require('./seriesManager/listener.js');

var setup = function setup(){

  const job = new CronJob('0 0 0 * * *', function() {

    var seriesToVote = requireReload('./seriesManager/seriesToVote.json');
    var series = requireReload('./seriesManager/series.json');
    var seriesToVoteChannel = client.channels.get(Listener.VOTE_CHANNEL_ID);
    var seriesChannel = client.channels.get(Listener.RECAP_CHANNEL_ID);

    for(var messageId in seriesToVote){
      seriesToVoteChannel.fetchMessage(messageId).then(msg => {
        if(msg.reactions.has('👍') && msg.reactions.has('👎') && (!msg.reactions.has('❌'))){
          var up = msg.reactions.get('👍').count;
          var down = msg.reactions.get('👎').count;
          var score = up / Math.sqrt(down); // y=\frac{x}{\sqrt{d}}

          console.log("Serie " + seriesToVote[messageId].name + ' is identified with ' + up + ' likes and ' + down + ' dislikes and a score of ' + score + "pts");

          if(score >= 5){ // Add Serie

            console.log("Add serie " + seriesToVote[messageId].name);

            var SeriesManager = requireReload('./seriesManager/seriesManager.js');
            var SeriesMerger = requireReload('./seriesManager/seriesMerger.js');
            var json = SeriesMerger.getSerieFromVoteSerie(seriesToVote[messageId], '', '');
            SeriesManager.addSerie(json, seriesToVote[messageId].name);
            new SeriesManager.deleteVoteSerie(messageId, true);
          }
        }
      });
    }

    var seriesScores = new HashMap();
    var maxScore = 0; var minScore = 999; var totalScores = 0; var average = 0;
    for(var sName in series){
      seriesChannel.fetchMessage(series[sName].messageId).then(msg => {
        if(msg.reactions.has('🅾️') && msg.reactions.has('🅱️') && msg.reactions.has('🆎') && msg.reactions.has('🅰️')&& (!msg.reactions.has('📌'))){

          var up = (msg.reactions.get('🅰️').count * 2) + msg.reactions.get('🆎').count;
          var down = (msg.reactions.get('🅾️').count * 2) + msg.reactions.get('🅱️').count;
          var score = up / Math.sqrt(down); // y=\frac{a\cdot2+b}{\sqrt{d\cdot2+c}}

          console.log("Serie " + sName + ' is identified with ' + up + ' +sc and ' + down + ' -sc and a score of ' + score + "pts");

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

          var SeriesManager = requireReload('./seriesManager/seriesManager.js');
          var SeriesMerger = requireReload('./seriesManager/seriesMerger.js');
          var json = new SeriesMerger.getVoteSerieFromSerie(series[sName], '', client.user.tag, sName);
          new SeriesManager.addVoteSerie(json, '');
          new SeriesManager.deleteSerie(sName, true, true);

        }
      });
    }, 30 * 1000);


  }, null, true, 'Europe/Paris');
  job.start();

  console.log("Cron tasks are started !");

}
var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};
module.exports = {
  setup: setup
}
