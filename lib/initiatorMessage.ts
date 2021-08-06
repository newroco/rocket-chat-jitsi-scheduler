import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { ButtonStyle } from '@rocket.chat/apps-engine/definition/uikit';
import {linkGenerator} from './linkGenerator';

export async function initiatorMessage({
    data,
    read,
    persistence,
    modify,
    http,
}: {
    data;
    read: IRead;
    persistence: IPersistence;
    modify: IModify;
    http: IHttp;
}) {
    const builder = await modify
        .getCreator()
        .startMessage()
        .setRoom(data.room)
        .setSender(data.sender);

    if (data.args.length < 2) {
        builder.setText('Invalid /schedule command. You have to pass the date and time to this command, e.g. /schedule 03/25/2021 01:00PM');

        if (data.room.type !== 'l') {
            await modify
                .getNotifier()
                .notifyUser(data.sender, builder.getMessage());
        } else {
            await modify.getCreator().finish(builder);
        }

        return;
    }

    const block = modify.getCreator().getBlockBuilder();

    block.addSectionBlock({
        text: block.newPlainTextObject(`${data.sender.name} has scheduled a meeting.`),
    });

    let roomName = '';

    if (data.args.length > 2) {
        const meetingName = data.args.slice(2).join(' ');

        block.addSectionBlock({
            text: block.newPlainTextObject(`Title: ${meetingName}`),
        });

        roomName = meetingName;
    }

    block.addSectionBlock({
        text: block.newPlainTextObject(`Date: ${data.args[0]}`),
    });

    block.addSectionBlock({
        text: block.newPlainTextObject(`Time: ${data.args[1]}`),
    });

    const link = await linkGenerator(read, data.room, data.sender, persistence, roomName);

    block.addSectionBlock({
        text: block.newPlainTextObject(`Guests link: ${link}`),
    });

    block.addActionsBlock({
        blockId: 'schedule-participate',
        elements: [
            block.newButtonElement({
                actionId: 'participate',
                text: block.newPlainTextObject('Participate'),
                value: link,
                style: ButtonStyle.PRIMARY,
            }),
        ],
    });

    builder.setBlocks(block);

    await modify.getCreator().finish(builder);

    // Notifier not applicable to LiveChat Rooms
    // if (data.room.type !== 'l') {
    //     await modify
    //         .getNotifier()
    //         .notifyUser(data.sender, builder.getMessage());
    // } else {
    //     await modify.getCreator().finish(builder);
    // }
}
