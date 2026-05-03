import './Chat.css'
import { useEffect, useState, useRef } from 'react'

export default function Chat() {
    useEffect(() => {
      document.title = "Chat | PetLink";
    }, []);

    /* CHAT */

    const [activeChat, setActiveChat] = useState(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "nearest"
        });
    }
};

    const contacts = [
        {id: 1, name: "Daniela", role: "animal-sitter"},
        {id: 2, name: "Filipe", role: "dog-owner"},
        {id: 3, name: "Rodrigo", role: "cat owner"},
        {id: 4, name: "Daddy", role: "animal lover"},
        {id: 5, name: "João", role: "cat-sitter"},
        {id: 6, name: "Ricardo", role: "cat-owner"},
        {id: 7, name: "Dar banho ao gato", role: "animal-sitter"},
    ];

    const [searchTermContacts, setSearchTermContacts] = useState("");

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLocaleLowerCase().includes(searchTermContacts.toLocaleLowerCase())
    );

    /* MESSAGES */
    
    const [messages, setMessages] = useState([
        { id: 101, contactId: 1, text: "Hi! Can you walk Jack tomorrow?", sender: "me", time: "7:00pm" },
        { id: 102, contactId: 1, text: "Sure! I love Jack.", sender: "them", time: "08:00am" },
        { id: 103, contactId: 1, text: "Great! At what time can you be there?.", sender: "me", time: "08:35am" },
        { id: 104, contactId: 1, text: "I will be there at 2pm. Please have him ready for his walk.", sender: "them", time: "09:45am" },
        { id: 105, contactId: 1, text: "Sounds great, see you then!", sender: "me", time: "09:45am" },
        { id: 106, contactId: 2, text: "I've asked Daniela if she could walk the dogs", sender: "me", time: "07:02pm" },
        { id: 107, contactId: 2, text: "Great, let's see what she says.", sender: "them", time: "08:45pm" },
        { id: 108, contactId: 2, text: "She's in!", sender: "them", time: "08:30am" },
        { id: 109, contactId: 2, text: "Ask her at what time she can be here  to take Jack for his walk, please. I need to know soon.", sender: "me", time: "09:40am" },
        { id: 110, contactId: 3, text: "How are the cats today?", sender: "me", time: "03:13pm" },
        { id: 111, contactId: 3, text: "Hmm... Quiwi just spilt another glass of water...", sender: "them", time: "04:33pm" },
        { id: 112, contactId: 4, text: "Good Two-Bags has just come in.", sender: "them", time: "02:10pm" },
        { id: 114, contactId: 5, text: "Hello, I have 2 cats and I need a cat sitter for the weekend. Ricardo recommended you.", sender: "me", time: "09:04am" },
        { id: 115, contactId: 5, text: "Hello, yes. I'm available for this weekend. Where is your house?", sender: "them", time: "09:30am" },
        { id: 116, contactId: 5, text: "We're in Rio Tinto.", sender: "me", time: "09:40am" },
        { id: 117, contactId: 5, text: "I'll take care of Quiwi and Sushi, don't worry.", sender: "me", time: "09:45am" },
        { id: 118, contactId: 6, text: "Hey! I found a really cool cat-sitter in Rio Tinto.", sender: "them", time: "08:09pm" },
        { id: 119, contactId: 6, text: "Great, can you send me the profile?", sender: "me", time: "09:25pm" },
        { id: 120, contactId: 6, text: "Sure, here's the link: www.petlink.com/joao", sender: "them", time: "11:05pm" },
        { id: 121, contactId: 7, text: "Boa tarde, queria marcar dois banhos de gato para o próximo sábado à tarde. Tem disponibilidade?", sender: "me", time: "12:45pm" },
        { id: 122, contactId: 7, text: "Sim. Pode trazê-los às 15h. Até lá.", sender: "them", time: "14:05pm" },
    ]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);

    const [message, setMessage] = useState("");

    const chatHistory = messages.filter(msg => msg.contactId === activeChat);

    const [searchTermMsg, setSearchTermMsg] = useState("");

    const filteredMessages = chatHistory.filter(msg =>
        msg.text.toLowerCase().includes(searchTermMsg.toLowerCase())
    );

    const getLastMessage = (contactId) => {
        const contactHistory = messages.filter(msg => msg.contactId === contactId);
        return contactHistory.length > 0 ? contactHistory[contactHistory.length - 1] : null;
    }

    const handleSendMessage = () => {
        if (!message.trim() || !activeChat) 
            return;

        const newMessage = {
            id: Date.now(),
            contactId: activeChat,
            text: message,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages([...messages, newMessage]);
        
        setMessage("");
    };

    const deleteLastMessage = () => {
        if (messages.length === 0) return;
        setMessages(prevMessages => prevMessages.slice(0, -1));
    };

    /* TEXT AREA */

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
                                            {lastMsgObj ? lastMsgObj.time : ""}
                                        </span>
                                        <span> </span>
                                        {lastMsgObj ? lastMsgObj.text : ""}
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
                        <div ref={messagesEndRef} />
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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button className="send-message-btn" onClick={handleSendMessage}>Send</button>
                        <button className="attachment-btn delete-btn" onClick={deleteLastMessage} title="Delete last message">
                            <span className="btn-icon">🗑️</span>
                        </button>
                    </footer>                
                    </>
                ) : (
                    <p> </p>
                )}
            </main>
        </div>
    );
}
