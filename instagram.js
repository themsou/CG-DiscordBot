const EditJsonFile = require("edit-json-file");
const HashMap = require('hashmap');
const auth = require('./auth.json');
const Discord = require('discord.js');
const ACTU_CHANNEL_ID = "727193036911804428";
const GUILD1_NETFLIX_CHANNEL_ID = "721424951986487326";
const Crypter = require('./crypter.js');

var updatePosts = function updatePosts(){

  const { IgApiClient } = require("instagram-private-api");
  const ig = new IgApiClient(); 

  ig.state.generateDevice("themsbot_ldv");
  (async () => {
    await ig.simulate.preLoginFlow();

    const loggedInUser = await ig.account.login("themsbot_ldv", auth.impass);
    const netflixId = await ig.user.getIdByUsername("netflixfr");

    process.nextTick(async () => await ig.simulate.postLoginFlow());

    // Logged
    console.log("Logged to Instagram !");
    
    const userFeed = ig.feed.user(netflixId);
    const firstPage = await userFeed.items();

    var data = requireReload('./data.json');
    if(data.lastNetflixPostId != firstPage[0].id){
      let file = EditJsonFile('./data.json');
      file.set('lastNetflixPostId', firstPage[0].id);
      file.save();

      var imagesUrl = [];
      if(firstPage[0].image_versions2 != undefined){
        imagesUrl.push(firstPage[0].image_versions2.candidates[0].url);
      }else if(firstPage[0].carousel_media != undefined){
        for(const image in firstPage[0].carousel_media){
          imagesUrl.push(firstPage[0].carousel_media[image].image_versions2.candidates[0].url);
        }
      }

      var i = 0;
      for(const imageUrl in imagesUrl){
        var embed = new Discord.RichEmbed()
          .setAuthor("@netflixfr", firstPage[0].user.profile_pic_url)
          .setFooter('Depuis Instagram\nID=' + firstPage[0].id, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/480px-Instagram_icon.png")
          .setTimestamp()
          .setImage(imagesUrl[i]);

        if(i == 0){
          embed = embed
          .setDescription(firstPage[0].caption.text)
          .setColor("#cd0000");
        }else{
          embed = embed
          .setDescription("Image n°" + (i+1))
          .setColor("#530000");
        }

        await client.channels.get(ACTU_CHANNEL_ID).send({embed}).then(msg => {
          if(i == 0){
            react(msg, ['📺', '🤔', '😱', '👌', '🤬', '❤️'], 0);
          }
        });
        /*await client.channels.get(GUILD1_NETFLIX_CHANNEL_ID).send({embed}).then(msg => {
          if(i == 0){
            react(msg, ['📺', '🤔', '😱', '👌', '🤬', '❤️'], 0);
          }
        });*/
        i++;
      }
    }
  })();
}

var userRegister = function userRegister(user, userName, password, channel){
  const { IgApiClient } = require("instagram-private-api");
  const ig = new IgApiClient(); 

  channel.send("Connexion à Instagram...");
  ig.state.generateDevice(userName);
  (async () => {
    try{
      await ig.simulate.preLoginFlow();
      const loggedInUser = await ig.account.login(userName, password);
      process.nextTick(async () => await ig.simulate.postLoginFlow());

      channel.send("Votre compte est maintenant connecté à instagram !\nVous pouvez supprimer votre message pour plus de sécurité.");
    
      var encryptedPassword = Crypter.encrypt(password);
      let file = EditJsonFile('./members.json');
      file.set(user.tag + '.instagram.login.userName', userName);
      file.set(user.tag + '.instagram.login.encryptedPassword', encryptedPassword);
      file.save();
    
    }catch(e){
      channel.send("Impossible de se connecter à Instagram : " + e);
    }
  })();
}
var userLike = function userLike(user, postId, unlike, msg, emoji){

  const members = requireReload('./members.json');
  var userName = undefined;
  var password = undefined;
  
  if(members[user.tag] != undefined){
    if(members[user.tag].instagram != undefined){
      if(members[user.tag].instagram.login != undefined){
        if(members[user.tag].instagram.login.userName != undefined){
          userName = members[user.tag].instagram.login.userName;
        }
        if(members[user.tag].instagram.login.encryptedPassword != undefined){
          password = Crypter.decrypt(members[user.tag].instagram.login.encryptedPassword);
        }
      }
    }
  }
  
  if(userName === undefined || password === undefined){
    user.send("Votre compte n'est pas lié à Instagram donc vous ne pouvez pas liker/unliker ce post.\nUtilisez la commande ``linkinsta <pseudo> <mot de passe>`` pour lier votre compte à Instagram.");
    msg.reactions.forEach(r => {if(r.emoji.name === emoji) r.remove(user.id)});
    return;
  }

  const { IgApiClient } = require("instagram-private-api");
  const ig = new IgApiClient(); 

  //ig.state.proxyUrl = process.env.IG_PROXY;
  ig.state.generateDevice(userName);
  (async () => {
    try{
      await ig.simulate.preLoginFlow();
      const loggedInUser = await ig.account.login(userName, password);
      process.nextTick(async () => await ig.simulate.postLoginFlow());

      try{
          if(!unlike){
            await ig.media.like({
              mediaId: postId,
              moduleInfo: {
                module_name: 'profile',
                user_id: loggedInUser.pk,
                username: loggedInUser.username,
              },
              d: 0
            });
          }else{
            await ig.media.unlike({
              mediaId: postId,
              moduleInfo: {
                module_name: 'profile',
                user_id: loggedInUser.pk,
                username: loggedInUser.username,
              },
              d: 0
            });
          }
        }catch(e){
          user.send("Impossible de récupérer le post que vous souhaitez liker : " + e);
          msg.reactions.forEach(r => {if(r.emoji.name === emoji) r.remove(user.id)});
          return;
        }

    }catch(e){
      user.send("Impossible de se connecter à Instagram : " + e + "\nEssayez de re-lier votre compte.");
      msg.reactions.forEach(r => {if(r.emoji.name === emoji) r.remove(user.id)});
      return;
    }
  })();
}
var userComment = function userComment(user, post, comment){
  const { IgApiClient } = require("instagram-private-api");
  const ig = new IgApiClient(); 

  ig.state.proxyUrl = process.env.IG_PROXY;
  ig.state.generateDevice("themsbot_ldv");
  (async () => {
    await ig.simulate.preLoginFlow();

    const loggedInUser = await ig.account.login("themsbot_ldv", auth.impass);
    const netflixId = await ig.user.getIdByUsername("netflixfr");

    process.nextTick(async () => await ig.simulate.postLoginFlow());

    // Logged
    console.log("Logged to Instagram !");
    
    const userFeed = ig.feed.user(netflixId);
    const firstPage = await userFeed.items();

    var data = requireReload('./data.json');
    if(data.lastNetflixPostId != firstPage[0].id){
      let file = EditJsonFile('./data.json');
      file.set('lastNetflixPostId', firstPage[0].id);
      file.save();

      var imagesUrl = [];
      if(firstPage[0].image_versions2 != undefined){
        imagesUrl.push(firstPage[0].image_versions2.candidates[0].url);
      }else if(firstPage[0].carousel_media != undefined){
        for(const image in firstPage[0].carousel_media){
          imagesUrl.push(firstPage[0].carousel_media[image].image_versions2.candidates[0].url);
        }
      }

      var i = 0;
      for(const imageUrl in imagesUrl){
        var embed = new Discord.RichEmbed()
          .setTitle()
          .setAuthor("@netflixfr", firstPage[0].user.profile_pic_url)
          .setFooter('Depuis Instagram', "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/480px-Instagram_icon.png")
          .setImage(imagesUrl[i]);

        if(i == 0){
          embed = embed
          .setDescription(firstPage[0].caption.text)
          .setTitle("Nouveau post de Netflix")
          .setColor("#cd0000");
        }else{
          embed = embed
          .setTitle("Image n°" + (i+1))
          .setColor("#530000");
        }

        await client.channels.get(ACTU_CHANNEL_ID).send({embed}).then(msg => {
          if(i == 0){
            react(msg, ['📺', '🤔', '😱', '👌', '🤬'], 0);
          }
        });
        i++;
      }
    }
  })();
}

function react(msg, emojis, index){
  if(emojis.length > index+1){
    msg.react(emojis[index]).then(() => react(msg, emojis, index+1));
  }else{
    msg.react(emojis[index]);
  }
}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};
module.exports = {
    updatePosts: updatePosts,
    userRegister: userRegister,
    userLike: userLike,
    userComment: userComment,
    ACTU_CHANNEL_ID: ACTU_CHANNEL_ID,
    GUILD1_NETFLIX_CHANNEL_ID: GUILD1_NETFLIX_CHANNEL_ID
}
