const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const musicMetadata = require('music-metadata');

const app = express();

const upload = multer({ dest: './uploads/' });

app.use(express.json());

app.post('/upload_audio', upload.single('audio'), (req, res) => {
  const audioFile = req.file;
  const audioBuffer = req.file.buffer;

  // Process the audio file using ffmpeg
  ffmpeg(audioBuffer)
    .setFormat('wav')
    .setAudioCodec('pcm_s16le')
    .on('end', () => {
      // Extract audio features using music-metadata
      musicMetadata(audioBuffer, (err, metadata) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error extracting audio metadata' });
        } else {
          const songTitle = metadata.title;
          const artistName = metadata.artist;

          // Return the processed audio data to the client-side script
          res.json({ songTitle, artistName });
        }
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error processing audio file' });
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});