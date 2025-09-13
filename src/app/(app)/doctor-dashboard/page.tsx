import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/data";
import { format } from "date-fns";
import { PrescriptionValidator } from "./PrescriptionValidator";

export default function DoctorDashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Doctor Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage appointments and validate prescriptions.
                </p>
            </div>
            
            <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="validation">Prescription Validation</TabsTrigger>
                </TabsList>
                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Appointments</CardTitle>
                            <CardDescription>
                                Here are the appointments scheduled for today and tomorrow.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.map(apt => (
                                        <TableRow key={apt.id}>
                                            <TableCell className="font-medium">{apt.patient}</TableCell>
                                            <TableCell>{format(new Date(apt.time), "MMM d, h:mm a")}</TableCell>
                                            <TableCell>
                                                <Badge variant={apt.status === 'Confirmed' ? 'default' : 'secondary'}>
                                                    {apt.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="validation">
                    <Card>
                         <CardHeader>
                            <CardTitle>AI Prescription Validator</CardTitle>
                            <CardDescription>
                                Validate prescriptions against patient data for potential risks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PrescriptionValidator />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
