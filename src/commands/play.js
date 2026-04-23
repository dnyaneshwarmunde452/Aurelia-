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
