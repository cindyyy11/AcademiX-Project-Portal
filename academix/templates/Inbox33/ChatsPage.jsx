// import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';


// const ChatsPage = ({user}) => {
//     console.log(user);
//     const chatProps = useMultiChatLogic({
//         projectId: 'b8307690-7d78-4f99-9641-603325172afe', 
//         username: user.username, 
//         secret: user.secret

//     });
//     console.log(chatProps.projectId.username);
//     console.log(chatProps);

//     return (
//         <div style={{ height: '100vh' }}>
//             <MultiChatSocket {...chatProps} />
//             <MultiChatWindow {...chatProps} style={{ height: '100vh' }} />
//         </div>
//     );
// };

// export default ChatsPage;


import React from 'react';
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from 'react-chat-engine-advanced'; // Replace with actual imports

const ChatsPage = ({ user }) => {
    // Extract username and secret from user prop
    const { username, secret } = user;

    // Construct chatProps object
    const chatProps = {
        projectId: 'b8307690-7d78-4f99-9641-603325172afe', // Replace with actual projectId
        username,
        secret,
    };

    // Use useMultiChatLogic hook to get chat logic props
    const chatLogicProps = useMultiChatLogic(chatProps);
    

    console.log('chatLogicProps:', chatLogicProps);

    return (
        <div style={{ height: '100vh' }}>
            {/* Render MultiChat components with chatLogicProps */}
            <MultiChatSocket {...chatLogicProps} projectId={chatLogicProps.projectId.projectId} username={chatLogicProps.projectId.username} secret={chatLogicProps.projectId.secret}/>
            <MultiChatWindow {...chatLogicProps} style={{ height: '100vh' }}/>
        </div>
    );
};

export default ChatsPage;
