const {
    React,
    channels: { getChannelId },
    http: { get },
    constants: { Endpoints }
} = require('powercord/webpack');
const { sleep } = require('powercord/util');

const userTypes = {
    NONE: 0,
    MANAGEMENT: 1,
    ADMIN: 2,
    OWNER: 3
};

let noReq = false;
async function doGet(endpoint) {
    let res;
    while (!res) {
        if (noReq) {
            res = { body: {} };
            break;
        }
        try {
            res = await get(endpoint);
        } catch (e) {
            if (e.status === 429) {
                if (!e.body) {
                    console.log(
                        'Encountered hard cloudflare limit. Disabling requests.'
                    );
                    noReq = true;
                    res = { body: {} };
                    break;
                } else {
                    await sleep(e.body.retry_after);
                }
            } else {
                res = { body: {} };
            }
        }
    }
    return res;
}

class Tag extends React.PureComponent {
    constructor(props) {
        super(props);
        if (this.props.userid) {
            this.state = Tag.cache[props.userid] || { loaded: false };
        }
    }

    // async getChannel() {
    //     const channelID = getChannelId();
    //     const channel = await doGet(Endpoints.CHANNEL(channelID));
    //     return channel;
    // }

    async getGuild(channel_id) {
        const guild = await doGet(Endpoints.GUILD(channel_id));
        return guild;
    }

    async getUserType() {
        if (!this.guild || !this.channel) return userTypes.NONE;
        const isOwner =
            this.channel.body.owner_id === this.props.userid ||
            (this.guild && this.guild.body.owner_id === this.props.userid);
        if (isOwner) return userTypes.OWNER;
        return userTypes.NONE;
    }

    async componentDidMount() {
        if (!this.props.userid) {
            return;
        }
        this.channelID = getChannelId();
        this.channel = await doGet(Endpoints.CHANNEL(this.channelID));
        if (!this.channel) return;
        this.guild = await this.getGuild(this.channel.body.guild_id);
        const userType = await this.getUserType();
        // TODO: cache this shit so we can stop spamming the api ffs
        this.setState({ userType });
    }

    render() {
        if (!this.props.userid) return null;
        if (this.state.userType && this.state.userType === userTypes.OWNER) {
            return <div className='ownertag'>Owner</div>;
        }
        return null;
    }
}

Tag.cache = {};
module.exports = Tag;
