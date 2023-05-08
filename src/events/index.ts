import ready from './discord/ready';
import interactionCreate from './discord/interactionCreate';
import addSong from './distube/addSong';
import playerError from './player/error';
import distubeError from './distube/error';

export default {
    ready,
    interactionCreate,
    addSong,
    playerError,
    distubeError
};