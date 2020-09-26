/* Essential Packages */
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const {
    React,
    getModule,
    getModuleByDisplayName,
    constants
} = require('powercord/webpack');

/* Plugin Specific Packages */
const { getChannel } = getModule(['getChannel'], false);
const { getChannelId } = getModule(['getLastSelectedChannelId'], false);
const { getGuild } = getModule(['getGuild'], false);
const { getUser } = getModule(['getUser'], false);
const {
    default: { getMember }
} = getModule(m => m.default && m.default.getMember, false);

const Permissions = constants.Permissions;

const parseBitFieldPermissions = allowed => {
    const permissions = {};
    for (const perm of Object.keys(Permissions)) {
        if (!perm.startsWith('all')) {
            if (allowed & Permissions[perm]) {
                permissions[perm] = true;
            }
        }
    }
    return permissions;
};

const userTypes = {
    NONE: 0,
    STAFF: 1,
    MOD: 2,
    ADMIN: 3,
    OWNER: 4
};

function getPermissionsRaw(guild, user_id) {
    let permissions = 0;

    const member = getMember(guild.id, user_id);

    if (guild && member) {
        if (guild.ownerId === user_id) {
            permissions = Permissions.ADMINISTRATOR;
        } else {
            /* @everyone is not inlcuded in the member's roles */
            permissions |= guild.roles[guild.id]?.permissions;

            for (const roleId of member.roles) {
                permissions |= guild.roles[roleId]?.permissions;
            }
        }

        /* If they have administrator they have every permission */
        if (
            (permissions & Permissions.ADMINISTRATOR) ===
            Permissions.ADMINISTRATOR
        ) {
            return Object.values(Permissions).reduce((a, b) => a | b, 0);
        }
    }

    return permissions;
}

/* Settings */
const Settings = require('./Components/Settings.jsx');
const Tag = require('./Components/Tag');

