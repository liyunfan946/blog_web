import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import {
  Paper,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
} from '@mui/icons-material';

const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const currentSong = {
    title: '示例音乐',
    url: 'https://example.com/music.mp3',
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  return (
    <Paper
      elevation={3}
      className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <IconButton color="primary" size="small">
            <SkipPrevious />
          </IconButton>
          <IconButton color="primary" onClick={handlePlayPause}>
            {playing ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton color="primary" size="small">
            <SkipNext />
          </IconButton>
        </div>
        <div className="flex-1 mx-4">
          <Typography variant="subtitle1" className="text-white">
            {currentSong.title}
          </Typography>
          <Slider
            value={0}
            min={0}
            max={100}
            className="text-white"
            aria-label="进度条"
          />
        </div>
        <div className="flex items-center space-x-2">
          <VolumeUp className="text-white" />
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={1}
            step={0.1}
            className="w-24 text-white"
            aria-label="音量"
          />
        </div>
      </div>
      <ReactPlayer
        url={currentSong.url}
        playing={playing}
        volume={volume}
        width="0"
        height="0"
      />
    </Paper>
  );
};

export default MusicPlayer; 