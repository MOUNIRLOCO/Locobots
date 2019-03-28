const Discord = require("Discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "Mzg1ODUwNDE0MTIzNDUwMzY4.D35d_g.10bnAr0ToZmJOwNWjZehSuWv03M";
const PREFIX = "/";


function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();

    });
}

var ffmpeg = require('ffmpeg');

var bot = new  Discord.Client();

var servers = {};

var fortunes = [
    "Yes.", 
    "Maybe.", 
    "Dont know.",
    "For sure.",
    "Dont count on it.",
    "Why are you asking me?"
];


bot.on("ready", function() {
      console.log("ready");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;


    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");


    switch (args[0]) {
        case "8ball":
             if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
             else message.channel.sendMessage("Cant read");
             break;
        case "help":
            var embed = new Discord.RichEmbed()
                .addField("/info", "Info about you.")
                .addField("/play", "Plays music. (need to be in  voice chat)")
                .addField("/skip", "Skips the current song.")
                .addField("/stop", "Stops the current queue.")
                .addField("/pause", "Pauses the current queue.")
                .addField("/resume", "Resumes the current queue.")
                .addField("/aishasiren", "Sends a yellow heart smh.")
                .addField("/invite", "Invite link to the locobots server.")
                .addField("/8ball", "Gives a random answer back.")
                .addField("/Mention", "Mentions you.")
                .setDescription("Help menu, The prefix is /", true)
                .setColor(0xff0000,)
                .setFooter("A Help command made with an embed!")
            message.channel.sendEmbed(embed);
            break;
        case "mention":
            message.channel.sendMessage(message.author.toString() + "Here you go!");
            break;
        case "aishasiren":
             message.channel.sendMessage(":yellow_heart:");
            break;
        case "invite":
             message.channel.sendMessage("https://discord.gg/KMTZqBn");
             break;

            case "play":

            if (!args[1]) {
                message.channel.sendMessage("Provide a link.");
                return;

            }
            if (!message.member.voiceChannel) {
                message.channel.sendMessage("you must be in a voice channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
             break;

        case "skip":
             var server = servers[message.guild.id];

        if(server.dispatcher) server.dispatcher.end();
        break;

    case "stop":
             var server = [message.guild.id];

             if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
          
    break;    

        case "test":
            message.channel.sendMessage("I am working!");
            break;

        case "pause":
          exports.run = (client, message, args, ops) => {

            let fetched = ops.active.get(message.guild.id);

            if (!fetched) return message.channel.send('There is no music playing at the moment.');

            if (message.member.voiceChannel != message.guild.me.voiceChannel) return message.channel.send('You are not in the voice channel');

            if (fetched.dispatcher.pause) return message.channel.send('The music is already paused.');

            fetched.dispatcher.pause();

            message.channel.send(`I paused the music. ${fetched.queue[0].songTitle}`)

          };
          
    break;

        case "resume":
        exports.run = (client, message, args, ops) => {

            let fetched = ops.active.get(message.guild.id);

            if (!fetched) return message.channel.send('There is no music playing at the moment.');

            if (message.member.voiceChannel != message.guild.me.voiceChannel) return message.channel.send('You aren not in the voice channel');

            if (!fetched.dispatcher.resume) return message.channel.send('The music is not paused.');

            fetched.dispatcher.pause();

            message.channel.send(`I resumed the music. ${fetched.queue[0].songTitle}`)

          };

    break;

    case "ping":

     {
        message.channel.send("Pong! \` " + bot.ping + "ms`\ ")
    } 
    
    break;
    
    case "info":

     {
        let member = message.mentions.users.first() || message.author;
        let userembed = new Discord.RichEmbed()
            .setColor(message.guild.member(member).highestRole.color)
            .setThumbnail(member.displayAvatarURL)
            
            .setTitle(`Here is ${member.username}'s info.`)
            .addField(`Name:`, member.username, true)
            .addField(`Id:`, member.id, true)
            .addField(`Bot:`, member.bot ? "Yes" : "No", true)
            .addField("Game:", message.guild.member(member).presence.game ? message.guild.member(member).presence.game.name : "Not Playing", true) // the ? and : are like an if statement if (msg.guild.member(member).presence.game ) { msg.guild.member(member).presence.game.name } else "Not Playing"
            .addField("Nickname:", message.guild.member(member).nickname ? message.guild.member(member).nickname : "None", true )
            .addField("Last Messsage:", member.lastMessage, true)
            .addField(`Roles:`, message.guild.member(member).roles.map(s => s).join(" | "), true)
    
            message.channel.send(userembed);
    }
    
   break;

            
        
    }
    

});



bot.login(process.env.token);

