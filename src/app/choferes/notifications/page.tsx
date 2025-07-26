"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ArrowLeft, Home, Loader2, List, MailOpen } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    message: string;
    modality: string;
    chatId: string;
    createdAt: any;
    isRead: boolean;
}

export default function NotificacionesPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifsData: Notification[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() // Convert Firestore Timestamp to JS Date
            } as Notification));
            setNotifications(notifsData);
            setLoading(false);
        }, (error) => {
            console.error("Error al obtener notificaciones:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
        if (!notification.isRead) {
            const notifRef = doc(db, "notifications", notification.id);
            await updateDoc(notifRef, { isRead: true });
        }
        // Navigate to chat using a query parameter, which is compatible with static export
        router.push(`/choferes/chat?chatId=${notification.chatId}`);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-3xl mx-auto shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center flex items-center justify-center text-primary">
                        <Bell className="mr-3 h-8 w-8" />
                        Notificaciones de Servicios
                    </CardTitle>
                    <CardDescription className="text-center text-lg text-foreground/80">
                        Aquí aparecen las nuevas solicitudes de clientes. ¡Sé el primero en responder!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                         <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-10">
                            <List className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">No hay notificaciones de servicio por el momento.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(notif => (
                                <div 
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-4 rounded-lg border flex items-start gap-4 cursor-pointer transition-all ${
                                        notif.isRead 
                                        ? 'bg-muted/30 hover:bg-muted/60 opacity-70' 
                                        : 'bg-card hover:bg-muted/80 font-semibold'
                                    }`}
                                >
                                    <div className={`mt-1 h-3 w-3 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-accent animate-pulse'}`}></div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <p className={`text-sm ${notif.isRead ? 'text-muted-foreground' : 'text-primary'}`}>{notif.title}</p>
                                             {notif.createdAt && (
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(notif.createdAt, { addSuffix: true, locale: es })}
                                                </p>
                                            )}
                                        </div>
                                        <p className={`text-sm mt-1 ${notif.isRead ? 'text-foreground/70' : 'text-foreground'}`}>{notif.message}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <MailOpen className="h-5 w-5"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 border-t pt-8 pb-4">
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
