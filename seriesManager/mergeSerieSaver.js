const EditJsonFile = require("edit-json-file");

var saveUserAdderData = function saveData(voteMessageId, id){

  let file = EditJsonFile('./seriesManager/series.json');
  var seriesToVote = require('./seriesToVote.json');

  var toVote = seriesToVote[voteMessageId];
  var sName = toVote.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  var types = []; var i = 0;
  for(var type of toVote.type){
    types[types.length] = toVote.typeEmojis[i] + ' ' + type;
    i++;
  }

  file.set(sName + '.name', toVote.name);

  file.set(sName + '.types', types);
  file.set(sName + '.epTime', toVote.epTime);
  file.set(sName + '.seasonsNumber', toVote.seasonsNumber);
  file.set(sName + '.epNumber', toVote.epNumber);
  file.set(sName + '.description', toVote.description);
  file.set(sName + '.id', id);

  file.save();

}
var sendData = function sendData(voteMessageId){

  var seriesToVote = require('./seriesToVote.json');
  var toVote = seriesToVote[voteMessageId];

  var types = ''; var i = 0;
  for(var type of toVote.type){
    types += toVote.typeEmojis[i] + ' ' + type + '\n';
    i++;
  }
  const embed = {
    color: 16746215,
    title: toVote.name,
    fields: [
      {
        name: 'Type·s de la série',
        value: (types === '') ? 'Aucun' : types,
        inline: true
      },{
        name: 'Épisodes / Saisons',
        value: toVote.seasonsNumber + ' Saisons - ' + toVote.epNumber + ' Eps de ' + toVote.epTime + ' min',
        inline: true
      },{
        name: 'Description',
        value: toVote.description
      }
    ],
    footer: {
      text: '👍 Je suis pour | 👎 Je suis contre | ⚒️ Modifier',
      icon_url: client.user.avatarURL
    }
  }
}
var sendAndSaveData = function sendAndSaveData(){



  client.channels.get("650735233276313630").send({embed}).then(msg => {

    react(msg, ['👍', '👎', '⚒️'], 0);
    saveUserAdderData(userAdder, msg.id)
    userAdder.channel.send('<@' + userAdder.user.id + '>, La série a bien été enregistrée !');
    userAdder.users.delete(userAdder.user.tag);

  });
}
function react(msg, emojis, index){
  if(emojis.length > index+1){
    msg.react(emojis[index]).then(() => react(msg, emojis, index+1));
  }else{
    msg.react(emojis[index]);
  }
}

module.exports = {
    saveData: saveData,
    sendAndSaveData: sendAndSaveData,
}
