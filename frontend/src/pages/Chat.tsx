import './Chat.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

interface Message {
    id: number;
    contactId: number;
    text: string;
    sender: 'me' | 'them';
    time: string;
    createdAt: string;
    attachment?: string;
}

interface Contact {
    id: number;
    name: string;
    avatar: string | null;
    online: boolean;
    lastSeen: string | null;
    lastMessage: string | null;
    lastMessageAt: string | null;
    unreadCount: number;
}

interface ChatRouteState {
    openChatId?: number;
    contact?: {
        id?: number;
        name: string;
        role: string;
    };
}

function getToken(): string | null {
    return localStorage.getItem('access');
}

function getCurrentUserId(): number | null {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const rawId = payload.user_id;
        return rawId !== undefined ? Number(rawId) : null;
    } catch {
        return null;
    }
}

async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getToken();
    const res = await fetch(path, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
}

export default function Chat() {
    const location = useLocation();
    const routeOpenChatId = (location.state as ChatRouteState | null)?.openChatId;
    const routeContact = (location.state as ChatRouteState | null)?.contact;

    const currentUserId = getCurrentUserId();

    useEffect(() => {
        document.title = "Chat | PetLink";
    }, []);

    function initials(name: string | undefined | null): string {
        if (!name) return '?';

        const parts = name.trim().split(/[\s_-]+/);

        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }

        return name.trim().slice(0, 2).toUpperCase();
    }

    /* CHAT */
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactsLoading, setContactsLoading] = useState(true);
    const [contactsError, setContactsError] = useState<string | null>(null);
    const [searchTermContacts, setSearchTermContacts] = useState("");
    const openedRouteContactRef = useRef<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const activeChatRef = useRef<number | null>(null);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    };

    /* Load contacts (your connections: people you follow / who follow you) */
    const loadContacts = useCallback(async () => {
        setContactsLoading(true);
        setContactsError(null);
        try {
            const data = await apiFetch('/chat/contacts/');
            const mapped: Contact[] = data.map((c: any) => ({
                id: c.user_id,
                name: c.name || c.username,
                avatar: c.avatar || null,
                online: c.online_status,
                lastSeen: c.last_seen,
                lastMessage: c.last_message,
                lastMessageAt: c.last_message_at,
                unreadCount: c.unread_count,
            }));
            setContacts(mapped);
        } catch (err) {
            setContactsError(err instanceof Error ? err.message : 'Failed to load contacts');
        } finally {
            setContactsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContacts();
    }, [loadContacts]);

    useEffect(() => {
        if (routeOpenChatId === undefined) {
            return;
        }
        const contactById = contacts.find(contact => contact.id === routeOpenChatId);
        if (contactById) {
            setSearchTermContacts("");
            setActiveChat(contactById.id);
        }
    }, [routeOpenChatId, contacts]);

    useEffect(() => {
        if (!routeContact?.name) {
            return;
        }
        if (contactsLoading) {
            return;
        }
        const contactKey = `${routeContact.id ?? 'new'}|${routeContact.name}`;
        if (openedRouteContactRef.current === contactKey) {
            return;
        }
        openedRouteContactRef.current = contactKey;
        setSearchTermContacts("");

        if (routeContact.id !== undefined) {
            const existing = contacts.find(c => c.id === routeContact.id);
            if (existing) {
                setActiveChat(existing.id);
            }
            // NOTE: chat now only shows real connections (people you follow /
            // who follow you). If routeContact isn't in that list, no chat
            // opens here — confirm with the team whether navigating in from
            // e.g. a profile page's "Message" button should be restricted
            // to connections only, or should allow starting a chat with
            // anyone regardless of follow status.
        }
    }, [routeContact?.id, routeContact?.name, contacts, contactsLoading]);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLocaleLowerCase().includes(searchTermContacts.toLocaleLowerCase())
    );

    /* MESSAGES */
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    /* Load message history whenever the active chat changes */
    useEffect(() => {
        if (!activeChat) return;

        let cancelled = false;
        setMessagesLoading(true);

        apiFetch(`/chat/messages/${activeChat}/`)
            .then((data) => {
                if (cancelled) return;
                const mapped: Message[] = data.map((m: any) => ({
                    id: m.id,
                    contactId: m.sender_id === currentUserId ? m.recipient_id : m.sender_id,
                    text: m.content,
                    sender: m.sender_id === currentUserId ? 'me' : 'them',
                    time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    createdAt: m.created_at,
                }));
                setMessages(prev => {
                    // keep messages from OTHER conversations, replace this one
                    const others = prev.filter(msg => msg.contactId !== activeChat);
                    return [...others, ...mapped];
                });
            })
            .catch((err) => {
                console.error('Failed to load messages', err);
            })
            .finally(() => {
                if (!cancelled) setMessagesLoading(false);
            });

        return () => { cancelled = true; };
    }, [activeChat, currentUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);

    const [message, setMessage] = useState("");
    const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);

    const chatHistory = messages
        .filter(msg => msg.contactId === activeChat)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const [searchTermMsg, setSearchTermMsg] = useState("");

    const filteredMessages = chatHistory.filter(msg =>
        msg.text.toLowerCase().includes(searchTermMsg.toLowerCase())
    );

    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachedPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    /* Send over the WebSocket. The backend doesn't echo the message back to
       the sender's own group, so we add it to local state ourselves
       (optimistic update) rather than waiting for a server round-trip. */
    const handleSendMessage = () => {
        if ((!message.trim() && !attachedPhoto) || !activeChat) return;
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('Chat socket is not connected');
            return;
        }

        const tempId = Date.now();

        // NOTE: the Message model only has a `content` text field — there is
        // no backend support for image attachments yet, so attachedPhoto is
        // only shown locally and never actually transmitted.
        wsRef.current.send(JSON.stringify({
            recipient_id: activeChat,
            content: message,
            temp_id: tempId,
        }));

        const now = new Date();
        const newMessage: Message = {
            id: tempId, // temporary client-side id until next reload
            contactId: activeChat,
            text: message,
            attachment: attachedPhoto || undefined,
            sender: "me",
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: now.toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage("");
        setAttachedPhoto(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /* Delete only YOUR most recent sent message in the ACTIVE conversation,
       matching the backend rule exactly (delete_message only allows deleting
       the sender's latest message in that specific conversation). */
    const deleteLastMessage = async () => {
        if (!activeChat) return;

        const myMessagesInThisChat = chatHistory.filter(m => m.sender === 'me');
        if (myMessagesInThisChat.length === 0) return;

        const lastMine = myMessagesInThisChat[myMessagesInThisChat.length - 1];

        try {
            await apiFetch(`/chat/messages/delete/${lastMine.id}/`, { method: 'DELETE' });
            setMessages(prev => prev.filter(m => m.id !== lastMine.id));
        } catch (err) {
            console.error('Failed to delete message', err);
            // most likely a 403 if it's no longer actually the last message
            // (e.g. sent from another tab/device) — surface it rather than
            // failing silently
            alert(err instanceof Error ? err.message : 'Could not delete message');
        }
    };

    const activeContact = contacts.find(c => c.id === activeChat);

    /* WEBSOCKET: one persistent connection for the whole chat session,
       opened once per logged-in user (NOT reopened when switching chats). */
    useEffect(() => {
        if (!currentUserId) return;

        let cancelled = false;
        let socket: WebSocket | null = null;

        const timeoutId = setTimeout(() => {
            if (cancelled) return;

            const token = getToken();
            const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            socket = new WebSocket(
                `${protocol}://${window.location.host}/ws/chat/${currentUserId}/?token=${token}`
            );
            wsRef.current = socket;

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'message_deleted') {
                    setMessages(prev => prev.filter(m => m.id !== data.message_id));
                    return;
                }

                if (data.type === 'message_sent_ack') {
                    setMessages(prev => prev.map(m =>
                        m.id === data.temp_id ? { ...m, id: data.real_id } : m
                    ));
                    return;
                }

                const senderId = Number(data.sender_id);
                const now = new Date();
                const incoming: Message = {
                    id: data.message_id,
                    contactId: senderId,
                    text: data.content,
                    sender: 'them',
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    createdAt: now.toISOString(),
                };
                setMessages(prev => [...prev, incoming]);

                setContacts(prev => prev.map(c =>
                    c.id === senderId
                        ? {
                            ...c,
                            lastMessage: data.content,
                            lastMessageAt: now.toISOString(),
                            unreadCount: activeChatRef.current === senderId ? c.unreadCount : c.unreadCount + 1,
                        }
                        : c
                ));
            };

            socket.onclose = (event) => {
                if (event.code === 4001) {
                    console.error('Chat auth failed — token invalid or expired');
                }
            };
        }, 0);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            if (socket) {
                socket.close();
            }
        };
    }, [currentUserId]);

    /* TEXT AREA */
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    });

    return (
        <div className="chat-container">
            {/*Sidebar */}
            <aside className="chat-sidebar">
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

                <div className="contact-list">
                    {contactsLoading ? (
                        <p className="no-results">Loading connections...</p>
                    ) : contactsError ? (
                        <p className="no-results">{contactsError}</p>
                    ) : filteredContacts.length === 0 ? (
                        <p className="no-results">No connections yet. Follow someone to start chatting.</p>
                    ) : (
                        filteredContacts.map(contact => (
                            <div
                                key={contact.id}
                                className={`contact-item ${activeChat === contact.id ? 'active' : ''}`}
                                onClick={() => setActiveChat(contact.id)}
                            >
                                <div className="contact-avatar">
                                    {contact.avatar
                                        ? <img src={contact.avatar} alt={contact.name} />
                                        : initials(contact.name)}
                                </div>
                                <div className="contact-info">
                                    <div className="contact-top">
                                        <span className="contact-name">
                                            {contact.name}
                                            {contact.online && <span className="online-dot" title="Online"> ●</span>}
                                        </span>
                                        {contact.unreadCount > 0 && (
                                            <span className="unread-badge">{contact.unreadCount}</span>
                                        )}
                                    </div>
                                    <p className="contact-last-msg">
                                        <span className="contact-time">
                                            {contact.lastMessageAt
                                                ? new Date(contact.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : ""}
                                        </span>
                                        <span> </span>
                                        {contact.lastMessage || "No messages yet"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            <main className="chat-window">
                {activeChat ? (
                    <>
                        <header className="chat-header">
                            <div className="header-info">
                                <div className="header-avatar">
                                    {activeContact ? initials(activeContact.name) : ""}
                                </div>
                                <div>
                                    <h3>{activeContact?.name}</h3>
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
                            {messagesLoading ? (
                                <p className='no-results'>Loading messages...</p>
                            ) : chatHistory.length === 0 ? (
                                <p className='no-results'>No messages yet.</p>
                            ) : filteredMessages.length > 0 ? (
                                filteredMessages.map((msg) => (
                                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                        {msg.attachment && (
                                            <img src={msg.attachment} alt="Attachment" className="chat-msg-image" />
                                        )}
                                        {msg.text && <p>{msg.text}</p>}
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

                        <div className="chat-input-wrapper-block">
                            {attachedPhoto && (
                                <div className="attachment-preview-bar">
                                    <div className="preview-thumbnail-wrapper">
                                        <img src={attachedPhoto} alt="Upload preview" />
                                        <button className="remove-preview-btn" onClick={() => setAttachedPhoto(null)}>×</button>
                                    </div>
                                </div>
                            )}

                            <footer className="chat-input-container">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />

                                <button className="attachment-btn" onClick={handleAttachmentClick}>+</button>

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
                        </div>
                    </>
                ) : (
                    <p> </p>
                )}
            </main>
        </div>
    );
}