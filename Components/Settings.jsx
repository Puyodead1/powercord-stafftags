/* eslint-disable indent */
/* Essential Packages */
const { React, constants } = require('powercord/webpack');
const Permissions = constants.Permissions;

/* Plugin Specific Packages */
// There are many more componenets available in "powercord/components/settings".
const {
    SwitchItem,
    TextInput,
    ColorPickerInput
} = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    /**
     * Renderer, this is what's being executed on line 22 of index.js
     * The example here displays a toggle between displaying a cat or a dog.
     * */

    render() {
        return (
            <div>
                <SwitchItem
                    value={this.props.getSetting('showOwnerTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showOwnerTags', true);
                    }}
                    note="If disabled, owner tags won't show anywhere"
                >
                    Show Owner Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showAdminTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showAdminTags', true);
                    }}
                    note="If disabled, admin tags won't be shown anywhere. Admin tags look for the Administrator permission"
                >
                    Show Admin Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showModTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showModTags', true);
                    }}
                    note="If disabled, mod tags won't be shown anywhere. Mod tags look for kick/ban members and manage message permission"
                >
                    Show Mod Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showStaffTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showStaffTags', true);
                    }}
                    note="If disabled, staff tags won't be shown anywhere. Staff tags look for manage channels, manage server, or manage roles"
                >
                    Show Staff Tags
                </SwitchItem>
                {/* {this.props.getSetting("showStaffTags") && (
          <Category
            name="Staff Tag Permissions"
            description={
              "The permissions that should be required to classify as staff."
            }
            opened={this.state.categoryOpened}
            onChange={() =>
              this.setState({ categoryOpened: !this.state.categoryOpened })
            }
          >
            // TODO
            <div></div>
          </Category>
        )} */}
                <SwitchItem
                    value={this.props.getSetting('displayMessages', true)}
                    onChange={() => {
                        this.props.toggleSetting('displayMessages', true);
                    }}
                    note="If disabled, badges won't be shown in chat."
                >
                    Show in Chat
                </SwitchItem>

                <SwitchItem
                    value={this.props.getSetting('showCrowns', false)}
                    onChange={() => {
                        this.props.toggleSetting('showCrowns', false);
                    }}
                    note='Enable to select what Tags to replace with Crowns. Enable to show settings.'
                >
                    Show crowns instead of Tags
                </SwitchItem>

                {this.props.getSetting('showCrowns') && (
                    <>
                        <SwitchItem
                            value={this.props.getSetting(
                                'showServerOwnerCrown',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('showServerOwnerCrown');
                            }}
                            note='If enabled, Crowns will be displayed instead of Tags'
                        >
                            Show Server Owner Crown
                        </SwitchItem>

                        <SwitchItem
                            value={this.props.getSetting(
                                'showGroupOwnerCrown',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('showGroupOwnerCrown');
                            }}
                            note='If enabled, Crowns will be displayed instead of Tags'
                        >
                            Show Group Owner Crown
                        </SwitchItem>

                        <SwitchItem
                            value={this.props.getSetting(
                                'showAdminCrown',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('showAdminCrown');
                            }}
                            note='If enabled, Crowns will be displayed instead of Tags'
                        >
                            Show Admin Crown
                        </SwitchItem>

                        <SwitchItem
                            value={this.props.getSetting(
                                'showStaffCrown',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('showStaffCrown');
                            }}
                            note='If enabled, Crowns will be displayed instead of Tags'
                        >
                            Show Staff Crown
                        </SwitchItem>

                        <SwitchItem
                            value={this.props.getSetting(
                                'showModCrown',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('showModCrown');
                            }}
                            note='If enabled, Crowns will be displayed instead of Tags'
                        >
                            Show Mod Crown
                        </SwitchItem>
                    </>
                )}

                <SwitchItem
                    value={this.props.getSetting('displayMembers', true)}
                    onChange={() => {
                        this.props.toggleSetting('displayMembers', true);
                    }}
                    note="If disabled, badges won't be shown in the member list."
                >
                    Show in Member List
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showForBots', true)}
                    onChange={() => {
                        this.props.toggleSetting('showForBots', true);
                    }}
                    note="If disabled, badges won't be shown anywhere for bots."
                >
                    Show for Bots
                </SwitchItem>

                <SwitchItem
                    value={this.props.getSetting('customTagColors', false)}
                    onChange={() => {
                        this.props.toggleSetting('customTagColors', false);
                    }}
                    note='Enable to select custom colors for tags. Enable to show settings.'
                >
                    Change Tag Colors
                </SwitchItem>

                {this.props.getSetting('customTagColors') && (
                    <>
                        <SwitchItem
                            value={this.props.getSetting(
                                'useCustomOwnerColor',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('useCustomOwnerColor');
                            }}
                            note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                        >
                            Use Custom Owner Color
                        </SwitchItem>
                        {this.props.getSetting('useCustomOwnerColor') && (
                            <ColorPickerInput
                                note={
                                    "Overrides owner tags color. By default, uses the color of the user's highest role."
                                }
                                onChange={c =>
                                    this.props.updateSetting(
                                        'ownerTagColor',
                                        c ? this._numberToHex(c) : null
                                    )
                                }
                                default={parseInt('ED9F1B', 16)}
                                value={this.getColorSetting('ownerTagColor')}
                            >
                                Owner Tag Color
                            </ColorPickerInput>
                        )}
                        {this.props.getSetting('useCustomOwnerColor') && (
                            <SwitchItem
                                value={this.props.getSetting(
                                    'GroupOwnerColor',
                                    true
                                )}
                                onChange={() => {
                                    this.props.toggleSetting(
                                        'GroupOwnerColor',
                                        true
                                    );
                                }}
                                note='If enabled, Group Owner tag color will be same as Server Owner tag color'
                            >
                                Use Custom Group owner Color
                            </SwitchItem>
                        )}

                        <SwitchItem
                            value={this.props.getSetting(
                                'useCustomAdminColor',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('useCustomAdminColor');
                            }}
                            note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                        >
                            Use Custom Admin Color
                        </SwitchItem>
                        {this.props.getSetting('useCustomAdminColor') && (
                            <ColorPickerInput
                                note={
                                    "Overrides admin tags color. By default, uses the color of the user's highest role."
                                }
                                onChange={c =>
                                    this.props.updateSetting(
                                        'adminTagColor',
                                        c ? this._numberToHex(c) : null
                                    )
                                }
                                default={parseInt('B4B4B4', 16)}
                                value={this.getColorSetting('adminTagColor')}
                            >
                                Admin Tag Color
                            </ColorPickerInput>
                        )}

                        <SwitchItem
                            value={this.props.getSetting(
                                'useCustomStaffColor',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('useCustomStaffColor');
                            }}
                            note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                        >
                            Use Custom Staff Color
                        </SwitchItem>
                        {this.props.getSetting('useCustomStaffColor') && (
                            <ColorPickerInput
                                note={
                                    "Overrides staff tags color. By default, uses the color of the user's highest role."
                                }
                                onChange={c =>
                                    this.props.updateSetting(
                                        'staffTagColor',
                                        c ? this._numberToHex(c) : null
                                    )
                                }
                                default={parseInt('8D5C51', 16)}
                                value={this.getColorSetting('staffTagColor')}
                            >
                                Staff Tag Color
                            </ColorPickerInput>
                        )}

                        <SwitchItem
                            value={this.props.getSetting(
                                'useCustomModColor',
                                false
                            )}
                            onChange={() => {
                                this.props.toggleSetting('useCustomModColor');
                            }}
                            note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                        >
                            Use Custom Mod Color
                        </SwitchItem>
                        {this.props.getSetting('useCustomModColor') && (
                            <ColorPickerInput
                                note={
                                    "Overrides mod tags color. By default, uses the color of the user's highest role."
                                }
                                onChange={c =>
                                    this.props.updateSetting(
                                        'modTagColor',
                                        c ? this._numberToHex(c) : null
                                    )
                                }
                                default={parseInt('C8682E', 16)}
                                value={this.getColorSetting('modTagColor')}
                            >
                                Mod Tag Color
                            </ColorPickerInput>
                        )}
                    </>
                )}

                <SwitchItem
                    value={this.props.getSetting('customTagText', false)}
                    onChange={() => {
                        this.props.toggleSetting('customTagText');
                    }}
                    note='Enables customizing text of the tags. Enable to show settings.'
                >
                    Enable Custom Tag Text
                </SwitchItem>

                {this.props.getSetting('customTagText') && (
                    <>
                        <TextInput
                            note={
                                'Changing this will change the text shown in Owner Tags'
                            }
                            onChange={c =>
                                this.props.updateSetting('ownerTagText', c)
                            }
                            defaultValue={this.props.getSetting(
                                'ownerTagText',
                                'Owner'
                            )}
                            required={true}
                        >
                            Owner Tag Text
                        </TextInput>
                        <TextInput
                            note={
                                'Changing this will change the text shown in Admin Tags'
                            }
                            onChange={c =>
                                this.props.updateSetting('adminTagText', c)
                            }
                            defaultValue={this.props.getSetting(
                                'adminTagText',
                                'Admin'
                            )}
                            required={true}
                        >
                            Admin Tag Text
                        </TextInput>
                        <TextInput
                            note={
                                'Changing this will change the text shown in Mod Tags'
                            }
                            onChange={c =>
                                this.props.updateSetting('modTagText', c)
                            }
                            defaultValue={this.props.getSetting(
                                'modTagText',
                                'Mod'
                            )}
                            required={true}
                        >
                            Mod Tag Text
                        </TextInput>
                        <TextInput
                            note={
                                'Changing this will change the text shown in Staff Tags'
                            }
                            onChange={c =>
                                this.props.updateSetting('staffTagText', c)
                            }
                            defaultValue={this.props.getSetting(
                                'staffTagText',
                                'Staff'
                            )}
                            required={true}
                        >
                            Staff Tag Text
                        </TextInput>
                    </>
                )}

                <div style={{ color: 'white' }}>
                    <p>Owner: Is the owner of a Server or Group Chat</p>
                    <p>Admin: Has the Administrator permission</p>

                    <p>
                        Mod: Has one of the following permissions
                        <ul>
                            <li>- Kick Members</li>
                            <li>- Ban Members</li>
                            <li>- Manage Messages</li>
                        </ul>
                    </p>

                    <p>
                        Staff: Has one of the following permissions
                        <ul>
                            <li>- Manage Server</li>
                            <li>- Manage Channels</li>
                            <li>- Manage Roles</li>
                        </ul>
                    </p>
                </div>
            </div>
        );
    }

    getTagTextSetting(setting, def) {
        const string = this.props.getSetting(setting);
        return string ? string : def;
    }

    getColorSetting(setting) {
        const hex = this.props.getSetting(setting);
        return hex ? parseInt(hex.slice(1), 16) : 0;
    }

    _numberToHex(color) {
        const r = (color & 0xff0000) >>> 16;
        const g = (color & 0xff00) >>> 8;
        const b = color & 0xff;
        return `#${r.toString(16).padStart(2, '0')}${g
            .toString(16)
            .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
};
