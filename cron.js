var CronJob = require('cron').CronJob;
const HashMap = require('hashmap');
const Listener = require('./seriesManager/listener.js');
const SeriesTask = require('./seriesManager/seriesTask.js');
const ActiveMemberManager = require('./activeMemberManager.js');
const Instagram = require('./instagram.js');

var setup = function setup(){

  const job = new CronJob('0 0 5 * * *', function() {

    SeriesTask.checkRemoveSerie();
    ActiveMemberManager.day();

  }, null, true, 'Europe/Paris');
  job.start();

ActiveMemberManager.day();

  const job2 = new CronJob('0 0 * * * *', function() {

    Instagram.updatePosts();

  }, null, true, 'Europe/Paris');
  job2.start();
  Instagram.updatePosts();

  console.log("Cron tasks are started !");
}
module.exports = {
  setup: setup
}
