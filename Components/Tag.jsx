const { React } = require('powercord/webpack');

const userTypes = {
    NONE: 'None',
    STAFF: 'Staff',
    MOD: 'Mod',
    ADMIN: 'Admin',
    SOWNER: 'Server Owner',
    GOWNER: 'Group Owner',
};


class Tag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { userType: userTypes.NONE };
    }

    render() {
        if (!this.props.className || !this.props.userType) return null;
        if (this.props.userType === userTypes.SOWNER || this.props.userType === userTypes.GOWNER) {
            return <div className={`${this.props.className}`}>Owner</div>;
        } else if (this.props.userType === userTypes.ADMIN) {
            return <div className={`${this.props.className}`}>Admin</div>;
        } else if (this.props.userType === userTypes.MOD) {
            return <div className={`${this.props.className}`}>Mod</div>;
        } else if (this.props.userType === userTypes.STAFF) {
            return <div className={`${this.props.className}`}>Staff</div>;
        }
        return null;
    }
}

Tag.cache = {};
module.exports = Tag;
