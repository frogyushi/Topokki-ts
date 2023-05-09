import { ActivityType } from 'discord.js';
import { ClientEvent } from '../../app/app';

export default new ClientEvent({
    name: 'ready',

    callback: async (app) => {
        app.deployCommands(app.commands);
        app.client.user!.setActivity("the clouds :)", { type: ActivityType.Watching });

        console.log('App is online');
    }
});
