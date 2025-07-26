"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, MessageSquare, Send, Paperclip, User, Bot, X, CheckCircle, ArrowLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from "@/lib/firebase/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, doc, updateDoc, runTransaction } from "firebase/firestore";

export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  sender: "client" | "driver" | "system";
  text?: string;
  imageUrl?: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  clientName: string;
  serviceType: string;
  initialRequestDetails: string;
  lastMessageSnippet: string;
  messages: Message[];
  avatarFallback: string;
  tripPrice: number;
  driverId: string | null; // Can be null initially
  isCompleted?: boolean;
  isUnread?: boolean;
}

const formatMessageTimestamp = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const q = query(collection(db, "chats"), orderBy("lastActivity", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData: Chat[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          clientName: data.clientName || "Cliente Desconocido",
          serviceType: data.serviceType || "Servicio General",
          initialRequestDetails: data.initialRequestDetails || "",
          lastMessageSnippet: data.lastMessageSnippet || "...",
          messages: data.messages ? data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date(),
          })) : [],
          avatarFallback: data.clientName ? data.clientName.substring(0, 2).toUpperCase() : "??",
          isCompleted: data.isCompleted || false,
          isUnread: data.isUnread || false,
          tripPrice: data.tripPrice || 0,
          driverId: data.driverId || null
        };
      });
      setChats(chatsData);

      const chatIdFromUrl = searchParams.get('chatId');
      if (chatIdFromUrl && chatsData.some(c => c.id === chatIdFromUrl)) {
        setSelectedChatId(chatIdFromUrl);
      } else if (!selectedChatId && chatsData.length > 0) {
        setSelectedChatId(chatsData[0].id);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching chats:", error);
        toast({ title: "Error", description: "No se pudieron cargar los chats.", variant: "destructive" });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isClient, searchParams, toast]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedChat?.messages]);

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    const chatRef = doc(db, "chats", chatId);
    try {
      await updateDoc(chatRef, {
        isUnread: false 
      });
    } catch (e) {
      console.error("Could not mark chat as read", e);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChatId || (!newMessage.trim() && !imagePreview)) return;
    if (selectedChat?.isCompleted) {
      toast({ title: "Viaje Completado", description: "Este viaje ya ha sido marcado como completado.", variant: "destructive" });
      return;
    }

    const messageToSend = {
      sender: "driver",
      text: newMessage.trim() || undefined,
      imageUrl: imagePreview || undefined,
      timestamp: Timestamp.now(),
    };
    
    const chatRef = doc(db, "chats", selectedChatId);
    const currentChat = chats.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    const existingMessages = currentChat.messages.map(m => ({...m, timestamp: Timestamp.fromDate(m.timestamp)}));

    await updateDoc(chatRef, {
      messages: [...existingMessages, messageToSend],
      lastMessageSnippet: newMessage.trim() || "Imagen enviada",
      lastActivity: Timestamp.now(),
    });

    setNewMessage("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedChat?.isCompleted) {
      toast({ title: "Viaje Completado", description: "No se pueden adjuntar imágenes a un viaje completado.", variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteTrip = async () => {
    if (!selectedChat) return;
    if (selectedChat.isCompleted) {
      toast({ title: "Acción no permitida", description: "Este viaje ya fue completado.", variant: "destructive" });
      return;
    }
    
    const chatRef = doc(db, "chats", selectedChat.id);
    const commission = selectedChat.tripPrice * 0.10;

    const completionMessage = {
        id: `sys-${Date.now()}`,
        sender: "system",
        text: `Viaje TERMINADO. Comisión de ${commission.toFixed(2)} Bs. (10%) registrada.`,
        timestamp: Timestamp.now(),
    };
    const existingMessages = selectedChat.messages.map(m => ({...m, timestamp: Timestamp.fromDate(m.timestamp)}));
    
    await updateDoc(chatRef, {
        messages: [...existingMessages, completionMessage],
        lastMessageSnippet: "Viaje Terminado.",
        isCompleted: true,
        isUnread: false,
        lastActivity: Timestamp.now(),
    });

    toast({
        title: "¡Viaje Terminado!",
        description: `Comisión de ${commission.toFixed(2)} Bs. aplicada.`,
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-grow flex flex-col shadow-xl overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold flex items-center text-primary">
            <MessageSquare className="mr-3 h-7 w-7" />
            Panel de Solicitudes y Chat
          </CardTitle>
          <CardDescription className="text-md text-foreground/80 text-center sm:text-left">
            Gestiona tus solicitudes de servicio y comunícate con los clientes.
          </CardDescription>
        </CardHeader>

        <div className="flex-grow flex overflow-hidden">
          <div className="w-1/3 border-r bg-muted/50 overflow-y-auto">
            <ScrollArea className="h-full p-2">
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-center p-4 text-muted-foreground">Cargando chats...</p>
                ) : chats.length === 0 ? (
                    <p className="text-center p-4 text-muted-foreground">No hay chats activos.</p>
                ) : (
                  chats.map(chat => (
                    <Button
                      key={chat.id}
                      variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                      className={`w-full justify-start h-auto py-3 relative ${chat.isCompleted ? "opacity-60" : ""} ${chat.isUnread && selectedChatId !== chat.id ? 'font-semibold bg-primary/10 hover:bg-primary/20' : ''}`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      {chat.isUnread && selectedChatId !== chat.id && (
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-accent animate-pulse"></span>
                      )}
                      <Avatar className="mr-3 h-10 w-10 ml-3">
                        <AvatarFallback>{chat.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="text-left flex-grow">
                        <p className={`font-semibold text-sm ${chat.isUnread && selectedChatId !== chat.id ? 'text-primary' : ''}`}>{chat.clientName}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{chat.serviceType}</p>
                        <p className={`text-xs text-muted-foreground truncate max-w-[150px] ${chat.isCompleted ? "italic" : ""}`}>
                          {chat.isCompleted ? "Viaje Terminado" : chat.lastMessageSnippet}
                        </p>
                      </div>
                       {chat.isCompleted && <CheckCircle className="ml-auto h-4 w-4 text-green-500" />}
                    </Button>
                  ))
                )}
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
                      <p className="font-semibold text-lg">{selectedChat.clientName}</p>
                      <p className="text-sm text-muted-foreground">{selectedChat.serviceType}</p>
                    </div>
                  </div>
                  {!selectedChat.isCompleted && (
                    <Button onClick={handleCompleteTrip} variant="outline" size="sm" className="btn-primary text-explicit-white">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Viaje Terminado
                    </Button>
                  )}
                  {selectedChat.isCompleted && (
                     <div className="flex items-center text-sm text-green-600 bg-green-100 px-3 py-1 rounded-md">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Viaje Completado</span>
                    </div>
                  )}
                </div>

                <ScrollArea className="flex-grow min-h-0 p-4 space-y-4 bg-card">
                  {selectedChat.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "driver" ? "justify-end" : "justify-start"} mb-3`}
                    >
                      <div className={`flex items-end max-w-[70%] space-x-2 ${msg.sender === "driver" ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8">
                           <AvatarFallback>
                            {msg.sender === 'client' ? selectedChat.avatarFallback : msg.sender === 'driver' ? <User size={18}/> : <Bot size={18}/>}
                           </AvatarFallback>
                        </Avatar>
                        <div
                          className={`p-3 rounded-lg shadow-md ${
                            msg.sender === "driver"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : msg.sender === "client"
                              ? "bg-muted text-foreground rounded-bl-none"
                              : "bg-accent/50 text-accent-foreground w-full text-center italic text-xs py-2 my-1"
                          }`}
                        >
                          {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                          {msg.imageUrl && (
                            <img src={msg.imageUrl} alt="Adjunto" className="rounded-md max-w-xs max-h-48 mt-1" data-ai-hint="user uploaded image" />
                          )}
                           {msg.sender !== 'system' && isClient && ( 
                            <p className={`text-xs mt-1 ${msg.sender === "driver" ? "text-primary-foreground/70" : "text-muted-foreground/70"} ${msg.sender === "driver" ? "text-right" : "text-left"}`}>
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
                  {imagePreview && (
                    <div className="mb-2 p-2 border rounded-md relative bg-muted/50">
                      <img src={imagePreview} alt="Previsualización" className="max-h-24 rounded-md" data-ai-hint="image preview" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 bg-background/50 hover:bg-background/80"
                        onClick={() => {
                          setImagePreview(null);
                          if(fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex w-full items-center space-x-2">
                    <Input
                      type="text"
                      placeholder={selectedChat.isCompleted ? "Este viaje ha terminado." : "Escribe un mensaje..."}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !selectedChat.isCompleted) handleSendMessage();
                      }}
                      className="flex-grow"
                      disabled={selectedChat.isCompleted}
                    />
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={selectedChat.isCompleted}>
                      <Paperclip className="h-5 w-5" />
                      <span className="sr-only">Adjuntar imagen</span>
                    </Button>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={selectedChat.isCompleted}
                    />
                    <Button onClick={handleSendMessage} className="btn-primary text-explicit-white" disabled={selectedChat.isCompleted}>
                      <Send className="h-5 w-5 mr-0 md:mr-2" /> <span className="hidden md:inline">Enviar</span>
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center text-muted-foreground">
                 {isLoading ? (
                    <p>Cargando chat...</p>
                 ) : (
                    <p>Selecciona un chat para ver los mensajes o solicitudes.</p>
                 )}
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
        <Link href="/" passHref>
          <Button variant="outline">
            <Home className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
