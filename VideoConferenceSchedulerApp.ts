import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import {
    UIKitBlockInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';

import {
    IMessage,
    IPostMessageSent,
} from '@rocket.chat/apps-engine/definition/messages';
import { ScheduleCommand } from './commands/schedule';
// import { initiatorMessage } from './lib/initiatorMessage';
import {generateJwtForUser} from './lib/generateJwtForUser';

export class VideoConferenceSchedulerApp extends App implements IPostMessageSent {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ) {
        const data = context.getInteractionData();

        const { actionId } = data;

        switch (actionId) {
            case 'participate': {
                try {
                    if ( ! data.room) {
                        return {
                            success: false,
                        };
                    }

                    const sender = await modify
                        .getCreator()
                        .startMessage();

                    const token = await generateJwtForUser(data.user);
                    const link = `${data.value}?jwt=${token}`;

                    sender.setRoom(data.room);
                    sender.setText(`${data.user.name}, here's your participation link: ${link}`);

                    // Notifier not applicable to LiveChat Rooms
                    if (data.room.type !== 'l') {
                        await modify
                            .getNotifier()
                            .notifyUser(data.user, sender.getMessage());
                    } else {
                        await modify.getCreator().finish(sender);
                    }

                    return {
                        success: true,
                    };
                } catch (err) {
                    console.error(err);
                    return {
                        success: false,
                    };
                }
            }
        }

        return {
            success: false,
        };
    }

    public async executePostMessageSent(
        message: IMessage,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify,
    ): Promise<void> {
        // if (message.room.type !== 'l') {
        //     return;
        // }
        //
        // if (message.text === ':meme:') {
        //     const data = {
        //         room: message.room,
        //         sender: message.sender,
        //     };
        //     await initiatorMessage({ data, read, persistence, modify, http });
        // }
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new ScheduleCommand(this));
    }
}
