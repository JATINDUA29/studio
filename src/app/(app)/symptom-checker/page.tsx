import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomChecker } from "./SymptomChecker";

export default function SymptomCheckerPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">AI Symptom Checker</h1>
                <p className="text-muted-foreground">
                    Describe your symptoms, and our AI will provide a preliminary analysis.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Symptom Analysis</CardTitle>
                    <CardDescription>
                        Please provide a detailed description of your symptoms below. This tool is for informational purposes only and does not replace professional medical advice.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SymptomChecker />
                </CardContent>
            </Card>
        </div>
    )
}
