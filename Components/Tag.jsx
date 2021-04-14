const { React } = require('powercord/webpack');

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

class Tag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { userType: userTypes.NONE };
    }

    getTagText(tagType) {
        const customTextEnabled = this.props.settings.get(
            'customTagText',
            false
        );
        const tagText = this.props.settings.get(`${tagType}TagText`);
        return customTextEnabled ? tagText : DEFAULT_TAG_TEXTS[tagType];
    }

    render() {
        if (!this.props.className || !this.props.userType) return null;
        if (
            this.props.userType === userTypes.SOWNER ||
            this.props.userType === userTypes.GOWNER
        ) {
            return (
                <div className={`${this.props.className}`}>
                    {this.getTagText('owner')}
                </div>
            );
        } else if (this.props.userType === userTypes.ADMIN) {
            return (
                <div className={`${this.props.className}`}>
                    {this.getTagText('admin')}
                </div>
            );
        } else if (this.props.userType === userTypes.MOD) {
            return (
                <div className={`${this.props.className}`}>
                    {this.getTagText('mod')}
                </div>
            );
        } else if (this.props.userType === userTypes.STAFF) {
            return (
                <div className={`${this.props.className}`}>
                    {this.getTagText('staff')}
                </div>
            );
        }
        return null;
    }
}

Tag.cache = {};
module.exports = Tag;
