export default {
  name: "play",
  async execute(message, args) {
    let query = args.join(" ");
    if (!query) return message.reply("Give song name!");

    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Join VC first!");

    // 🎧 Spotify support
    if (query.includes("spotify")) {
      const data = await getPreview(query);
      query = `${data.title} ${data.artist}`;
    }

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const stream = await play.stream(query);

    const player = createAudioPlayer();
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    player.play(resource);
    connection.subscribe(player);

    message.channel.send(`🎶 Playing: ${query}`);
  }
}
if (message.content === '!stop') {
  player.stop();
  message.reply('⏹️ Stopped music');
}
if (message.content.startsWith('!play')) {
  const args = message.content.split(' ').slice(1);
  const query = args.join(' ');

  if (!message.member.voice.channel) {
    return message.reply('Join a voice channel first!');
  }

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channel.id,
    guildId: message.guild.id,
    adapterCreator: message.guild.voiceAdapterCreator
  });

  let stream;

  // 🎵 YouTube / search
  if (play.yt_validate(query) === 'video') {
    stream = await play.stream(query);
  } else {
    const result = await play.search(query, { limit: 1 });
    stream = await play.stream(result[0].url);
  }

  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });

  player.play(resource);
  connection.subscribe(player);

  message.reply(`🎶 Playing: ${query}`);
}
if (message.content === '!pause') {
  player.pause();
  message.reply('⏸️ Paused');
}

if (message.content === '!resume') {
  player.unpause();
  message.reply('▶️ Resumed');
}
import { SlashCommandBuilder } from 'discord.js';
import { playSong } from '../../music/manager.js';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play music')
  .addStringOption(option =>
    option
      .setName('query')
      .setDescription('Song name or URL')
      .setRequired(true)
  );

export async function execute(interaction) {
  const query = interaction.options.getString('query');

  await interaction.deferReply();

  const message = interaction; // reuse logic style
  message.member = interaction.member;
  message.guild = interaction.guild;
  message.channel = interaction.channel;

  await playSong(message, query);

  interaction.editReply(`🎶 Added/Playing: ${query}`);
}
import { SlashCommandBuilder } from 'discord.js';
import { player } from '../../music/manager.js';

export const data = new SlashCommandBuilder()
  .setName('pause')
  .setDescription('Pause music');

export async function execute(interaction) {
  player.pause();
  interaction.reply('⏸️ Paused');
}import { SlashCommandBuilder } from 'discord.js';
import { player } from '../../music/manager.js';

export const data = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('Resume music');

export async function execute(interaction) {
  player.unpause();
  interaction.reply('▶️ Resumed');
}import { SlashCommandBuilder } from 'discord.js';
import { player } from '../../music/manager.js';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop music');

export async function execute(interaction) {
  player.stop();
  interaction.reply('⏹️ Stopped');
}
