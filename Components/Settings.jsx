/* Essential Packages */
const { React } = require('powercord/webpack');

/* Plugin Specific Packages */
// There are many more componenets available in "powercord/components/settings".
const { SwitchItem, TextInput } = require('powercord/components/settings');

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
                        this.props.toggleSetting('showOwnerTag');
                    }}
                    note="If disabled, owner tags won't show anywhere"
                >
                    Show Owner Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showAdminTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showAdminTags');
                    }}
                    note="If disabled, admin tags won't be shown anywhere. Admin tags look for the Administrator permission"
                >
                    Show Admin Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showModTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showModTags');
                    }}
                    note="If disabled, mod tags won't be shown anywhere. Mod tags look for kick/ban members and manage message permission"
                >
                    Show Mod Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showStaffTags', true)}
                    onChange={() => {
                        this.props.toggleSetting('showStaffTags');
                    }}
                    note="If disabled, staff tags won't be shown anywhere. Staff tags look for manage channels, manage server, or manage roles"
                >
                    Show Staff Tags
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('displayMessages', true)}
                    onChange={() => {
                        this.props.toggleSetting('displayMessages');
                    }}
                    note="If disabled, badges won't be shown next to message timestamps."
                >
                    Show next to message timestamps
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('displayMembers', true)}
                    onChange={() => {
                        this.props.toggleSetting('displayMembers');
                    }}
                    note="If disabled, badges won't be shown in the member list."
                >
                    Show in Member List
                </SwitchItem>
                <SwitchItem
                    value={this.props.getSetting('showForBots', true)}
                    onChange={() => {
                        this.props.toggleSetting('showForBots');
                    }}
                    note="If disabled, badges won't be shown anywhere for bots. (WIP)"
                >
                    Show for Bots
                </SwitchItem>
                <TextInput
                    note='This will override owner tags using role colors! Must be a hex color starting with #'
                    value={this.props.getSetting('ownerTagColor')}
                    onChange={e => {
                        this.props.updateSetting('ownerTagColor', e);
                    }}
                >
                    Owner Tag Color
                </TextInput>
                <TextInput
                    note='This will override admin tags using role colors! Must be a hex color starting with #'
                    value={this.props.getSetting('adminTagColor')}
                    onChange={e => {
                        this.props.updateSetting('adminTagColor', e);
                    }}
                >
                    Admin Tag Color
                </TextInput>
                <TextInput
                    note='This will override mod tags using role colors! Must be a hex color starting with #'
                    value={this.props.getSetting('modTagColor')}
                    onChange={e => {
                        this.props.updateSetting('modTagColor', e);
                    }}
                >
                    Mod Tag Color
                </TextInput>
                <TextInput
                    note='This will override staff tags using role colors! Must be a hex color starting with #'
                    value={this.props.getSetting('staffTagColor')}
                    onChange={e => {
                        this.props.updateSetting('staffTagColor', e);
                    }}
                >
                    Staff Tag Color
                </TextInput>
            </div>
        );
    }
};
