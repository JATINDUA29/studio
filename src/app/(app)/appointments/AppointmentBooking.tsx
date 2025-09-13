'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Doctor = {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
    availability: { day: string; time: string; }[];
}

const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"];

export function AppointmentBooking({ doctor }: { doctor: Doctor }) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState<string | undefined>();
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const doctorImage = PlaceHolderImages.find(p => p.id === doctor.avatar);

    const handleBooking = () => {
        if (date && time) {
            toast({
                title: "✅ Appointment Booked!",
                description: `Your appointment with ${doctor.name} on ${format(date, 'MMMM d, yyyy')} at ${time} is confirmed.`,
            });
            setOpen(false); // Close dialog on successful booking
        } else {
             toast({
                title: "⚠️ Incomplete Information",
                description: "Please select a date and time for your appointment.",
                variant: "destructive"
            });
        }
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16">
                    {doctorImage && <AvatarImage src={doctorImage.imageUrl} alt={doctor.name} />}
                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="font-semibold text-sm mb-2">Availability</p>
                <div className="flex flex-wrap gap-2">
                    {doctor.availability.map(avail => (
                        <Badge key={avail.day} variant="secondary">{avail.day}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                 <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">Book Appointment</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Book with {doctor.name}</DialogTitle>
                        <DialogDescription>Select a date and time for your appointment.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border p-0"
                                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                            />
                            <div className="space-y-4">
                                <p className="font-medium text-sm">Select a Time</p>
                                <Select onValueChange={setTime} value={time}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeSlots.map(slot => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                           </div>
                        </div>
                         <Button onClick={handleBooking}>Confirm Booking</Button>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    )
}
