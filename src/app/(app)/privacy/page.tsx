import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Privacy Policy</h1>
                <p className="text-muted-foreground">
                    Your privacy is important to us.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Arogya AI Privacy Policy</CardTitle>
                    <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                   <p>
                        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
                    </p>
                    
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-card-foreground">1. Information We Collect</h3>
                        <p>
                            We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Personal Data (e.g., email address, name, age)</li>
                            <li>Health Information (e.g., symptoms, allergies, medical history)</li>
                            <li>Usage Data (e.g., pages visited, time spent on pages)</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-card-foreground">2. How We Use Your Information</h3>
                        <p>
                            Arogya AI uses the collected data for various purposes:
                        </p>
                        <ul className="list-disc list-inside pl-4">
                            <li>To provide and maintain our Service</li>
                            <li>To provide AI-powered analysis and suggestions</li>
                            <li>To communicate with you</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-card-foreground">3. Data Security</h3>
                        <p>
                           The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-card-foreground">4. Changes to This Privacy Policy</h3>
                        <p>
                           We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </div>

                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg text-card-foreground">Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, you can contact us: <a href="mailto:support@arogya.ai" className="text-primary hover:underline">support@arogya.ai</a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
