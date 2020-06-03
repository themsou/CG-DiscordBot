var refreshCounters = function refreshCounters(msg){

  var countersCath = guild.channels.get("590545803517362206");
  var membersChannel = guild.channels.get("590544838324256779");
  var membersActiveChannel = guild.channels.get("707943778274639973");

  var onlineMembersCount = guild.members.filter(member => {return (!member.user.bot) && (member.user.presence.status === 'dnd' || member.user.presence.status === 'online' || member.user.presence.status === 'idle')}).size;
  var membersCount = guild.members.filter(member => !member.user.bot).size;

  var membersApprentisCount = guild.members.filter(member => member.roles.find(r => r.id === "712619370077225010")).size;
  var membersExpertCount = guild.members.filter(member => member.roles.find(r => r.id === "712620267037392916")).size;
  var membersNolifeCount = guild.members.filter(member => member.roles.find(r => r.id === "712620584659451984")).size;
  var membersCinephileCount = guild.members.filter(member => member.roles.find(r => r.id === "712620923131396146")).size;

  countersCath.setName('STATISTIQUES (' + onlineMembersCount + '/' + membersCount + ')');
  membersChannel.setName('Membres : ' + membersCount);
  membersActiveChannel.setName('Actifs : ' + membersApprentisCount + "/" + membersExpertCount + "/" + membersNolifeCount + "/" + membersCinephileCount);


}
module.exports = {
    refreshCounters: refreshCounters,
}
