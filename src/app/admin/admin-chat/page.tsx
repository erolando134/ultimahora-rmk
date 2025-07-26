"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, MessageSquare, Send, User, Bot, ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface InternalMessage {
  id: string;
  senderId: string; // admin_id or supervisor_id
  senderName: string;
  text: string;
  timestamp: Date;
}

interface InternalChat {
  id: string;
  participantName: string; // Supervisor's name
  participantId: string;
  lastMessageSnippet: string;
  messages: InternalMessage[];
  avatarFallback: string;
}

const formatMessageTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function InternalChatPage() {
  const router = useRouter();
  const [chats, setChats] = useState<InternalChat[]>([
    {
      id: "internal_chat_1",
      participantName: "Elena Ramos (Supervisor)",
      participantId: "EMP001",
      lastMessageSnippet: "Revisado. Todo en orden por ahora.",
      avatarFallback: "ER",
      messages: [
        { id: "msg1", senderId: "admin", senderName: "Admin", text: "Elena, por favor revisa la actividad del chófer DRV002.", timestamp: new Date(Date.now() - 1000 * 60 * 10) },
        { id: "msg2", senderId: "EMP001", senderName: "Elena Ramos", text: "Recibido. Lo estoy viendo ahora.", timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { id: "msg3", senderId: "EMP001", senderName: "Elena Ramos", text: "Revisado. Todo en orden por ahora.", timestamp: new Date(Date.now() - 1000 * 60 * 2) },
      ]
    },
    {
      id: "internal_chat_2",
      participantName: "Marco Diaz (Supervisor)",
      participantId: "EMP002",
      lastMessageSnippet: "Ok, gracias.",
      avatarFallback: "MD",
      messages: [
         { id: "msg4", senderId: "admin", senderName: "Admin", text: "Marco, hay un pico de demanda en la Zona Sur, avisa a los chóferes cercanos si puedes.", timestamp: new Date(Date.now() - 1000 * 60 * 15) },
         { id: "msg5", senderId: "EMP002", senderName: "Marco Diaz", text: "Ok, gracias.", timestamp: new Date(Date.now() - 1000 * 60 * 14) },
      ]
    }
  ]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>("internal_chat_1");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);
  
  const handleSendMessage = () => {
    if (!selectedChatId || !newMessage.trim()) return;

    const messageToSend: InternalMessage = {
      id: `msg-${Date.now()}`,
      senderId: "admin", // Assuming admin is always the sender in this interface
      senderName: "Admin",
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChatId
          ? { ...chat, messages: [...chat.messages, messageToSend], lastMessageSnippet: newMessage.trim() }
          : chat
      )
    );
    setNewMessage("");
  };

  return (
    <div className="container mx-auto py-10 px-4 h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-grow flex flex-col shadow-xl overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center text-primary">
            <MessageSquare className="mr-3 h-7 w-7" />
            Chat Interno con Supervisores
          </CardTitle>
          <CardDescription className="text-md text-foreground/80">
            Coordina tareas y comunícate con tu equipo.
          </CardDescription>
        </CardHeader>

        <div className="flex-grow flex overflow-hidden">
          <div className="w-1/3 border-r bg-muted/50 overflow-y-auto">
            <ScrollArea className="h-full p-2">
              <div className="space-y-2">
                {chats.map(chat => (
                  <Button
                    key={chat.id}
                    variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto py-3"
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    <Avatar className="mr-3 h-10 w-10">
                      <AvatarFallback>{chat.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-grow">
                      <p className="font-semibold text-sm">{chat.participantName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{chat.lastMessageSnippet}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="w-2/3 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b bg-card flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{selectedChat.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{selectedChat.participantName}</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-grow min-h-0 p-4 space-y-4 bg-card">
                  {selectedChat.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === "admin" ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div className={`flex items-end max-w-[70%] space-x-2 ${msg.senderId === "admin" ? "flex-row-reverse" : ""}`}>
                         <Avatar className="h-8 w-8">
                           <AvatarFallback>
                            {msg.senderId === 'admin' ? <Bot size={18}/> : <User size={18}/>}
                           </AvatarFallback>
                        </Avatar>
                        <div
                          className={`p-3 rounded-lg shadow-md ${
                            msg.senderId === "admin"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm font-semibold mb-1">{msg.senderName}</p>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          {isClient && (
                            <p className={`text-xs mt-1 ${msg.senderId === "admin" ? "text-primary-foreground/70" : "text-muted-foreground/70"} ${msg.senderId === "admin" ? "text-right" : "text-left"}`}>
                              {formatMessageTimestamp(msg.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <CardFooter className="p-4 border-t bg-background">
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Escribe un mensaje al supervisor..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                      className="flex-grow"
                    />
                    <Button onClick={handleSendMessage} className="btn-primary text-explicit-white">
                      <Send className="h-5 w-5 mr-0 md:mr-2" /> <span className="hidden md:inline">Enviar</span>
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-muted-foreground">
                <p>Selecciona un chat para ver la conversación.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ir Atrás
        </Button>
        <Link href="/admin" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver al Panel
          </Button>
        </Link>
      </div>
    </div>
  );
}
