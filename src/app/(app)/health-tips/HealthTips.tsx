'use client';

import { useEffect, useState } from 'react';
import { getPatientFriendlyHealthTips, PatientFriendlyHealthTipsOutput } from '@/ai/flows/patient-friendly-health-tips';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2, List, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function HealthTips() {
  const [result, setResult] = useState<PatientFriendlyHealthTipsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleGetTips = async () => {
    setIsPending(true);
    setError(null);
    setResult(null);
    try {
      const tipsResult = await getPatientFriendlyHealthTips();
      setResult(tipsResult);
    } catch (err) {
      setError('An error occurred while generating tips. Please try again.');
    } finally {
      setIsPending(false);
    }
  };
  
  // Fetch tips on initial component load
  useEffect(() => {
    handleGetTips();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button onClick={handleGetTips} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Get New Tips
        </Button>
      </div>

      {isPending && (
         <div className="flex items-center space-x-2 pt-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is generating your tips...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Daily Health Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {result.healthTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">
                        <List className="h-5 w-5" />
                    </div>
                  <p className="text-muted-foreground">{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
