var auth = require('./auth.json');
const Discord = require('discord.js');
const Listener = require('./seriesAdd/listener.js');
global.client = new Discord.Client();

client.on('ready', () => {
  console.log(`Connexion en tant que ${client.user.tag}!`);

  client.user.setActivity("Bienvenue sur ce serveur !");

});

client.on('message', msg => {

  new Listener.onMessage(msg);

});
client.on('messageReactionAdd', (msgReaction, user) => {
  new Listener.onMessageReactionAdd(msgReaction.message, msgReaction.emoji, user);
});
client.on('messageReactionRemove', (msgReaction, user) => {
  new Listener.onMessageReactionRemove(msgReaction.message, msgReaction.emoji, user);
});

// EMBED EXAMPLE
/*const embed = {
  color: 16746215,
  author: {
    name: "msg.author.username",
    icon_url: "msg.author.avatarURL"
  },
  title: "Test Embed",
  url: "https://google.com",
  description: "Description",
  fields: [{
    name: "Catégorie",
    value: "contenu"
  },
  {
    name: "Catégorie",
    value: "contenu"
  }],
  timestamp: new Date(),
  footer: {
    value: "msg.author.username",
    icon_url: "msg.author.avatarURL"
  }
}
*/
/*client.on('message', msg => {
  if(msg.content === 'ping'){

    msg.reply('Pong!');

    msg.react('👍').then(() => msg.react('👎'));

    const filter = (reaction, user) => {
    	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };

    msg.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] }).then(collected => {

    		const reaction = collected.first();
    		if(reaction.emoji.name === '👍'){
    			msg.reply('Moi aussi, j\'approuve');
    		}else{
    			msg.reply(';(');
    		}

    	}).catch(collected => {
    		msg.reply('Hello !');
    	});
  }
});*/

client.login(auth.token);
