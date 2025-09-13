'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Play, Send } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";


type Message = {
    id: number;
    text: string;
    sender: 'user' | 'doctor';
    type: 'text' | 'voice';
    avatar: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you today?", sender: 'doctor', type: 'text', avatar: 'doctor-1' },
        { id: 2, text: "I've been having a persistent headache for the last two days.", sender: 'user', type: 'text', avatar: 'doctor-2' },
        { id: 3, text: "I see. Any other symptoms? Fever, nausea?", sender: 'doctor', type: 'text', avatar: 'doctor-1' },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;
        const newMsg: Message = {
            id: messages.length + 1,
            text: newMessage,
            sender: 'user',
            type: 'text',
            avatar: 'doctor-2'
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");

        // Simulate doctor's reply
        setTimeout(() => {
            const replyMsg: Message = {
                id: messages.length + 2,
                text: "Thank you for the information. Let me review what you've sent.",
                sender: 'doctor',
                type: 'text',
                avatar: 'doctor-1'
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 1500);
    };

    const userAvatar = PlaceHolderImages.find(p => p.id === 'doctor-2');
    const doctorAvatar = PlaceHolderImages.find(p => p.id === 'doctor-1');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Chat with Doctor</h1>
                <p className="text-muted-foreground">
                    Communicate in your preferred language.
                </p>
            </div>
            <Card className="h-[70vh] flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between border-b">
                    <div className="flex items-center gap-3">
                        <Avatar>
                           {doctorAvatar && <AvatarImage src={doctorAvatar.imageUrl} />}
                            <AvatarFallback>DA</AvatarFallback>
                        </Avatar>
                        <div>
                             <CardTitle>Dr. Anjali Sharma</CardTitle>
                             <CardDescription>Online</CardDescription>
                        </div>
                    </div>
                    <Select defaultValue="en">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                            <SelectItem value="mrw">Marwari (मारवाड़ी)</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                     {messages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                             {msg.sender === 'doctor' && (
                                <Avatar className="h-8 w-8">
                                    {doctorAvatar && <AvatarImage src={doctorAvatar.imageUrl} />}
                                    <AvatarFallback>DA</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs md:max-w-md rounded-2xl p-3",
                                msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'
                            )}>
                               {msg.type === 'text' ? (
                                    <p>{msg.text}</p>
                               ) : (
                                   <div className="flex items-center gap-2">
                                       <Button variant="ghost" size="icon" className="h-8 w-8"><Play className="h-4 w-4"/></Button>
                                       <div className="w-32 h-1 bg-muted-foreground/30 rounded-full" />
                                   </div>
                               )}
                            </div>
                            {msg.sender === 'user' && (
                                <Avatar className="h-8 w-8">
                                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                                    <AvatarFallback>ME</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="border-t p-4">
                    <div className="flex w-full items-center gap-2">
                         <Button variant="ghost" size="icon">
                            <Mic className="h-5 w-5" />
                        </Button>
                        <Input 
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
