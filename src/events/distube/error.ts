import { DistubeEvent } from '../../app/player';
import { MessageResponses } from '../../app/app';

export default new DistubeEvent({
    name: 'error',

    callback: async (app, channel, err) => {
        console.error(err);

        channel?.send(MessageResponses.RequestFailed);
    }
});
