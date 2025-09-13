import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { doctors } from "@/lib/data";
import { AppointmentBooking } from "./AppointmentBooking";

export default function AppointmentsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Book an Appointment</h1>
                <p className="text-muted-foreground">
                    Find a doctor and schedule your appointment online.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Our Doctors</CardTitle>
                    <CardDescription>Select a doctor to view their availability and book an appointment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map(doctor => (
                            <AppointmentBooking key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
