import React from 'react'
import { useEffect, useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { CHECK_CHAT_ENABLED } from '../../utils/constants'
import EmptyChatState from './EmptyChatState'
import ChatComponent from '../admin/chat'
import { useDispatch } from 'react-redux'
import { closeChat } from '../../features/chatSlice'

const CandidateChat = () => {
    const dispatch = useDispatch();
    const [isChat, setIsChat] = useState(false);
    const [message, setMessage] = useState("");

    const checkChatEnabled = async ()=>{
        try{
            const response = await apiClient.get(
                CHECK_CHAT_ENABLED,
                {withCredentials: true}
            );

            if(response.status===200){
                if(response.data.isChatEnabled === false){
                    setIsChat(false);
                    setMessage(response.data.message);
                } else{
                    setIsChat(true);
                }
            }
        } catch(err){
            console.error("error in checking the chat is enabled or not: ",err.message);
        }
    }
    useEffect(() => {
      checkChatEnabled();
    }, [])
    
    useEffect(() => {
      return () => {
        dispatch(closeChat());
      }
    }, [])
    
    return (
        <>
        
        {
            isChat? <div className='px-3 md:px-6 pt-2.5'><ChatComponent/> </div>: <EmptyChatState message={message}/>
        }
        </>
    )
}

export default CandidateChat
