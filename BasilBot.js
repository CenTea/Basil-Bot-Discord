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
var pick = [];
var dispatcher = null;

// Planned closeness levels.
// >-100 - 200, 201 - 600, 601 - 1000+ 


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

function filter(message, cursearray)
{
	var stringer = message.content.toLowerCase();
	var pooresp = ['Poo states: I will come for you at night!', 'Poo calmly stares and smiles at ' + at(message) , 'Poo grins at ' + at(message) , 'Poo winks at ' + at(message), 'Poo flexes'];

	for (i = 0; i <	cursearray.length ; i++)
	{
		if (stringer.includes(cursearray[i]))
		{
			message.channel.send('No Swearing! '+ at(message) + '\nThe message has been deleted.');
			message.channel.send(imageresp(message,'http://i0.kym-cdn.com/photos/images/original/001/237/094/21c.jpg', 'Swearing is bad!', pooresp[Math.floor(Math.random()*pooresp.length)]) );
			message.delete();
			break;
		}
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
  filter(message, curses);
  const args = message.content.slice(0,5);
  console.log(args);
  if (args.toLowerCase() == 'basil')
{//startif

  var command = message.content.slice(5).trim().split(" ");
  console.log('command: '+ command);

  switch(command[0].toLowerCase()){
	case 'addme': case 'add me':
		if (pick.indexOf(at(message))==-1)
		{
			pick.push(at(message));
			message.reply('Added!');
		}
		else
		{
			message.reply('No.');
		}
		break;
	case 'exit':
		try{
		message.member.voiceChannel.leave();
		}catch (err){
		}
		console.log('Exiting!');
		message.channel.send('Exiting~');
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
	case 'pick': case 'pickone': case 'pickme': case 'pick one': case 'pick me':
		if (pick.length > 0)
		{
			message.channel.send(pick[Math.floor(Math.random()*pick.length)] + 'was chosen.');
		}
		break;
	case 'play':
		const channel = message.member.voiceChannel;
		if (channel)
		{
			channel.join();
			const streamOptions = { seek: 0, volume: 1 };
		try{
			const stream = ytdl(command[1], { filter : 'audioonly' });
			dispatcher = channel.connection.playStream(stream, streamOptions);
			message.channel.send('Playing~');
		dispatcher.on('error', console.error);
        	dispatcher.on("end", end => {
          		message.channel.send("Request Complete~");
			dispatcher = null;
		}); // end dispatcher

		}catch(err){
			console.log(err);
			message.channel.send("URL Error!");
		} // end try-catch

		} // end if
		else 
		{
			message.reply('Channel?');
		} // end else
		break;
	case 'removeme': case 'remove me':
		const index = pick.indexOf(at(message));
		if (pick.indexOf(at(message)) !== -1)
		{
			pick.splice(index, 1);
			message.reply('Removed.');
		}
		else
		{
			message.reply('No.');
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
	}


}//endif
}//endnotbasil
});

// Log our bot in
client.login(token);