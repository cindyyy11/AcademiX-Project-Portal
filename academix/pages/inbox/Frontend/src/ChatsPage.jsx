

import {MultiChatSocket, MultiChatWindow, useMultiChatLogic} from 'react-chat-engine-advanced'

import PropTypes from 'prop-types';

const ChatsPage = (props) => {
    const chatProps = useMultiChatLogic(
        'b8307690-7d78-4f99-9641-603325172afe', 
        props.user.username, 
        props.user.secret
    );
    return (
        <div style={{height: '100vh'}}>
            <MultiChatSocket {...chatProps}/>
            <MultiChatWindow {...chatProps} style={{height: '100vh'}}/>
        </div>
    )
}

ChatsPage.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        secret: PropTypes.string.isRequired
    }).isRequired
};

export default ChatsPage;


