var CronJob = require('cron').CronJob;
const HashMap = require('hashmap');
const Listener = require('./seriesManager/listener.js');
const SeriesTask = require('./seriesManager/seriesTask.js');

var setup = function setup(){

  const job = new CronJob('0 0 0 * * *', function() {


    SeriesTask.checkRemoveSerie();


  }, null, true, 'Europe/Paris');

  job.start();
  console.log("Cron tasks are started !");

}
module.exports = {
  setup: setup
}
