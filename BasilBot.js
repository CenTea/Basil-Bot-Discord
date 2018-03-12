// Import the discord.js module
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const nodeopus = require('node-opus');

//Vars

// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = process.env.BASIL_TOKEN;

const curses = ['fucking','fuck','fucked','fck','fkc','shit','bitch'];
const prefix = 'Basil';
serverlist = [];
dispatcher = null;
playlist = [];
mob = [];

stringy = [];//tester


//functions

function at(message)
{
	return '<@'+message.member.id + '> ';
}

function imageresp(message, image, title, desc)
{
	const embed = new Discord.RichEmbed()
		.setTitle(title)
		.setDescription(desc)
		.setImage(image);
	return {embed : embed};
}

function embresp(message, title, desc)
{
	const embed = new Discord.RichEmbed()
		.setTitle(title)
		.setDescription(desc)
	return {embed : embed};
}

function filter(message, cursearray)
{
	var splitted = message.content.toLowerCase().split(" ");
	var stringer = splitted.join();
	stringer = stringer.replace(/[^A-Za-z]/g,'');

	var pooresp = ['Poo states: I will come for you at night!', 'Poo calmly stares and smiles at ' + at(message) , 'Poo grins at ' + at(message) , 'Poo winks at ' + at(message), 'Poo flexes'];
	var cursechange = ['Oh Flowerbeds!', 'By the great pixie dust!', 'Ghost Signals!', 'Bloody Cheek!', 'Wanking Peeker!', 'If it not be Bone Storm!', '┌（┌ ＾o＾）┐ ~ ホモォ ~ '];
	for (var i = 0; i <cursearray.length ; i++)
	{
		if (stringer.includes(cursearray[i]))
		{
			message.channel.send('No Swearing! '+ at(message) + '\nThe message has been deleted.');
			message.channel.send(imageresp(message,'http://i0.kym-cdn.com/photos/images/original/001/237/094/21c.jpg', 'Swearing is bad!', pooresp[Math.floor(Math.random()*pooresp.length)]) );
			message.delete();
			message.reply('Here\'s a recommended replacement: ' + cursechange[Math.floor(Math.random()*cursechange.length)]);
			break;
		}
	}
}

function stinfo(message, text)
{
	var ytemp = stringy[0];
	if (ytemp != undefined)
	{
	message.channel.send(embresp(message, text, ytemp));
	}
	else
	{
	message.channel.send(embresp(message, text, "Meeeeeeeehhh, You already know the name of it"));
	}
}

function pinfo(message)
{
	var xtemp = "";
	for (var i = 0; i<playlist.length; i++)
	{
		xtemp += stringy[i];
	}
	message.channel.send(embresp(message, "Songs Currently in Queue : "+playlist.length, xtemp));
}

function infocheck(url)
{

	ytdl.getInfo(url,{}, function(err,info)
	{
	var minutes = Math.floor(info.length_seconds/60);
 	var seconds = info.length_seconds%60;
	stringy.push(info.title + "\nDuration of Song: " + minutes + ":"+((seconds<10) ? "0"+seconds : seconds) +"\n");
	});
}

function printqueue(message)
{
	if (playlist.length>0)
	{
		pinfo(message);
	}
	else
	{
	message.channel.send("The queue may be empty.");
	}
}

function play(message, url)
{
		const channel = message.member.voiceChannel;
		if (channel)
		{
			channel.join();
			const streamOptions = { seek: 0, volume: 1 };
		try{
			const stream = ytdl(url, { filter : 'audioonly' });
			dispatcher = channel.connection.playStream(stream, streamOptions);
			dispatcher.on('error', console.error);
		}catch(err){
			console.log(err);
			message.channel.send("URL Error!");
			if (playlist.length>0)
			{
			dequeue();
			}
		} // end try-catch

		} // end if

		else 
		{
			message.reply('Channel?');
		} // end else

		dispatcher.once("end", end => {
			console.log("Before end:\n" + stringy[0]);
			if (end == "skip")
			{
			setTimeout(function(){ stinfo(message, "~Skipped~"); }, 500);
			}
			else
			{
			setTimeout(function(){ stinfo(message, "~Just Ended~"); },500);
			}

			if (dispatcher!=null)
			{
				setTimeout(function(){dequeue();}, 1000);
			}

			dispatcher = null;
			setTimeout(function(){ playqueue(); }, 2000);
		}); // end dispatcher

}

function enqueue(url, message)
{
	playlist.push(url);
	mob.push(message);

	try{
	infocheck(url);
	}catch(err){
	console.log(err);
	message.channel.send("No.");
	if (playlist.length>0)
	{
		dequeue();
	}
	}

	console.log(playlist.length);
}

