/* Essential Packages */
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');
const {
    React,
    getModule,
    getModuleByDisplayName,
    constants,
    channels
} = require('powercord/webpack');

/* Plugin Specific Packages */
const { getGuild } = getModule(['getGuild'], false);
const {
    default: { getMember }
} = getModule(m => m.default && m.default.getMember, false);

const Permissions = constants.Permissions;

const parseBitFieldPermissions = allowed => {
    const permissions = {};
    for (const perm of Object.keys(Permissions)) {
        if (!perm.startsWith('all')) {
            if (BigInt(allowed) & BigInt(Permissions[perm])) {
                permissions[perm] = true;
            }
        }
    }
    return permissions;
};

const userTypes = {
    NONE: 'None',
    STAFF: 'Staff',
    MOD: 'Mod',
    ADMIN: 'Admin',
    SOWNER: 'Server Owner',
    GOWNER: 'Group Owner'
};

const DEFAULT_TAG_TEXTS = {
    staff: 'Staff',
    mod: 'Mod',
    admin: 'Admin',
    owner: 'Owner'
};

function getPermissionsRaw(guild, user_id) {
    let permissions = 0n;

    const member = getMember(guild.id, user_id);

    if (guild && member) {
        if (guild.ownerId === user_id) {
            permissions = BigInt(Permissions.ADMINISTRATOR);
        } else {
            /* @everyone is not inlcuded in the member's roles */
            permissions |= BigInt(guild.roles[guild.id]?.permissions);

            for (const roleId of member.roles) {
                const rolePerms = guild.roles[roleId]?.permissions;
                if (rolePerms !== undefined) {
                    permissions |= BigInt(rolePerms);
                }
            }
        }

        /* If they have administrator they have every permission */
        if (
            (BigInt(permissions) & BigInt(Permissions.ADMINISTRATOR)) ===
            BigInt(Permissions.ADMINISTRATOR)
        ) {
            return Object.values(Permissions).reduce(
                (a, b) => BigInt(a) | BigInt(b),
                0n
            );
        }
    }

    return permissions;
}

