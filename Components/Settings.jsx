/* Essential Packages */
const { React } = require('powercord/webpack');

/* Plugin Specific Packages */
// There are many more componenets available in "powercord/components/settings".
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.PureComponent {
    /**
     * Renderer, this is what's being executed on line 22 of index.js
     * The example here displays a toggle between displaying a cat or a dog.
     * */

    render() {
        return (
            <div>
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
            </div>
        );
    }
};
