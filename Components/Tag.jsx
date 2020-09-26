const { React } = require('powercord/webpack');

const userTypes = {
    NONE: 0,
    STAFF: 1,
    MOD: 2,
    ADMIN: 3,
    OWNER: 4
};

class Tag extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { userType: userTypes.NONE };
    }

    render() {
        if (!this.props.className || !this.props.userType) return null;
        if (this.props.userType === userTypes.OWNER) {
            return <div className={`${this.props.className}`}>Owner</div>;
        } else if (this.props.userType === userTypes.ADMIN) {
            return <div className={`${this.props.className}`}>Admin</div>;
        } else if (this.props.userType === userTypes.MOD) {
            return <div className={`${this.props.className}`}>Mod</div>;
        } else if (this.props.userType === userTypes.STAFF) {
            return <div className={`${this.props.className}`}>asdasd</div>;
        }
        return null;
    }
}

Tag.cache = {};
module.exports = Tag;
