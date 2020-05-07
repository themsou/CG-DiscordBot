
const EditJsonFile = require("edit-json-file");
const HashMap = require('hashmap');

var join = function join(member){
  var homeChannel = client.channels.get("707942561456586905");
  var emojis = ['🎁', '🥳', '🤟', '👋', '🙌', '👏', '🎉'];

  member.addRole('590538527989563392');

  homeChannel.send("Bienvenue sur Cinéphile Gang <@" + member.user.id + "> !\nTu peux lire le <#590552814057422890> et choisir tes rôles dans <#590537469829578762>. Passe un bon moment sur notre serveur !!").then(msg => {
    var r = Math.floor(Math.random() * Math.floor(7));
    msg.react(emojis[r]);
    if(Math.floor(Math.random() * Math.floor(5)) === 0){
      var r = Math.floor(Math.random() * Math.floor(7));
      msg.react(emojis[r]);
    }
  });

}
var leave = function leave(member){
  var homeChannel = client.channels.get("707942561456586905");
  var emojis = ['😢', '😡', '🥶', '📤', '⁉️', '🧤', '🕵️'];

  homeChannel.send("R.I.P...  " + member.user.tag + " viens de nous quitter").then(msg => {
    var r = Math.floor(Math.random() * Math.floor(7));
    msg.react(emojis[r]);
    if(Math.floor(Math.random() * Math.floor(5)) === 0){
      var r = Math.floor(Math.random() * Math.floor(7));
      msg.react(emojis[r]);
    }
  });

}

module.exports = {
    leave: leave,
    join: join,
}
