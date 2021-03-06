import { APIInteraction, Utils } from 'discord-api-types/v9';
import { Client } from '../Client';
import { Snowflake } from '../utils/Snowflake';
import { Base } from './Base';
import { Channel } from './channels/Channel';
import { Guild } from './Guild';
import { Member } from './Member';
import { User } from './User';


/**
 * @category Structures
 */
export class CommandInteraction extends Base {
    public id: Snowflake;
    public channel: Channel | null;
    public guild: Guild | null;
    public user?: User;
    public member: Member | null;
    public token: string;
    public data: APIInteraction;
    
    constructor(client: Client, data: APIInteraction) {
        super(client);
        this.data = data;
        this.id = data.id as unknown as Snowflake;
        this.channel = client.channels.get(data.channel_id as unknown as Snowflake) || null;
        this.token = data.token;
        if (Utils.isGuildInteraction(data)) {
            this.guild = client.guilds.get(data.guild_id as unknown as Snowflake)!;
            this.member =
                this.guild.members.get(data.member.user.id as unknown as Snowflake) ||
                new Member(client, this.guild, data.member);
            this.user = this.member.user;
        } else {
            this.guild = null;
            this.member = null;
            this.user = data.user ? client.users.get(data.user.id as unknown as Snowflake) || new User(client, data.user) : undefined;
        }
    }
}

/*
TODO finish this
export async function resolveInteractionCmdUserOption(option: ApplicationCommandOption): User|null {
    if (option.type !== 'user') return null;
    
    
}

 */
