import { SlashCommandBuilder } from 'discord.js';
import {
    Command,
    PermissionsManager,
    RequirementsManager,
    SubcommandManager
} from '../../app/app';

import leaderboard from './leaderboard/show';

export default new Command({
    requirements: new RequirementsManager(),

    perms: new PermissionsManager(),

    subcommands: new SubcommandManager(
        leaderboard,
    ),

    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the leaderboard of the most active members')
        .addSubcommand((option) => option
            .setName('remove')
            .setDescription('Removes a user from the leaderboard')
            .addUserOption((option) => option
                .setName('member')
                .setDescription('The user to remove from the leaderboard')
                .setRequired(true)
            )
        )
        .addSubcommand((option) => option
            .setName('show')
            .setDescription('Displays the leaderboard')
        ),
})