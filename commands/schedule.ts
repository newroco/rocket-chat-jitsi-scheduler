import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { initiatorMessage } from '../lib/initiatorMessage';

export class ScheduleCommand implements ISlashCommand {
    public command = 'schedule';
    public i18nDescription = 'Schedule a video conference!';
    public i18nParamsExample = '';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistence: IPersistence,
    ): Promise<void> {
        const sender = context.getSender(); // the user calling the slashcommand
        const room = context.getRoom(); // the current room
        const args = context.getArguments();

        const data = {
            room,
            sender,
            args,
        };

        return await initiatorMessage({ data, read, persistence, modify, http });
    }
}
