const EditJsonFile = require("edit-json-file");
const HashMap = require('hashmap');
const auth = require('./auth.json');

var update = function update(){

  const { IgApiClient } = require("instagram-private-api");
  const ig = new IgApiClient();
  const Discord = require('discord.js');
  const ACTU_CHANNEL_ID = "727193036911804428";

  // You must generate device id's before login.
  // Id's generated based on seed
  // So if you pass the same value as first argument - the same id's are generated every time
  ig.state.generateDevice("clement__gre");
  // Optionally you can setup proxy url
  //ig.state.proxyUrl = process.env.IG_PROXY;
  (async () => {
    // Execute all requests prior to authorization in the real Android application
    // Not required but recommended
    await ig.simulate.preLoginFlow();
    const loggedInUser = await ig.account.login("clement__gre", auth.impass);
    const netflixId = await ig.user.getIdByUsername("netflixfr");

    // The same as preLoginFlow()
    // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    // Create UserFeed instance to get loggedInUser's posts
    const userFeed = ig.feed.user(netflixId);
    // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
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
    update: update,
}
