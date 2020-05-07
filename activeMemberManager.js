
const EditJsonFile = require("edit-json-file");
const HashMap = require('hashmap');

var day = function day(){

  var members = requireReload('./members.json');
  var currentDay = new Date().getDay();

  // pour chaque membre du json...
  for(var userTag in members){

    // Récupère l'utilisateur sur le guild à partir de son tag dans le json
    var membersMatch = guild.members.filter(member => {return (member.user.tag === userTag)});

    if(membersMatch.size >= 1){

      var member = membersMatch.first();
      if(members[userTag].messages.sended.days === undefined) continue;
      // ---

      // Compte le nombre total de messages envoyés
      var totalMsgs = 0;
      for(var day in members[userTag].messages.sended.days){
        var msgs = members[userTag].messages.sended.days[day];
        totalMsgs += (msgs === undefined) ? 0 : msgs;
      }

      // Ajoute le rôle MembreActif si la personne a envoyé plus de 30 messages
      if(totalMsgs >= 30){
        member.addRole('590542640727064617');
      }else{
        member.removeRole('590542640727064617');
      }

      // Set le nombre de messages envoyés aujourd'hui à 0
      let file = EditJsonFile('./members.json');
      file.set(userTag + '.messages.sended.days.' + currentDay, 0);
      file.save();

    }else{
      // Supprime la personne du json si elle n'est plus présente sur le guild ou si elle a changé de pseudo
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
