/* Essential Packages */
const { React } = require('powercord/webpack');

/* Plugin Specific Packages */
// There are many more componenets available in "powercord/components/settings".
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.getSetting = props.getSetting;
        this.toggleSetting = props.toggleSetting;
    }

    /**
     * Renderer, this is what's being executed on line 22 of index.js
     * The example here displays a toggle between displaying a cat or a dog.
     * */

    render() {
        return (
            <div>
                <SwitchItem
                    value={this.getSetting('displayMessages', true)}
                    onChange={() => {
                        this.toggleSetting('displayMessages');
                    }}
                    note="If disabled, badges won't be shown next to message timestamps."
                >
                    Show next to message timestamps
                </SwitchItem>
                <SwitchItem
                    value={this.getSetting('displayMembers', true)}
                    onChange={() => {
                        this.toggleSetting('displayMembers');
                    }}
                    note="If disabled, badges won't be shown in the member list."
                >
                    Show in Member List
                </SwitchItem>
            </div>
        );
    }
};
