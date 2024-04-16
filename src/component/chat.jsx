import styled from "../component/chat.module.css";
import { BiSend } from "react-icons/bi";
import { AiFillLike } from "react-icons/ai";
import { useState } from "react";
import {GrEmoji} from 'react-icons/gr';
import Picker from 'emoji-picker-react';
import io from 'socket.io-client'
import { useEffect } from "react";

const socket = io('https://exact-spaceapi.onrender.com');
function Chat()
{
    const [message,setMessage]=useState('')
    const [messagedetail,setMessagedetail]=useState([])
    const [showemoji,setShowemoji]=useState(false)
    const [filteruser, setFilteruser]=useState([])

    const User_List=["Alan", "Bob", "Carol", "Dean", "Elin"]
    const onEmojiClick = (event, emojiObject) => {
        const emoji = event.emoji;
        setMessage(prevMessage => prevMessage + emoji);
      };
      useEffect(() => {
        const handleReceivedMessage = (data) => {
            setMessagedetail((prevMessages) => [...prevMessages, data]);
        };
    
        socket.on('chat message', handleReceivedMessage);
    
        return () => {
          socket.off('chat message', handleReceivedMessage);
        };
      }, []);
   
//  function for working  @ to show user lists
    function chatmessage(e)
    {
        e.preventDefault()
        let inputvalue=e.target.value;
         setMessage(inputvalue)

       
        let last_index= inputvalue.lastIndexOf('@')
        if (last_index !==-1)
        {
            const msg =inputvalue.slice(last_index + 1).toLowerCase();
            
            const filterduserlist=User_List.filter(user_data=>user_data.toLowerCase().startsWith(msg))
            // console.log(filterduserlist)
   
            setFilteruser(filterduserlist );
            
          
        }
        else{
          
            setFilteruser([])
           
        }
    }
    // function setting username in chatbox
    function handleinput(username)
    {
        setMessage((prevstate)=>{
            console.log(username,"prev")
           const lastindex=prevstate.lastIndexOf('@')
           const updatemessage= prevstate.slice(0,lastindex +1)+username+" "
           return updatemessage


        })
        
        setFilteruser([])
    }
    //  function for toogle emoji
    function toogleemoji()
    {
        setShowemoji((prev)=>!prev)

    }
    // function for submit
    function handlesubmit(e){
        e.preventDefault();
        const username = User_List[Math.floor(Math.random() * User_List.length)];
        console.log(username)
        const data = { username, message, like: 0, timestamp: new Date() };
        socket.emit('chat message', data);
        setMessage("")     
        
    }
    //  function for update like
    function updatelike(index)
    {
        setMessagedetail( (prevMessages) => {
            const updatedMessages = [...prevMessages];
            const updatedMessage = { ...updatedMessages[index] };
            updatedMessage.like++;
            updatedMessages[index] = updatedMessage;
            return updatedMessages;
          });
    }
    //  function for coverting time
    function showtime(timestamp)
    {
        const date = new Date(timestamp);
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }
    function getProfileColor (username)  {
        const firstLetter = username.charAt(0).toLowerCase();
        const colors = {
          a: '#FFCDD2',
          b: '#F8BBD0',
          c: '#E1BEE7',
          d: '#D1C4E9',
          e: '#C5CAE9',
          // Add more colors for other letters
        };
    
        return colors[firstLetter] || '#FFFFFF'; // Default color if letter not found
      };
    return(
        <>
                <div className={styled.navbarbox}>
            <h3>Introductions </h3>
            <p> This Channel Is For Company Wide Chatter</p>
            
        </div>
        
        <div className={styled.chatconatiner}>

            {messagedetail.map((msg,index)=>(
                <>
                <div className={styled.chatbox} key={index}>
                <div className={styled.profile} style={{backgroundColor:getProfileColor(msg.username.charAt(0))}}>
                    <strong>{msg.username.charAt(0)}</strong>
                </div>
                <div className={styled.userdetail}>
                    <div className={styled.username}>
                        <h3>{msg.username}</h3>
                        <br />
                        <small> {showtime(msg.timestamp)}</small>

                    </div>
                    <div className={styled.messagebox}>
                        <p> {msg.message}</p>
                    </div>

                </div>
                <button className={styled.btnlike} onClick={()=>updatelike(index)}>
                    <AiFillLike/> {msg.like}
                </button>
            </div>
                
            </>
            ))}
             <>
             {filteruser.map((user_name)=>
             <>
            <div className={styled.list} onClick={()=>handleinput(user_name)} >
            {user_name}
    
        </div>
        </>
        
        
          )}
            
            </>
                
            <div className={styled.inputbox}>

                <input type="text" value={message} onChange={chatmessage} placeholder="Type Message" />

                <div className={styled.Emojiconatiner}>
                    <button className={styled.EmojiButton} onClick={toogleemoji}>
                      <GrEmoji style={{height:"35px",width:"30px"}}/>

                    </button>
                    {showemoji &&(
                        <div className={styled.EmojiPicker}>
                             <Picker pickerStyle={{ width: '100%' }} onEmojiClick={onEmojiClick} />
                        </div>
                    )}


                </div>
                <button className={styled.submitbutton} onClick={handlesubmit}>
                    <BiSend />
                    
                </button>

            </div>

        </div>
        </>
    )
}

export default Chat