const Tooltip = getModule(['TooltipContainer'], false).TooltipContainer;

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

    getTagText(tagType) {
        switch (tagType) {
            case userTypes.ADMIN:
                tagType = 'admin';
                break;
            case userTypes.GOWNER:
            case userTypes.SOWNER:
                tagType = 'owner';
                break;
            case userTypes.MOD:
                tagType = 'mod';
                break;
            case userTypes.STAFF:
                tagType = 'staff';
                break;
        }
        const customTextEnabled = this.settings.get('customTagText', false);
        const tagText = this.settings.get(`${tagType}TagText`);
        return customTextEnabled ? tagText : DEFAULT_TAG_TEXTS[tagType];
    }

    async injectMessages() {
        console.log('Injecting messages');
        const channelStore = await getModule(['getChannel', 'getDMFromUserId']);
        const _this = this;
        const MessageTimestamp =
            getModule(['MessageTimestamp'], false) ||
            getModule(
                m =>
                    typeof (m?.__powercordOriginal_default || m.default) ===
                        'function' &&
                    (m?.__powercordOriginal_default || m.default)
                        .toString()
                        .includes('showTimestampOnHover'),
                false
            ); // credit to M|-|4r13y ツ#1051 for this snippet
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

                const header = findInReactTree(
                    res.props.username,
                    e =>
                        Array.isArray(e.props?.children) &&
                        e.props.children.find(c => c?.props?.message)
                );
				if(!header) return;
                let data;

                const channel = channelStore.getChannel(
                    channels.getChannelId()
                );
                if (!channel) return;
                const guild = getGuild(channel.guild_id);
                if (guild) {
                    const member = getMember(guild.id, id);
                    if (!member) return res;
                    const permissions = getPermissionsRaw(guild, id);
                    const parsedPermissions =
                        parseBitFieldPermissions(permissions);

                    if (guild.ownerId === id) {
                        // is guild owner
                        const tagColor = _this.settings.get(
                            'ownerTagColor',
                            '#ED9F1B'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomOwnerColor'
                        );
                        data = {
                            userType: _this.settings.get('showOwnerTags', true)
                                ? userTypes.SOWNER
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (parsedPermissions['ADMINISTRATOR']) {
                        const tagColor = _this.settings.get(
                            'adminTagColor',
                            '#B4B4B4'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomAdminColor'
                        );
                        data = {
                            userType: _this.settings.get('showAdminTags', true)
                                ? userTypes.ADMIN
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['MANAGE_SERVER'] ||
                        parsedPermissions['MANAGE_CHANNELS'] ||
                        parsedPermissions['MANAGE_ROLES']
                    ) {
                        const tagColor = _this.settings.get(
                            'staffTagColor',
                            '#8D5C51'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomStaffColor'
                        );
                        data = {
                            userType: _this.settings.get('showStaffTags', true)
                                ? userTypes.STAFF
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['KICK_MEMBERS'] ||
                        parsedPermissions['BAN_MEMBERS'] ||
                        parsedPermissions['MANAGE_MESSAGES']
                    ) {
                        const tagColor = _this.settings.get(
                            'modTagColor',
                            '#C8682E'
                        );
                        const useCustomColor =
                            _this.settings.get('useCustomModColor');
                        data = {
                            userType: _this.settings.get('showModTags', true)
                                ? userTypes.MOD
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    }
                } else if (channel.type === 3 && channel.ownerId === id) {
                    // group channel
                    const tagColor = _this.settings.get(
                        'ownerTagColor',
                        '#ED9F1B'
                    );
                    const useCustomColor = _this.settings.get(
                        'useCustomOwnerColor'
                    );
                    data = {
                        userType: userTypes.GOWNER,
                        color: useCustomColor && tagColor ? tagColor : null
                    };
                }

                //const element = React.createElement(Tag, { userid: id });
                if (data && data.userType !== userTypes.NONE) {
                    // const textColor = _this.settings.get('textColor');
                    if (_this.settings.get('showCrowns', false)) {
                        const element = React.createElement(
                            Tooltip,
                            {
                                text: `${data.userType}`,
                                className: 'OwnerTag-13h21hk'
                            },
                            React.createElement(
                                'svg',
                                {
                                    className: `${botTagCozyClasses.botTagCozy} ${botTagRegularClasses.botTagRegular} ${remClasses.rem} ownertag`,
                                    'aria-label': `${data.userType}`,
                                    'aria-hidden': 'false',
                                    width: 14,
                                    height: 14,
                                    viewBox: '0 0 16 16',
                                    style: {
                                        color: data.color,
                                        backgroundColor: 'transparent'
                                    }
                                },
                                React.createElement('path', {
                                    fillRule: 'evenodd',
                                    clipRule: 'evenodd',
                                    d: 'M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z',
                                    fill: 'currentColor',
                                    'aria-hidden': 'true'
                                })
                            )
                        );
                        header.props.children.push(element);
                    } else {
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
                                userType: data.userType,
                                settings: _this.settings
                            })
                        );
                        header.props.children.push(element);
                    }
                }

                return res;
            }
        );
    }

    async injectMembers() {
        console.log('Injecting members');
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
                    const parsedPermissions =
                        parseBitFieldPermissions(permissions);

                    if (guild.ownerId === id) {
                        // is guild owner
                        const tagColor = _this.settings.get(
                            'ownerTagColor',
                            '#ED9F1B'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomOwnerColor'
                        );
                        data = {
                            userType: _this.settings.get('showOwnerTags', true)
                                ? userTypes.SOWNER
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (parsedPermissions['ADMINISTRATOR']) {
                        const tagColor = _this.settings.get(
                            'adminTagColor',
                            '#B4B4B4'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomAdminColor'
                        );
                        data = {
                            userType: _this.settings.get('showAdminTags', true)
                                ? userTypes.ADMIN
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['MANAGE_SERVER'] ||
                        parsedPermissions['MANAGE_CHANNELS'] ||
                        parsedPermissions['MANAGE_ROLES']
                    ) {
                        const tagColor = _this.settings.get(
                            'staffTagColor',
                            '#8D5C51'
                        );
                        const useCustomColor = _this.settings.get(
                            'useCustomStaffColor'
                        );
                        data = {
                            userType: _this.settings.get('showStaffTags', true)
                                ? userTypes.STAFF
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString
                            )
                        };
                    } else if (
                        parsedPermissions['KICK_MEMBERS'] ||
                        parsedPermissions['BAN_MEMBERS'] ||
                        parsedPermissions['MANAGE_MESSAGES']
                    ) {
                        const tagColor = _this.settings.get(
                            'modTagColor',
                            '#C8682E'
                        );
                        const useCustomColor =
                            _this.settings.get('useCustomModColor');
                        data = {
                            userType: _this.settings.get('showModTags', true)
                                ? userTypes.MOD
                                : userTypes.NONE,
                            color:
                                useCustomColor && tagColor
                                    ? tagColor
                                    : member.colorString,
                            textColor: _this._numberToTextColor(
                                useCustomColor && tagColor
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
                    const tagColor = _this.settings.get(
                        'ownerTagColor',
                        '#ED9F1B'
                    );
                    const useCustomColor = _this.settings.get(
                        'useCustomOwnerColor'
                    );
                    data = {
                        userType: userTypes.GOWNER,
                        color: useCustomColor && tagColor ? tagColor : null
                    };
                }

                if (data && data.userType !== userTypes.NONE) {
                    if (_this.settings.get('showCrowns', false)) {
                        const element = React.createElement(
                            Tooltip,
                            {
                                text: _this.getTagText(data.userType),
                                className: 'OwnerTag-13h21hk'
                            },
                            React.createElement(
                                'svg',
                                {
                                    className: `${remClasses.botTag} ${botTagRegularClasses.botTagRegular} ${remClasses.px} ownertag-list`,
                                    'aria-label': `${data.userType}`,
                                    'aria-hidden': 'false',
                                    width: 14,
                                    height: 14,
                                    viewBox: '0 0 16 16',
                                    style: {
                                        color: data.color,
                                        backgroundColor: 'transparent'
                                    }
                                },
                                React.createElement('path', {
                                    fillRule: 'evenodd',
                                    clipRule: 'evenodd',
                                    d: 'M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z',
                                    fill: 'currentColor',
                                    'aria-hidden': 'true'
                                })
                            )
                        );
                        const size = res.props.children.length;
                        res.props.children[size] = res.props.children[size - 1];
                        res.props.children[size - 1] = element;
                    } else {
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
                                userType: data.userType,
                                settings: _this.settings
                            })
                        );
                        const size = res.props.children.length;
                        res.props.children[size] = res.props.children[size - 1];
                        res.props.children[size - 1] = element;
                    }
                    // res.props.children.unshift(element);
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
        if (!color) {
            return;
        } // prevents errors from null colors which come from roles with no colors
        const colorInt = parseInt(color.slice(1), 16);
        const r = (colorInt & 0xff0000) >>> 16;
        const g = (colorInt & 0xff00) >>> 8;
        const b = colorInt & 0xff;
        const bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
        return 255 - bgDelta < 105 ? '#000000' : '#ffffff';
    }
};
