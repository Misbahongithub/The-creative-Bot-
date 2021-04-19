const Discord = require("discord.js");
// Use dotenv to get all out secret environment variables
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/main?retryWrites=true&w=majority`;
const { MongoClient } = require("mongodb");
const Mongo = new MongoClient(uri, { useUnifiedTopology: true });

async function connect() {
	await Mongo.connect();
}
try {
	connect();
} catch (e) {
	console.log("Database connection error");
	process.exit(1);
} finally {
	console.log("Successfully connected to database");
}

/**
 * ```
 * The Discord Client which handles our bot
 * ```
 */
const bot = new Discord.Client();



async function updateLeaderboard() {
	let leaderBoard = await Mongo.db()
		.collection('main')
		.find({}, { sort: [['count', -1]] })
		.toArray()
	let message = new Discord.MessageEmbed()
	leaderBoard.forEach((member, index) => {
		message.addField(`#${index + 1}`, `<@${member._id}>: ${member.count}`)
	})
	message.setTitle("Server leaderboard")
	message.setThumbnail(msg.guild!.iconURL())
	let guild = await bot.guilds.fetch('773131732043300865')
 	let channel = await guild.channels.fetch('832925876923400223')
	channel.send(message)
}


/**
 * This function is called whenever the bot gets a message from any of the server in which it exists
 */
bot.on("message", async function (message) {
	// The message did not came from a bot user. So simply ignore it
	if (!message.author.bot) return
	console.log(message.content.toString());
 	
	await Mongo.db()
		.collection('main')
		.updateOne(
			{ _id: msg.author.id },
			{
				$inc: {
					count: 1,
				},
			},
			{
				upsert: true,
			}
		)
	let guild = await bot.guilds.fetch('773131732043300865')
 	let channel = await guild.channels.fetch('832925876923400223')
	channel.send(`${message.author}:   ${search.count+1}`)
});

// Log in out bot so that it can do it's work
bot.login(process.env.BOT_TOKEN);

setInterval(updateLeaderboard, 60000)
