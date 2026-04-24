import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or link')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
