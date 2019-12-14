var refreshCounters = function refreshCounters(msg){

  var countersCath = client.channels.get("590545803517362206");
  var membersChannel = client.channels.get("590544838324256779");

  var onlineMembersCount = guild.members.filter(member => {return (!member.user.bot) && (member.user.presence.status === 'dnd' || member.user.presence.status === 'online' || member.user.presence.status === 'idle')}).size;
  var membersCount = guild.members.filter(member => !member.user.bot).size;

  membersChannel.setName('Membres : ' + membersCount);
  countersCath.setName('STATISTIQUES (' + onlineMembersCount + '/' + membersCount + ')');



}
module.exports = {
    refreshCounters: refreshCounters,
}
