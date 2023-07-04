import React, { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage';
import { POST, URL } from './config';
import { useSocket } from './SocketProvider';
import { useCallback } from 'react';

const ConversationContext = createContext()

export function useConversation() {
    return useContext(ConversationContext);
}

async function getConversationDetails(conversations) {
    for (let i = 0; i < conversations.length; i++) {
        let data = await fetch(URL + "get-details/" + conversations[i].id);
        let jsondata = await data.json();
        conversations[i].name = jsondata.name;
        conversations[i].dp = jsondata.dp;
        conversations[i].status = jsondata.status;
        conversations[i].talkingTo = jsondata.talkingTo;
    }
    return conversations;
}

export default function ConversationProvider({ children, myProfile, setMyProfile, setId }) {
    const [conversations, setConversations] = useLocalStorage('conversations', []);
    const [contacts, setContacts] = useState([])
    const [activeConversationIdx, setActiveConversationIdx] = useState(null);
    const { socket } = useSocket();

    useEffect(() => {
        setContacts(conversations.map(conv => conv.id))
    }, [conversations]);

    useEffect(() => {
        if(!socket) return () => {};
        let isInChat = activeConversationIdx !== null && activeConversationIdx !== -1;
        let id = isInChat ? conversations[activeConversationIdx].id : "No One";
        let name = isInChat ? conversations[activeConversationIdx].name : "";
        socket.emit('set-talking-to', {talkingId: id, talkingName: name})
    }, [activeConversationIdx])

    function createContact(id) {
        let ids = conversations.map(conv => conv.id);
        if (ids.includes(id)) {
            console.log("Contact already exists");
            return;
        }
        fetch(URL + "get-details/" + id).then(data => data.json().then(({ name, dp, status, talkingTo }) => {
            setConversations(prev => {
                setContacts(cont => [...cont, id]);
                if(activeConversationIdx !== null) setActiveConversationIdx(p => p+1);
                return [{ id, name, dp, status, talkingTo, msg: [], seen: 0 }, ...prev]
            });
        }))
    }
    function updateBlueTick(sender){
        if(!contacts.includes(sender)) return;
        setConversations(prev => {
            let newConv = [...prev];
            for(let i = 0; i < newConv.length; i++){
                if(newConv[i].id === sender){
                    newConv[i].seen = 0;
                    break;
                }
            }
            return newConv;
        })
    }
    function logOut() {
        const conf = window.confirm("Are you sure? All your chats & contacts will be lost forever !");
        if (!conf) return;
        setConversations([]);
        setId('');
    }
    async function deleteAccount() {
        const conf = window.confirm("Are you sure? All your chats & contacts will be lost forever !");
        if (!conf) return;
        let jsonData = await POST('delete-account', { id: myProfile.id });
        if (!jsonData.success) {
            alert(jsonData.message);
            return;
        }
        setConversations([]);
        setId('');
    }
    useEffect(() => {
        getConversationDetails(conversations).then(conv => {
            setConversations([...conv]);
        });
    }, [])

    const addMsgToConversation = useCallback((id, msg) => {
        if (!contacts.includes(id)) {
            fetch(URL + "get-details/" + id).then(data => data.json().then(({ name, dp, status, talkingTo }) => {
                setContacts(cont => [...cont, id]);
                setConversations(prev => [{ id, name, dp, status, talkingTo, msg: [msg], seen: 1 }, ...prev])
                setActiveConversationIdx(prev => prev + 1);
                return;
            }))
        } else {
            let idx = -1;
            setConversations(prev => {
                let newConversations = prev.map((conv, i) => {
                    if (conv.id === id) {
                        idx = i;
                        return { ...conv, msg: [msg, ...conv.msg], seen: conv.seen+1 };
                    }
                    return conv;
                })
                const popped = newConversations.splice(idx, 1)[0];
                newConversations.unshift(popped);
                let currChatIdx = activeConversationIdx;

                if (currChatIdx !== null) {
                    if (msg.fromMe) currChatIdx = 0;
                    else if (currChatIdx === idx) {
                        currChatIdx = 0;
                        socket.emit('blue-tick', {recipient: id, sender: myProfile.id});
                    } else if (idx > currChatIdx) 
                        currChatIdx++;
                    setActiveConversationIdx(currChatIdx);
                }
                return newConversations;
            })
        }
    }, [activeConversationIdx])

    useEffect(() => {
        if (socket == null) return () => { }
        socket.on('receive-message', ({ sender, text, time }) => {
            let msg = { text, time, seen: false, fromMe: false };
            addMsgToConversation(sender, msg);
        });
        socket.on('online-status', ({ id, online }) => {
            if (contacts.includes(id)) {
                let status = online ? "Online" : new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' })
                setConversations(prev =>
                    prev.map(conv => {
                        if (conv.id === id) return { ...conv, status }
                        return conv
                    })
                )
            }
        })
        return () => {
            socket.off('receive-message');
            socket.off('online-status');
        }
    }, [socket, addMsgToConversation])

    function sendMsg(id, msg) {
        addMsgToConversation(id, msg);
        socket.emit('send-message', {
            recipient: id,
            text: msg.text,
            time: msg.time
        })
    }

    let value = {
        myProfile,
        setMyProfile,
        contacts,
        setContacts,
        conversations,
        setConversations,
        activeConversation: conversations[activeConversationIdx],
        selectConversation: setActiveConversationIdx,
        sendMsg,
        createContact,
        logOut,
        deleteAccount,
    }
    return (
        <>
            {socket &&
                <ConversationContext.Provider value={value}>
                    {children}
                </ConversationContext.Provider>
            }
        </>
    )
}
