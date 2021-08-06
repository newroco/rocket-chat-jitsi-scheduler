import {IPersistence, IRead} from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

export async function linkGenerator(read: IRead, room, sender, persistence: IPersistence, meetingName = ''): Promise<string> {
    // tslint:disable-next-line:max-line-length
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2RlcmF0b3IiOnRydWUsImF1ZCI6ImppdHNpIiwiaXNzIjoiUm9ja2V0Q2hhdE5ld3JvY28iLCJzdWIiOiJtZWV0Lm5ld3JvLmNvIiwicm9vbSI6IioiLCJleHAiOjE4MDIyMDAwMDB9.JzVrno3QqsXi85Oa8WPvZG7PSxatrgGU7YKYca-LXJw';
    let serverUrl = await read.getEnvironmentReader().getServerSettings().getValueById('Jitsi_Domain') as string;
    serverUrl = ensureUrlIsValid(serverUrl);

    const urlPrefix = await read.getEnvironmentReader().getServerSettings().getValueById('Jitsi_URL_Room_Prefix') as string;

    let roomName = '';

    if ( ! meetingName) {
        if (room.name) {
            [roomName] = room.name;
        }

        const assoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, sender.id);

        if (roomName && roomName.charAt(0) === '@') {
            roomName = roomName.substr(1);
            await persistence.updateByAssociation(assoc, { roomName }, true);
        }

        if (!roomName) {
            const [assocData]: any = await read.getPersistenceReader().readByAssociation(assoc);
            roomName = (assocData && assocData.roomName) || urlPrefix + room.id + sender.id;
        }
    } else {
        roomName = meetingName;
    }

    // return serverUrl + makeUrlSafeForJitsiWeb(roomName) + '?jwt=' + token;
    return serverUrl + makeUrlSafeForJitsiWeb(roomName);
}

function ensureUrlIsValid(url: string): string {
    let server = url;

    if (!url || url.length === 0) {
        server = 'https://meet.newro.co/';
    }

    // ensure the url starts with either https:// or http://
    if (!server.includes('https://') && !server.includes('http://')) {
        server = `https://${ server }`;
    }

    // ensure the url ends with a trailing slash
    if (!server.endsWith('/')) {
        server = `${ server }/`;
    }

    return server;
}

function makeUrlSafeForJitsiWeb(value: string): string {
    return value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\s]/g, '');
}
