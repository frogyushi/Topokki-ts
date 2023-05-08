import { DistubeEvent } from '../../app/player';

export default new DistubeEvent({
    name: 'error',

    callback: async (app, channel, err) => {
        console.error(err);
    }
});
