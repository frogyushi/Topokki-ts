import addList from './distube/addList';
import addSong from './distube/addSong';
import distubeError from './distube/error';
import guildMemberRemove from './discord/guildMemberRemove';
import interactionCreate from './discord/interactionCreate';
import playerError from './player/error';
import ready from './discord/ready';
import voiceStateUpdate from './discord/voiceStateUpdate';

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