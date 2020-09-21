/* Essential Packages */
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');

/* Plugin Specific Packages */
const { name, shorthand } = require('./manifest.json'); // -> name: 'Project Name', shorthand: 'pName'

/* Settings */
const Settings = require('./Components/Settings.jsx');
const Tag = require('./Components/Tag');

module.exports = class MyPlugin extends Plugin {
    /* Entry Point */
    async startPlugin() {
        this.loadStylesheet('style.scss');
        /* Register Settings */
        powercord.api.settings.registerSettings(shorthand, {
            category: this.entityID,
            label: name, // Label that appears in the settings menu
            render: Settings // The React component to render. In this case, the imported Settings file
        });

        this.classes = await getModule(['profileBadgeStaff']);

        /**
         * The following is an example of adding an option to an image's context menu,
         * which changes the image to a picture of a dog/cat based on the setting.
         */

        // Discord is made up of thousands of modules, the following lines look for the modules which meet the specified filters.
        this.MessageTimestamp = await getModule(['MessageTimestamp']);

        /**
         * The following injects a function into the specified module.
         * Parameter 1: The InjectionID, used to uninject.
         * 2: The module you want to inject into.
         * 3: The function name you want to target.
         * 4: The function you want to inject.
         */
        inject(shorthand, this.MessageTimestamp, 'default', (args, res) => {
            const id = args[0].message.author.id;
            console.log(id);
            const header = res.props.children[1];

            const element = React.createElement(Tag, { userid: id });

            const size = header.props.children.length;
            header.props.children[size] = header.props.children[size - 1];
            header.props.children[size - 1] = element;

            return res;
        });
    }

    pluginWillUnload() {
        // When the plugin is unloaded, we need to unregister/uninject anything we've registered/injected.
        powercord.api.settings.unregisterSettings(shorthand);
        uninject(shorthand);
    }
};
