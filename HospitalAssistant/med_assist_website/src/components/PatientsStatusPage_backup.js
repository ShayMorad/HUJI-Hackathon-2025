import React from "react";

{chatMessages.map(msg => (
                                    <div key={msg.id} className={`chat-message ${msg.sender}`}>
                                        <p style={{fontSize: '1.2em'}}>{msg.text}</p>
                                    </div>
                                ))}