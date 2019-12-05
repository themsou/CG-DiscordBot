const EditJsonFile = require("edit-json-file");

var saveUserAdderData = function saveUserAdderData(userAdder, id){

  let file = EditJsonFile('./seriesAdd/seriesToAdd.json');

  //var path = userAdder.sName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.' + userAdder.user.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var path = id;


  var emojis = [];

  for(var type of userAdder.sTypes){
    emojis[emojis.length] = userAdder.seriesTypes.get(type);
  }

  file.set(path + '.user', userAdder.user.tag);
  file.set(path + '.name', userAdder.sName);

  file.set(path + '.type', userAdder.sTypes);
  file.set(path + '.typeEmojis', emojis);
  file.set(path + '.epTime', userAdder.sTime);
  file.set(path + '.seasonsNumber', userAdder.sSeasons);
  file.set(path + '.epNumber', userAdder.sEp);
  file.set(path + '.description', userAdder.sDesc);

  file.save();

}
var sendAndSaveUserAdderData = function sendAndSaveUserAdderData(userAdder){

  var types = '';
  for(const type of userAdder.sTypes){
    types += '\\' + userAdder.seriesTypes.get(type) + ' ' + type + ', ';
  }
  const embed = {
    color: 16746215,
    author: {
      name: userAdder.user.tag,
      icon_url: userAdder.user.avatarURL
    },
    title: "Ajouter la série " + userAdder.sName,
    fields: [
      {
        name: 'Type·s de la série',
        value: (types === '') ? 'Aucun' : types,
        inline: true
      },{
        name: 'Durée d\'un épisode',
        value: userAdder.sTime + ' minutes',
        inline: true
      },{
        name: 'Nombre de saisons',
        value: userAdder.sSeasons + ' saisons',
        inline: true
      },{
        name: 'Nombre d\'épisodes',
        value: userAdder.sEp + ' épisodes',
        inline: true
      },{
        name: 'Description',
        value: (userAdder.sDesc === '') ? 'Aucune description définie' : userAdder.sDesc
      }
    ],
    footer: {
      text: '👍 Je suis pour | 👎 Je suis contre | ⚒️ Modifier',
      icon_url: client.user.avatarURL
    }
  }

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
    saveUserAdderData: saveUserAdderData,
    sendAndSaveUserAdderData: sendAndSaveUserAdderData,
}
