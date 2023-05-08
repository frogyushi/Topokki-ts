import { ActivityType } from 'discord.js';
import { AppEvent } from '../../app/app';

export default new AppEvent({
    name: 'ready',

    callback: async (app) => {
        app.deployCommands(app.commands);
        app.client.user!.setActivity("the clouds :)", { type: ActivityType.Watching });

        console.log('App is online');
    }
});