module.exports = class OwnerTag extends Plugin {
    /* Entry Point */
    async startPlugin() {
        this.loadStylesheet('style.css');
        /* Register Settings */
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: this.manifest.name, // Label that appears in the settings menu
            render: Settings // The React component to render. In this case, the imported Settings file
        });

        this.injectMessages();
        this.injectMembers();
    }

    async injectMessages() {
        const _this = this;
        const MessageTimestamp = await getModule(['MessageTimestamp']);
        const botTagRegularClasses = await getModule(['botTagRegular']);
        const botTagCozyClasses = await getModule(['botTagCozy']);
        const remClasses = await getModule(['rem']);

        /**
         * The following injects a function into the specified module.
         * Parameter 1: The InjectionID, used to uninject.
         * 2: The module you want to inject into.
         * 3: The function name you want to target.
         * 4: The function you want to inject.
         */
        inject(
            'ownertag-messages',
            MessageTimestamp,
            'default',
            (args, res) => {
                if (!_this.settings.get('displayMessages', true)) {
                    return res;
                }
                const id = args[0].message.author.id;
                // const user = await getUser(id)
                // if (!user) return;
                // if (!_this.settings.get('showBots', true) && user.bot) {
                //     return;
                // }
                const header = res.props.children[1];
                let data;

                const channel = getChannel(getChannelId());
                if (!channel) return;
                const guild = getGuild(channel.guild_id);
                if (guild) {
                    const member = getMember(guild.id, id);
                    const permissions = getPermissionsRaw(guild, id);
                    const parsedPermissions = parseBitFieldPermissions(
                        permissions
                    );

                    if (guild.ownerId === id) {
                        // is guild owner
                        const tagColor = _this.settings.get('ownerTagColor');
                        data = {
                            userType: userTypes.OWNER,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (parsedPermissions['ADMINISTRATOR']) {
                        const tagColor = _this.settings.get('adminTagColor');
                        data = {
                            userType: userTypes.ADMIN,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['KICK_MEMBERS'] ||
                        parsedPermissions['BAN_MEMBERS'] ||
                        parsedPermissions['MANAGE_MESSAGES']
                    ) {
                        const tagColor = _this.settings.get('modTagColor');
                        data = {
                            userType: userTypes.MOD,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['MANAGE_SERVER'] ||
                        parsedPermissions['MANAGE_CHANNELS'] ||
                        parsedPermissions['MANAGE_ROLES']
                    ) {
                        const tagColor = _this.settings.get('staffTagColor');
                        data = {
                            userType: userTypes.STAFF,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    }
                } else if (channel.type === 3 && channel.ownerId === id) {
                    // group channel
                    data = { userType: userTypes.OWNER };
                }

                //const element = React.createElement(Tag, { userid: id });
                if (data) {
                    // const textColor = _this.settings.get('textColor');
                    const element = React.createElement(
                        'span',
                        {
                            className: `${botTagCozyClasses.botTagCozy} ${botTagRegularClasses.botTagRegular} ${remClasses.rem} ownertag`,
                            style: {
                                backgroundColor: data.color,
                                color: data.textColor
                            }
                        },
                        React.createElement(Tag, {
                            className: botTagRegularClasses.botText,
                            userType: data.userType
                        })
                    );
                    const size = header.props.children.length;
                    header.props.children[size] =
                        header.props.children[size - 1];
                    header.props.children[size - 1] = element;
                    // header.props.children.push(element);
                }

                return res;
            }
        );
    }

    async injectMembers() {
        const _this = this;
        const MemberListItem = await getModuleByDisplayName('MemberListItem');
        const botTagRegularClasses = await getModule(['botTagRegular']);
        const remClasses = await getModule(['rem']);

        inject(
            'ownertag-members',
            MemberListItem.prototype,
            'renderDecorators',
            function (args, res) {
                if (!_this.settings.get('displayMembers', true)) {
                    return res;
                }

                const id = this.props.user.id;
                // const user = getUser(id);
                // if (!user) return;
                // if (!_this.settings.get('showBots', true) && user.bot) {
                //     return;
                // }
                let data;

                const guild = getGuild(this.props.channel.guild_id);
                if (guild) {
                    const member = getMember(guild.id, id);
                    const permissions = getPermissionsRaw(guild, id);
                    const parsedPermissions = parseBitFieldPermissions(
                        permissions
                    );

                    if (guild.ownerId === id) {
                        // is guild owner
                        const tagColor = _this.settings.get('ownerTagColor');
                        data = {
                            userType: userTypes.OWNER,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (parsedPermissions['ADMINISTRATOR']) {
                        const tagColor = _this.settings.get('adminTagColor');
                        data = {
                            userType: userTypes.ADMIN,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['KICK_MEMBERS'] ||
                        parsedPermissions['BAN_MEMBERS'] ||
                        parsedPermissions['MANAGE_MESSAGES']
                    ) {
                        const tagColor = _this.settings.get('modTagColor');
                        data = {
                            userType: userTypes.MOD,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['MANAGE_SERVER'] ||
                        parsedPermissions['MANAGE_CHANNELS'] ||
                        parsedPermissions['MANAGE_ROLES']
                    ) {
                        const tagColor = _this.settings.get('staffTagColor');
                        data = {
                            userType: userTypes.STAFF,
                            color:
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                tagColor && tagColor !== ''
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    }
                } else if (
                    this.props.channel.type === 3 &&
                    this.props.channel.ownerId === id
                ) {
                    // group channel
                    data = { userType: userTypes.OWNER };
                }

                if (data) {
                    const element = React.createElement(
                        'span',
                        {
                            className: `${remClasses.botTag} ${botTagRegularClasses.botTagRegular} ${remClasses.px} ownertag-list`,
                            style: {
                                backgroundColor: data.color,
                                color: data.textColor
                            }
                        },
                        React.createElement(Tag, {
                            className: botTagRegularClasses.botText,
                            userType: data.userType
                        })
                    );
                    res.props.children.unshift(element);
                }

                return res;
            }
        );
    }

    pluginWillUnload() {
        // When the plugin is unloaded, we need to unregister/uninject anything we've registered/injected.
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject('ownertag-members');
        uninject('ownertag-messages');
    }

    /*
     * Original code from https://github.com/powercord-community/rolecolor-everywhere.
     */
    _numberToTextColor(color) {
        const colorInt = parseInt(color.slice(1), 16);
        const r = (colorInt & 0xff0000) >>> 16;
        const g = (colorInt & 0xff00) >>> 8;
        const b = colorInt & 0xff;
        const bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
        return 255 - bgDelta < 105 ? '#000000' : '#ffffff';
    }
};
