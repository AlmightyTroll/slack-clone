import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';

import { db, auth } from '../firebase';

import { useAuthState } from 'react-firebase-hooks/auth';

import { Button } from '@material-ui/core/';


const ChatInput = ({channelName, channelId, chatRef}) => {

    const [input, setInput] = useState("")
    const [user] = useAuthState(auth)

    const sendMessage = (e) => {
        e.preventDefault()

        if (!channelId) {
            return false
        }

        db.collection('rooms').doc(channelId).collection('messages').add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL
        })
        //causes chat to scroll to the bottom after each new message.
        chatRef.current.scrollIntoView({
            behavior: "smooth"
        })

        setInput("")
    }

    return (
        <ChatInputContainer>
            <form >
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message #${channelName}`} />
                <Button 
                    hidden type='submit' 
                    onClick={sendMessage} 
                >
                    SEND
                </Button>
            </form>
        </ChatInputContainer>
    )
};

export default ChatInput;

const ChatInputContainer = styled.div`
    border-radius: 20px;

    > form {
        position: relative;
        display: flex;
        justify-content: center;
    }

    > form > input {
        position: fixed;
        bottom: 30px;
        width: 60%;
        border: 1px solid gray;
        border-radius: 3px;
        outline: none;
        padding: 20px;
    }

    > form > button {
        display: none !important;
    }
`;
