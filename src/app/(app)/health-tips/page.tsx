import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthTips } from "./HealthTips";

export default function HealthTipsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Patient-Friendly Health Tips</h1>
                <p className="text-muted-foreground">
                    Simplify complex medical information into easy-to-understand summaries and actionable tips.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Medical Information Simplifier</CardTitle>
                    <CardDescription>
                        Paste any complex medical text below (e.g., from a lab report or medical journal) to get a simplified explanation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HealthTips />
                </CardContent>
            </Card>
        </div>
    )
}
