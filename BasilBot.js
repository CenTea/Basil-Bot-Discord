// Import the discord.js module
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

//Queue Vars

var queue = [];
var memberx = [];
var playing = false;
var dispatcher;
var dispatcherend = 0;
//functions

function enqueue(message, url)
{
	memberx.push(at(message));
	queue.push(url);
	message.reply('URL Queued');
}

function runPlaylist(message)
{
	if (queue.length == 0 && !playing)
	{
		message.channel.send("Queue is empty");
	}
	else if (!playing)
	{
		next(message);
	}
	else
	{
		console.log("RPL error");
	}

}

function next(message)
{
	playR(message,queue[0], memberx[0] +'Playing Request~', memberx[0] + 'is not in the channel, skipping~', 0);
	memberx.shift();
	queue.shift();
	console.log(memberx);
	console.log(queue);
}

function playR(message,url, msg1, msg2, repeat)
{
		const channel = message.member.voiceChannel;
		if (channel)
		{
			channel.join();
			const streamOptions = { seek: 0, volume: 1 };
		try{
			const stream = ytdl(url, { filter : 'audioonly' });
			dispatcher = channel.connection.playStream(stream, streamOptions);
			message.channel.send(msg1);
			playing = true;
        	dispatcher.on("end", end => {
          		message.channel.send("Request Complete~");
			playing = false;
			if (repeat == 1 && dispatcherend == 0)
			{
			playR(message,url, msg1, msg2, 1);
			}
			else
			{
			runPlaylist(message);
			}
		}); // end dispatcher

		}catch(err){
			message.channel.send("URL Error!");
		} // end try-catch

		} // end if
		else 
		{
			message.channel.send(msg2);
		} // end else
}

function play(message,url, msg1, msg2)
{
		const channel = message.member.voiceChannel;
		if (channel)
		{
			channel.join();
			const streamOptions = { seek: 0, volume: 1 };
		try{
			const stream = ytdl(url, { filter : 'audioonly' });
			dispatcher = channel.connection.playStream(stream, streamOptions);
			message.channel.send(msg1);
			playing = true;
        	dispatcher.on("end", end => {
          		message.channel.send("Request Complete~");
			playing = false;
		}); // end dispatcher

		}catch(err){
			console.log(err);
			message.channel.send("URL Error!");
		} // end try-catch

		} // end if
		else 
		{
			message.reply(msg2);
		} // end else
}

function imageresp(message, image, title, desc)
{
	const embed = new Discord.RichEmbed()
		.setTitle(title)
		.setDescription(desc)
		.setImage(image);
	return {embed : embed};
}

function at(message)
{
	return '<@'+message.member.id + '> ';
}

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

// Create an event listener for messages
client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

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
	case 'exit':
		try{
		message.member.voiceChannel.leave();
		}catch (err){
		}
		console.log('Exiting!');
		break;
	case 'f': case 'fu': case 'fuc': case 'fuck':
		play(message,'https://www.youtube.com/watch?v=xcO_U9Jceps',imageresp(message, 'http://i0.kym-cdn.com/photos/images/original/001/237/094/21c.jpg' , 'No Swearing!', '@everyone Swearing is bad!'),'Get in a channel you PoS.');
		break;
	case 'giverng':
		if (!isNaN(parseInt(args[0])))
		message.reply(Math.floor(Math.random()*args[0]));
		else
		message.reply('Please give me a max number to work with...');
		break;
	case 'help':
    		message.reply('\nHi!\nI am Basil.\nCurrently my commands are:\n"Add [args]": I will add numbers.\n"GiveRNG [arg]": I will give a random number given a max.\n"NumberOne": This posts a link to We are number one.\n"TrueNo1": I will play the song for you in your voice channel.\n"Exit": I will leave the voice channel.\nCurrently all commands should be case-insensitive.');
		break;
	case 'join':
		message.member.voiceChannel.join();
		console.log('Joining Channel!');
		break;
	case 'n': case 'next':
		message.reply('Skipping~');
		next(message);
		break;
	case 'numberone':
		message.reply('https://www.youtube.com/watch?v=PfYnvDL0Qcw');
		break;
	case 'pause':
		try{
		dispatcher.pause();
		playing = false;
		}catch(err){
		message.reply('Pause Error!');
		}
		break;
	case 'play':
		if (!playing)
		{
		play(message, args[0], at(message) +'Playing Request~', at(message)+ 'You are currently not residing in a channel!', true);
		}
		else
		{
		message.reply('Something is already playing. Try again later~');
		}
		break;
	case 'playlist':
		message.reply('Playing Queue~');
		runPlaylist(message);
		break;
	case 'poo':
		message.channel.send(imageresp(message, 'http://i0.kym-cdn.com/photos/images/original/001/237/094/21c.jpg' , 'No Swearing!', '@everyone Swearing is bad!'));
		break;
	case 'q': case 'queue':
		enqueue(message, args[0]);
		break;
	case 'repeat':
		if (!playing)
		{
		dispatcherend = 0;
		playR(message, args[0], at(message) +'Playing Request on repeat~', at(message)+ 'You are currently not residing in a channel!', 1);
		}
		else
		{
		message.reply('Something is already playing. Try again later~');
		}
		break;
	case 'resume':
		try{
		dispatcher.resume();
		playing = true;
		}catch(err){
		message.reply('Resume Error!');
		}
		break;
	case 'stop' :
		try{
		dispatcher.end();
		playing = false;
		}catch(err){
		message.reply('End Error!');
		}
		dispatcherend = 1;
		break;
	case 'trueno1':
		play(message,'https://www.youtube.com/watch?v=PfYnvDL0Qcw',  at(message) + 'We are Number one~', at(message) + 'Get in a channel you PoS.\nCan\'t be No.1 like that.');
		break;
	case 'whoareyou':
		message.reply('I am Basil Hem! Still in progress!\n');
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