function dequeue()
{
	playlist.shift();
	mob.shift();
	stringy.shift();
}

function playqueue()
{
	if (playlist.length>0)
	{
	setTimeout(function(){stinfo(mob[0], "~Currently Playing~"); }, 1000);
	play(mob[0],playlist[0]);
	}
}

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted

client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {

if (message.author.username != 'Basil Hem')
{//ifnotbasil
  console.log(message.content);

for (var i = 0; i<serverlist.length; i++)
{
  if (message.guild == serverlist[i])
  {
  filter(message, curses);
  break;
  }
}

  const args = message.content.slice(0,5);
  console.log(args);
  if (args.toLowerCase() == 'basil')
{//startif

  var command = message.content.slice(5).trim().split(" ");
  console.log('command: '+ command);

  switch(command[0].toLowerCase()){
	case 'end': case 'stop': case 'next': case 'skip':
		if (dispatcher == null)
		{
			message.channel.send('Nothing is playing?');
		}
		else
		{
			dispatcher.end("skip");
		}
		dispatcher = null;
		break;
	case 'exit':
		try{
		message.member.voiceChannel.leave();
		console.log('Exiting!');
		message.channel.send('Exiting~');
		dispatcher = null;
		}catch (err){
		message.reply('Nope~');
		}
		break;
	case 'hi': case 'hello':
		message.reply('Hi~');
		break;
	case 'pause':
		if (dispatcher == null)
		{
			message.channel.send('Nothing is playing?');
		}
		else
		{
			dispatcher.pause();
			message.channel.send('Paused~');
		}
		break;
	case 'pq':
		{
			printqueue(message);
		break;
		}
	case 'purge':
		{
			playlist = [];
			mob = [];
			stringy = [];
			message.reply('Purged!');
		break;
		}
	case 'queue':case 'q':
		if (command[1] != undefined)
		{
			enqueue(command[1], message);
			message.reply('Queued');
		}
		else
		{
			message.reply('Error... Maybe?');
		}
		break;
	case 'play':
		if (dispatcher != null)
		{
			message.channel.send('Something is already playing?');
		}
		else
		{
			if (command[1] != undefined)
			{
				enqueue(command[1], message);
				playqueue();
			}
			else
			{
				if (playlist.length>0)
				{
					playqueue();
				}
				else
				{
					message.channel.send('The playlist seems to be empty.');
				}
		}
		}
		break;
	case 'resume':
		if (dispatcher == null)
		{
			message.channel.send('Nothing is playing?');
		}
		else
		{
			dispatcher.resume();
			message.channel.send('Go~');
		}
		break;
	case 'startfilter': case 'start filter':
		if (message.member.id == "242005625377128448")
		{
			if (!serverlist.includes(message.guild))
			{
			serverlist.push(message.guild);
			message.reply('Okay! Implementing POO System~');
			}
			else
			{
			message.reply('I believe POO is already active.');
			}
		}
		else
		{
			message.reply('Unauthorized.');
		}
		break;
	case 'stopfilter': case 'stop filter':
		if (message.member.id == "242005625377128448")
		{
		const index = serverlist.indexOf(message.guild);
		if (serverlist.indexOf(message.guild) !== -1)
			{
			serverlist.splice(index, 1);
			message.reply('Okay! Removing POO System~');
			}
		else
			{
			message.reply('POO is not active in this server.');
			}
		}
		else
		{
			message.reply('Unauthorized.');
		}
		break;
	case 'whoareyou':case 'who are you':
		message.reply('I am Basil Hem! Still in progress!\n');
		break;
	case 'whoami':case 'who am i':
		var response = 'You\'re you.\nYou\'re ' + message.author.username + ' currently residing in ' + message.member.guild.name + '.\n';
		var addon = ['Did you fall down and hit your head? I hope you\'re alright.', 'Did you really need to ask?']
		message.reply(response+addon[Math.floor(Math.random()*addon.length)]);
		break;
	case '?': case '':
		var resp = ['Did you call for me?', 'Is someone calling me?', 'Did someone say my name?', 'Is there something wrong?', 'Did I do something?','Yay!?']
		message.channel.send(resp[Math.floor(Math.random()*resp.length)]);
		break;
	default:
		var iresp = ['Huh?', 'Is that rock larvae speak?', 'Talking like the Crux?', 'Imitating the Avarice?', 'Do you work for the THICC store or something?']
		message.channel.send(iresp[Math.floor(Math.random()*iresp.length)]);
		break;
	}


}//endif
}//endnotbasil
});

// Log our bot in
client.login(token);