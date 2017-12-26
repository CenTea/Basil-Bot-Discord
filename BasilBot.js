// Import the discord.js module
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BASIL_TOKEN;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

const prefix = 'Basil';
//var curse = ['fuck', 'bitch'];
//const curseprefix = '';

// Create an event listener for messages
client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
			//message.reply('http://i0.kym-cdn.com/photos/images/original/001/237/094/21c.jpg');
  switch(command){
	case 'add':
		var sum = 0;
		console.log(args.length);
		for (var i = 0; i<args.length; i++)
			{
			if (!isNaN(parseFloat(args[i])))
			sum+=parseFloat(args[i]);
			}
		message.reply('The sum is ' + sum + '.');
		break;
	case 'help':
    		message.reply('\nHi!\nI am Basil.\nCurrently my commands are:\n"Add [args]": I will add numbers.\n"GiveRNG [arg]": I will give a random number given a max.\n"NumberOne": This posts a link to We are number one.\n"TrueNo1": I will play the song for you in your voice channel.\n"Exit": I will leave the voice channel.\nCurrently all commands should be case-insensitive.');
		break;
	case 'numberone':
		message.reply('https://www.youtube.com/watch?v=PfYnvDL0Qcw');
		break;
	case 'giverng':
		if (!isNaN(parseInt(args[0])))
		message.reply(Math.floor(Math.random()*args[0]));
		else
		message.reply('Please give me a max number to work with...');
		break;
	case 'trueno1':
		const channel = message.member.voiceChannel;
		console.log(channel);
		if (channel)
		{
		channel.join();
		const streamOptions = { seek: 0, volume: 1 };
		const stream = ytdl('https://www.youtube.com/watch?v=PfYnvDL0Qcw', { filter : 'audioonly' });
		const dispatcher = channel.connection.playStream(stream, streamOptions);
		message.reply('We are Number one~');
		}
		else 
		{
		message.reply('Get in a channel you PoS.\nCan\'t be No.1 like that.');
		}
		break;
	case 'exit':
		message.member.voiceChannel.leave();
		console.log('Exiting!');
		break;
	case 'whoareyou':
		message.reply('I am Basil Hem!\n');
		break;
	case 'whoami':
		var response = 'You\'re you.\nYou\'re ' + message.member.displayName + ' currently residing in ' + message.member.guild.name + '.\n';
		var addon = ['Did you fall down and hit your head? I hope you\'re alright.', 'Did you really need to ask?']
		message.reply(response+addon[Math.floor(Math.random()*addon.length)]);
		break;
	case '?':
		var resp = ['Did you call for me? No? My apologies.', 'Is someone calling me?', 'Did someone say my name?', 'Is there something wrong?', 'Did I do something?']
		message.channel.send(resp[Math.floor(Math.random()*resp.length)]);

		break;
	}
	
});

// Log our bot in
client.login(token);