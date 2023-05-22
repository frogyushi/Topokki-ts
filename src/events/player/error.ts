import { delay } from '../../helpers';
import { MessageResponses } from '../../app/app';
import { PlayerEvent } from '../../app/player';

export default new PlayerEvent({
    name: 'error',

    callback: async (app, interaction) => {
        await delay(1000);

        try {
            const reply = interaction.replied
                ? interaction.followUp.bind(interaction)
                : interaction.reply.bind(interaction);

            reply(MessageResponses.RequestFailed);
        } catch (err) {
            console.error(err);
        }
    }
});
