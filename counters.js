var refreshCounters = function refreshCounters(msg){

  var countersCath = client.channels.get("590545803517362206");
  var membersChannel = client.channels.get("590544838324256779");
  var membersActiveChannel = client.channels.get("707943778274639973");

  var onlineMembersCount = guild.members.filter(member => {return (!member.user.bot) && (member.user.presence.status === 'dnd' || member.user.presence.status === 'online' || member.user.presence.status === 'idle')}).size;
  var membersCount = guild.members.filter(member => !member.user.bot).size;
  var membersActiveCount = guild.members.filter(member => member.roles.find(r => r.id === "590542640727064617")).size;

  membersChannel.setName('Membres : ' + membersCount);
  membersActiveChannel.setName('Membres actifs : ' + membersActiveCount);
  countersCath.setName('STATISTIQUES (' + onlineMembersCount + '/' + membersCount + ')');

}
module.exports = {
    refreshCounters: refreshCounters,
}
