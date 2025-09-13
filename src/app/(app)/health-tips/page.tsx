import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthTips } from "./HealthTips";

export default function HealthTipsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">General Health Tips</h1>
                <p className="text-muted-foreground">
                    Get simple, actionable tips for a healthier lifestyle.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Health Tip Generator</CardTitle>
                    <CardDescription>
                        Click the button below to get a fresh set of AI-powered health tips.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <HealthTips />
                </CardContent>
            </Card>
        </div>
    )
}
