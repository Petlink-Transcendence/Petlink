import './Chat.css'
import { useEffect, useState, useRef } from 'react'

export default function Chat() {
    useEffect(() => {
      document.title = "Chat | PetLink";
    }, []);

    {/*tracks which contact is currently selected*/}
    const [activeChat, setActiveChat] = useState(null);

    const contacts = [
        {id: 1, name: "Daniela", role: "animal-sitter", time: "10:13am", unread: 2},
        {id: 2, name: "Filipe", role: "dog-owner", time: "10:05am", unread: 0},
        {id: 3, name: "Rodrigo", lastMsg: "Quiwi just spilt another glass of water...", role: "cat owner", time: "11:33pm", unread: 0},
        {id: 4, name: "Daddy", lastMsg: "Good Two-Bags has just come in.", role: "animal lover", time: "6:35pm", unread: 2},
        {id: 5, name: "Ricardo", lastMsg: "I found a really cool cat-sitter in Rio Tinto.", role: "cat owner",  time: "2:01pm", unread: 2},
        {id: 6, name: "Daniela", lastMsg: "I will be there at 2pm. Please have Jack ready for his walk.", role: "animal-sitter", time: "10:13am", unread: 2},
        {id: 7, name: "Filipe", lastMsg: "Ask her at what time she can be here  to take Jack for his walk, please. I need to know soon.", role: "dog-owner", time: "10:05am", unread: 0},
        {id: 8, name: "Rodrigo", lastMsg: "Quiwi just spilt another glass of water...", role: "cat owner", time: "11:33pm", unread: 0},
        {id: 9, name: "Daddy", lastMsg: "Good Two-Bags has just come in.", role: "animal lover", time: "6:35pm", unread: 2},
        {id: 10, name: "Ricardo", lastMsg: "I found a really cool cat-sitter in Rio Tinto.", role: "cat owner",  time: "2:01pm", unread: 2},
    ];

    const allMessages = [
        { id: 101, contactId: 1, text: "Hi! Can you walk Jack tomorrow?", sender: "me", time: "7:00pm" },
        { id: 102, contactId: 1, text: "Sure! I love Jack.", sender: "them", time: "08:00am" },
        { id: 103, contactId: 1, text: "Great! At what time can you be there?.", sender: "me", time: "08:35am" },
        { id: 104, contactId: 1, text: "I will be there at 2pm. Please have him ready for his walk.", sender: "them", time: "09:45am" },
        { id: 105, contactId: 1, text: "Sounds great, see you then!", sender: "me", time: "09:45am" },


        { id: 201, contactId: 2, text: "I've talked to her. She's in for today.", sender: "me", time: "08:30am" },
        { id: 202, contactId: 2, text: "Ask her at what time she can be here  to take Jack for his walk, please. I need to know soon.", sender: "them", time: "09:40am" },
    ];

    const [searchTermContacts, setSearchTermContacts] = useState("");

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLocaleLowerCase().includes(searchTermContacts.toLocaleLowerCase())
    );

    const [searchTermMsg, setSearchTermMsg] = useState("");

    const chatHistory = allMessages.filter(msg => msg.contactId === activeChat);

    const filteredMessages = chatHistory.filter(msg =>
        msg.text.toLowerCase().includes(searchTermMsg.toLowerCase())
    );

    const getLastMessage = (contactId) => {
        const messages = allMessages.filter(msg => msg.contactId === contactId);
        return message.length > 0 ? messages[messages.length -1] : null;
    }
    
    const [message, setMessage] = useState("");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    });

    return(
        <div className="chat-container">

            {/*Sidebar */}
            <aside className="chat-sidebar">

                {/*Header */}
                <div className="sidebar-header">
                <h2 className="title">My <span className="title-messages">Messages</span></h2>
                </div>

                <div className="search-box">
                    <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search contacts..." 
                        className="search-input"
                        onChange={(e) => setSearchTermContacts(e.target.value)}
                    />
                    </div>
                </div>


                {/*Contact list */}
                <div className="contact-list">
                    {filteredContacts.map(contact => {
                        const lastMsgObj = getLastMessage(contact.id);

                        return (
                            <div 
                                key={contact.id} 
                                className={`contact-item ${activeChat === contact.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(contact.id)}
                                >
                                
                                <div className="contact-avatar">{contact.name[0]}</div>

                                <div className="contact-info">
                                    <div className="contact-top">
                                    <span className="contact-name">{contact.name}, {contact.role}</span>
                                    </div>

                                    <p className="contact-last-msg">
                                        
                                        <span className="contact-time">
                                            {lastMsgObj ? lastMsgObj.time : "time"}
                                        </span>: {lastMsgObj ? lastMsgObj.text : "msg"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            <main className="chat-window">
                {activeChat ? (
                    <>

                    {/* Header */}
                    <header className="chat-header">
                        <div className="header-info">
                        <div className="header-avatar">
                            {contacts.find(c => c.id === activeChat)?.name[0]}
                        </div>
                        <div>
                            <h3>{contacts.find(c => c.id === activeChat)?.name}, {contacts.find(c => c.id === activeChat)?.role} </h3>
                        </div>
                        </div>

                        <div className="search-box">
                            <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search for messages..." 
                                className="search-input"
                                onChange={(e) => setSearchTermMsg(e.target.value)}
                            />
                            </div>
                        </div>
                    </header>

                    {/* Messages Area */}
                    <div className="messages-container">
                        {filteredMessages.length > 0 ? (
                            filteredMessages.map((msg) => (
                                <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                    <p>{msg.text}</p>
                                    <div className="msg-footer">
                                        <span className="msg-time">{msg.time}</span>
                                        {msg.sender === 'me' && <span className="read-status">✓✓</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='no-results'>No messages found.</p>
                        )}
                    </div>
                        

                    {/* Input Area */}
                    <footer className="chat-input-container">
                        <button className="attachment-btn">+</button>
                        <textarea 
                            ref={textareaRef}
                            className="chat-input-textarea"
                            placeholder="Type a message..." 
                            value={message}
                            rows={1}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="send-message-btn">Send</button>
                    </footer>                
                    </>
                ) : (                
                    <p> </p>
                )}
            </main>
        </div>
    );
}
