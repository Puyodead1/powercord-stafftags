/* eslint-disable indent */
/* Essential Packages */
const { React } = require('powercord/webpack');

/* Plugin Specific Packages */
// There are many more componenets available in "powercord/components/settings".
const { SwitchItem, TextInput, ColorPickerInput } = require('powercord/components/settings');

module.exports = class Settings extends React.PureComponent {
    /**
     * Renderer, this is what's being executed on line 22 of index.js
     * The example here displays a toggle between displaying a cat or a dog.
     * */

    render() {
        return (
            <div>
                <SwitchItem
                    value={this.props.getSetting('showOwnerTag', true)}
                    onChange={() => {
                        this.props.toggleSetting('showOwnerTag', true);
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
                    value={this.props.getSetting('showCrowns', true)}
                    onChange={() => {
                        this.props.toggleSetting('showCrowns', true);
                    }}
                    note="If enabled, Crowns will be displayed instead of Tags"
                >
                    Show crowns instead of Tags
                </SwitchItem>

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
                    note="If disabled, badges won't be shown anywhere for bots. (WIP)"
                >
                    Show for Bots
                </SwitchItem>

                <SwitchItem
                    value={this.props.getSetting('useCustomOwnerColor', false)}
                    onChange={() => {
                        this.props.toggleSetting('useCustomOwnerColor');
                    }}
                    note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                >
                    Use Custom Owner Color
                </SwitchItem>
                {this.props.getSetting('useCustomOwnerColor') && <ColorPickerInput
                    note={'Overrides owner tags color. By default, uses the color of the user\'s highest role.'}
                    onChange={c => this.props.updateSetting('ownerTagColor', c ? this._numberToHex(c) : null)}
                    default={parseInt('ED9F1B', 16)}
                    value={this.getColorSetting('ownerTagColor')}
                >
                    Owner Tag Color
                </ColorPickerInput>}

                {this.props.getSetting('useCustomOwnerColor') && <SwitchItem
                    value={this.props.getSetting('GroupOwnerColor', true)}
                    onChange={() => {
                        this.props.toggleSetting('GroupOwnerColor', true);
                    }}
                    note="If enabled, Group Owner tag color will be same as Server Owner tag color"
                >
                    Use Custom Group owner Color
                </SwitchItem>}

                <SwitchItem
                    value={this.props.getSetting('useCustomAdminColor', false)}
                    onChange={() => {
                        this.props.toggleSetting('useCustomAdminColor');
                    }}
                    note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                >
                    Use Custom Admin Color
                </SwitchItem>
                {this.props.getSetting('useCustomAdminColor') && <ColorPickerInput
                    note={'Overrides admin tags color. By default, uses the color of the user\'s highest role.'}
                    onChange={c => this.props.updateSetting('adminTagColor', c ? this._numberToHex(c) : null)}
                    default={parseInt('B4B4B4', 16)}
                    value={this.getColorSetting('adminTagColor')}
                >
                    Admin Tag Color
                </ColorPickerInput>}

                <SwitchItem
                    value={this.props.getSetting('useCustomStaffColor', false)}
                    onChange={() => {
                        this.props.toggleSetting('useCustomStaffColor');
                    }}
                    note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                >
                    Use Custom Staff Color
                </SwitchItem>
                {this.props.getSetting('useCustomStaffColor') && <ColorPickerInput
                    note={'Overrides staff tags color. By default, uses the color of the user\'s highest role.'}
                    onChange={c => this.props.updateSetting('staffTagColor', c ? this._numberToHex(c) : null)}
                    default={parseInt('8D5C51', 16)}
                    value={this.getColorSetting('staffTagColor')}
                >
                    Staff Tag Color
                </ColorPickerInput>}

                <SwitchItem
                    value={this.props.getSetting('useCustomModColor', false)}
                    onChange={() => {
                        this.props.toggleSetting('useCustomModColor');
                    }}
                    note='If enabled, custom colors entered below will be used (if color box is empty, highest role color is used)'
                >
                    Use Custom Mod Color
                </SwitchItem>
                {this.props.getSetting('useCustomModColor') && <ColorPickerInput
                    note={'Overrides mod tags color. By default, uses the color of the user\'s highest role.'}
                    onChange={c => this.props.updateSetting('modTagColor', c ? this._numberToHex(c) : null)}
                    default={parseInt('C8682E', 16)}
                    value={this.getColorSetting('modTagColor')}
                >
                    Mod Tag Color
                </ColorPickerInput>}

            </div>
        );
    }

    getColorSetting(setting) {
        const hex = this.props.getSetting(setting)
        return hex ? parseInt(hex.slice(1), 16) : 0
    }

    _numberToHex(color) {
        const r = (color & 0xFF0000) >>> 16;
        const g = (color & 0xFF00) >>> 8;
        const b = color & 0xFF;
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
};
