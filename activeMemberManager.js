
const EditJsonFile = require("edit-json-file");
const HashMap = require('hashmap');

var day = function day(){

  var members = requireReload('./members.json');
  var currentDay = new Date().getDay();
  var lastDay = new Date().getDay() - 1;
  if(lastDay < 0) lastDay = 6;

  for(var userTag in members){

    var membersMatch = guild.members.filter(member => {return (member.user.tag === userTag)});

    if(membersMatch.size >= 1){

      var member = membersMatch.first();
      if(members[userTag].messages.sended.days === undefined) continue;

      var totalMsgs = 0;
      for(var day in members[userTag].messages.sended.days){
        var msgs = members[userTag].messages.sended.days[day];
        totalMsgs += (msgs === undefined) ? 0 : msgs;
      }

      let file = EditJsonFile('./members.json');
      file.set(userTag + '.messages.sended.days.' + lastDay, 0);
      file.save();

      if(totalMsgs >= 30){
        member.addRole('590542640727064617');
      }else{
        member.removeRole('590542640727064617');
      }

    }else{
      let file = EditJsonFile('./members.json');
      file.unset(userTag);
      file.save();
    }
  }

}
var message = function message(author){

  if(author.bot) return;

  let file = EditJsonFile('./members.json');

  var msgs = file.get(author.tag + '.messages.sended.days.' + new Date().getDay());

  file.set(author.tag + '.messages.sended.days.' + new Date().getDay(), (msgs === undefined) ? 1 : msgs+1);

  file.save();

}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};
module.exports = {
    message: message,
    day: day,
}
