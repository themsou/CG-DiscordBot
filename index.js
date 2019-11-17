console.log('Bonjour le fichier index.js à bien été lançé !');

// Configure logger settings
var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// -END

const Discord = require('discord.js');
const client = new Discord.Client({
  token: auth.token,
  autorun: true
});
var auth = require('./auth.json');



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
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
});
