import ready from './discord/ready';
import interactionCreate from './discord/interactionCreate';
import addSong from './distube/addSong';
import playerError from './player/error';
import distubeError from './distube/error';
import voiceStateUpdate from './discord/voiceStateUpdate';
import guildMemberRemove from './discord/guildMemberRemove';
import addList from './distube/addList';

export default {
    ready,
    interactionCreate,
    addSong,
    playerError,
    distubeError,
    voiceStateUpdate,
    guildMemberRemove,
    addList
};