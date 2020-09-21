/* Essential Packages */
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { getModule } = require('powercord/webpack');

/* Plugin Specific Packages */
const { ContextMenu } = require('powercord/components');
const { getOwnerInstance } = require('powercord/util');
const { name, shorthand } = require('./manifest.json'); // -> name: 'Project Name', shorthand: 'pName'

/* Settings */
const Settings = require('./Components/Settings.jsx');

module.exports = class MyPlugin extends Plugin {
    /* Entry Point */
    async startPlugin() {
        /* Register Settings */
        powercord.api.settings.registerSettings(shorthand, {
            category: this.entityID,
            label: name, // Label that appears in the settings menu
            render: Settings // The React component to render. In this case, the imported Settings file
        });

        /**
         * The following is an example of adding an option to an image's context menu,
         * which changes the image to a picture of a dog/cat based on the setting.
         */

        // Discord is made up of thousands of modules, the following lines look for the modules which meet the specified filters.
        this.imageWrapper = await getModule(['imageWrapper']);
        const injectInto = await getModule(
            m => m.default && m.default.displayName === 'MessageContextMenu'
        );

        /**
         * The following injects a function into the specified module.
         * Parameter 1: The InjectionID, used to uninject.
         * 2: The module you want to inject into.
         * 3: The function name you want to target.
         * 4: The function you want to inject.
         */
        inject(shorthand, injectInto, 'default', (event, res) => {
            const target = event[0].target;

            /** Only add to the Menu when the target is an image
             * and the parent element(module) contains an imageWrapper */
            if (target.tagName.toLowerCase() === 'img') {
                let displayCat = this.settings.get('displayCat');

                // Push new ContextMenu item to res.props.children
                res.props.children.push(
                    ...ContextMenu.renderRawItems([
                        {
                            type: 'button',
                            name: `Display ${displayCat ? 'Cat' : 'Dog'}`,
                            id: `${shorthand}-button` /* When adding items, make sure all of the id's are different */,
                            onClick: () => {
                                /* This is the function that is executed when the button is clicked */
                                target.src = displayCat
                                    ? 'https://i.imgur.com/cqAklTF_d.webp'
                                    : 'https://i.imgur.com/rpQdRoY_d.webp?maxwidth=728&fidelity=grand';
                            }
                        }
                    ])
                );
            }

            return res;
        });
    }

    pluginWillUnload() {
        // When the plugin is unloaded, we need to unregister/uninject anything we've registered/injected.
        powercord.api.settings.unregisterSettings(shorthand);
        uninject(shorthand);
    }
};
