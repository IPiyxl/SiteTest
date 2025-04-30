const { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const filePath = './posts.json';

const createPostCommand = new SlashCommandBuilder()
  .setName('createpost')
  .setDescription('Create a post with a title, text, image, and hashtags')
  .addStringOption(option =>
    option.setName('imagine')
      .setDescription('The URL of the image')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('titlu')
      .setDescription('The title of the post')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('text')
      .setDescription('The content of the post')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('hashtags')
      .setDescription('Comma-separated hashtags for the post')
      .setRequired(false)
  );

  const deletePostCommand = new SlashCommandBuilder()
  .setName('deletepost')
  .setDescription('Sterge o postare dupa titlul ei')
  .addStringOption(option =>
    option.setName('titlu')
      .setDescription('Introdu titlul anuntului pe care vrei sa il stergi')
      .setRequired(true)
  );

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: [createPostCommand.toJSON(), deletePostCommand.toJSON()] },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'createpost') {
    const imagine = interaction.options.getString('imagine');
    const titlu = interaction.options.getString('titlu');
    const text = interaction.options.getString('text');
    const hashtags = interaction.options.getString('hashtags') || '';

    const postContent = `**${titlu}**\n\n${text}\n\n${hashtags}`;

    try {
      await interaction.reply({
        content: postContent,
        embeds: [
          {
            image: { url: imagine },
            color: 0x00AE86, // Optional: Customize embed color
          },
        ],
      });
      
      const newData = {
        title: titlu,
        imagine: imagine,
        text: text,
        hashtags: hashtags
      }

      fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
              console.error('Error reading the file:', err);
          }

          let jsonData = [];
          try {
              jsonData = JSON.parse(data);
          } catch (parseErr) {
              console.warn('File is empty or not valid JSON, starting with an empty array.');
          }

          jsonData.push(newData);

          fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
              if (writeErr) {
                  console.error('Error writing to the file:', writeErr);
              }

              console.log('Data successfully added to the JSON file.');
          });
      });
    } catch (error) {
      console.error('Error sending post:', error);
      await interaction.reply({
        content: 'A apărut o eroare la crearea postării. Vă rugăm să verificați datele introduse și să încercați din nou.',
        ephemeral: true,
      });
    }
  }
  if (interaction.commandName === 'deletepost') {
    const titlu = interaction.options.getString('titlu'); // Get the title of the post to delete
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return interaction.reply({
          content: 'A apărut o eroare la accesarea datelor postării.',
          ephemeral: true,
        });
      }
  
      let jsonData = [];
      try {
        jsonData = JSON.parse(data); // Parse the JSON file
      } catch (parseErr) {
        console.warn('File is empty or not valid JSON.');
        return interaction.reply({
          content: 'Fișierul de date post este gol sau corupt.',
          ephemeral: true,
        });
      }
  
      // Filter out the post with the matching title
      const filteredData = jsonData.filter(post => post.title !== titlu);
  
      // Check if any post was removed
      if (jsonData.length === filteredData.length) {
        return interaction.reply({
          content: `Nu s-a găsit nicio postare cu titlul "${titlu}".`,
          ephemeral: true,
        });
      }
  
      fs.writeFile(filePath, JSON.stringify(filteredData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Error writing to the file:', writeErr);
          return interaction.reply({
            content: 'A apărut o eroare la ștergerea postării.',
            ephemeral: true,
          });
        }
  
        console.log(`Post with title "${titlu}" successfully deleted.`);
        interaction.reply({
          content: `Postarea cu titlu "${titlu}" has been successfully deleted.`,
          ephemeral: true,
        });
      });
    });
  }
});

client.login(TOKEN);