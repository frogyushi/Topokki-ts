import { AppEvent } from '../../app/app';

export default new AppEvent({
    name: 'ready',

    callback: async (app) => {
        app.deployCommands(app.commands);

        console.log('App is online');
    }
});
