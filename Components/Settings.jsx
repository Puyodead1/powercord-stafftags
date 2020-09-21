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
                    value={this.getSetting('displayCat', true)}
                    onChange={() => {
                        this.toggleSetting('displayCat');
                    }}
                    note='If disabled, the image will change to a dog instead.'
                >
                    Display Cat
                </SwitchItem>
            </div>
        );
    }
};
