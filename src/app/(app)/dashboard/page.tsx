import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments } from "@/lib/data";
import { ArrowRight, Calendar, HeartPulse, Stethoscope } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";

export default function DashboardPage() {
    const upcomingAppointments = appointments.slice(0, 2);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Welcome back!</h1>
                <p className="text-muted-foreground">Here's a quick overview of your health dashboard.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="transform hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="text-primary"/>
                            <span>AI Symptom Checker</span>
                        </CardTitle>
                        <CardDescription>Get an instant analysis of your symptoms.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/symptom-checker">Start Check <ArrowRight/></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="transform hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <HeartPulse className="text-primary"/>
                            <span>Health Tips</span>
                        </CardTitle>
                        <CardDescription>Get personalized health advice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/health-tips">View Tips <ArrowRight/></Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="transform hover:-translate-y-1 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="text-primary"/>
                            <span>Book Appointment</span>
                        </CardTitle>
                        <CardDescription>Schedule a visit with a doctor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/appointments">Book Now <ArrowRight/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>You have {upcomingAppointments.length} upcoming appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {upcomingAppointments.map(apt => (
                             <div key={apt.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                <div>
                                    <p className="font-semibold">{apt.doctor}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(apt.time), "EEEE, MMMM d 'at' h:mm a")}</p>
                                </div>
                                 <Button variant="outline" size="sm">View Details</Button>
                            </div>
                        ))}
                    </div>
                    {appointments.length > 2 && (
                        <Button variant="link" className="mt-4" asChild>
                            <Link href="/appointments">View All Appointments</Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
