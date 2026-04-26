import './Chat.css'
import { useEffect } from 'react'
import { useState } from 'react';

export default function Chat() {
    useEffect(() => {
      document.title = "Chat | PetLink";
    }, []);

    {/*tracks which contact is currently selected*/}
    const [activeChat, setActiveChat] = useState(null);

    const contacts = [
        {id: 1, name: "Daniela", lastMsg: "I will be there at 2pm. Please have Jack ready for his walk.", role: "animal-sitter", time: "10:13am", unread: 2},
        {id: 2, name: "Filipe", lastMsg: "Ask her at what time she can be here  to take Jack for his walk, please. I need to know soon.", role: "dog-owner", time: "10:05am", unread: 0},
        {id: 3, name: "Rodrigo", lastMsg: "Quiwi just spilt another glass of water...", role: "cat owner", time: "11:33pm", unread: 0},
        {id: 4, name: "Daddy", lastMsg: "Good Two-Bags has just come in.", role: "animal lover", time: "6:35pm", unread: 2},
        {id: 5, name: "Ricardo", lastMsg: "I found a really cool cat-sitter in Rio Tinto.", role: "cat owner",  time: "2:01pm", unread: 2},
        {id: 6, name: "Daniela", lastMsg: "I will be there at 2pm. Please have Jack ready for his walk.", role: "animal-sitter", time: "10:13am", unread: 2},
        {id: 7, name: "Filipe", lastMsg: "Ask her at what time she can be here  to take Jack for his walk, please. I need to know soon.", role: "dog-owner", time: "10:05am", unread: 0},
        {id: 8, name: "Rodrigo", lastMsg: "Quiwi just spilt another glass of water...", role: "cat owner", time: "11:33pm", unread: 0},
        {id: 9, name: "Daddy", lastMsg: "Good Two-Bags has just come in.", role: "animal lover", time: "6:35pm", unread: 2},
        {id: 10, name: "Ricardo", lastMsg: "I found a really cool cat-sitter in Rio Tinto.", role: "cat owner",  time: "2:01pm", unread: 2},
    ];

    const [searchTerm, setSearchTerm] = useState("");


    const filteredContacts = contacts.filter(contact =>
        contact.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    );

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
                        className="contact-search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    </div>
                </div>


                {/*Contact list */}
                <div className="contact-list">
                {filteredContacts.map(contact => (
                    
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

                        <p className="contact-last-msg"><span className="contact-time">{contact.time}</span>: {contact.lastMsg}</p>
                    </div>
                    
                    </div>
                ))}
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
                            <h3>{contacts.find(c => c.id === activeChat)?.name}</h3>
                            <span className="status-indicator">Online</span>
                        </div>
                        </div>
                    </header>

                    {/* Messages Area */}
                    {/* Input Area */}
                    
                    </>
                ) : (                
                    /* No selection - empty */    
                    <div className="empty-state">
                        <h2>Select a contact to start messaging</h2>
                    </div>

                )}
            </main>
        </div>
    );
}
