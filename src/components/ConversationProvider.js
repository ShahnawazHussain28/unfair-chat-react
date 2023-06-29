import React, { createContext, useContext, useState } from 'react'
import useLocalStorage from './useLocalStorage';

const ConversationContext = createContext()

export function useConversation(){
    return useContext(ConversationContext);
}

export default function ConversationProvider({ children }) {
    const [conversations, setConversations] = useLocalStorage('conversations', []);
    const [activeConversationIdx, setActiveConversationIdx] = useState(0);
    function createContact(id, name){
        let ids = conversations.map(conv => conv.id);
        if(ids.includes(id)){
            console.log("Contact already exists");
            return;
        }
        setConversations(prev => {
            return [{id, name, msg: []}, ...prev]
        });
    }
    function setMessage(id, name, msg){
        setConversations(prev => {
            let newChat = true;
            let newConversations = prev.map(conv => {
                if(conv.id === id){
                    newChat = false;
                    return {...conv, msg: [msg, ...conv.msg]};
                }
                return conv
            })

            if(!newChat){
                let idx = newConversations.findIndex(conv => conv.id === id);
                const popped = newConversations.splice(idx, 1)[0];
                newConversations.unshift(popped);
                return newConversations;
            } else {
                return [{id, name, msg: []}, ...prev]
            }
        })
    }
    let value = {
        conversations, 
        setConversations,
        activeConversation: conversations[activeConversationIdx], 
        selectConversation: setActiveConversationIdx,
        setMessage,
        createContact
    }
    return (
        <ConversationContext.Provider value={value}>
            {children}
        </ConversationContext.Provider>
    )
}
