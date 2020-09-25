const { React } = require('powercord/webpack');

const userTypes = {
    NONE: 0,
    MANAGEMENT: 1,
    ADMIN: 2,
    OWNER: 3
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
        } else if (this.props.userType === userTypes.MANAGEMENT) {
            return <div className={`${this.props.className}`}>Staff</div>;
        }
        return null;
    }
}

Tag.cache = {};
module.exports = Tag;
