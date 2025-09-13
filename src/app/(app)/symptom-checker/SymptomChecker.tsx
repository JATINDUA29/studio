'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

type SymptomCheckerState = {
  data: AISymptomCheckerOutput | null;
  error: string | null;
};

async function checkSymptoms(
  prevState: SymptomCheckerState,
  formData: FormData
): Promise<SymptomCheckerState> {
  const symptoms = formData.get('symptoms') as string;
  try {
    const result = await aiSymptomChecker({ symptoms });
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: 'An error occurred while analyzing your symptoms. Please try again.' };
  }
}

const predefinedSymptoms = [
    'Headache',
    'Fever',
    'Cough',
    'Sore throat',
    'Runny nose',
    'Body ache',
    'Nausea',
    'Fatigue',
];

export function SymptomChecker() {
  const [state, formAction] = useFormState(checkSymptoms, { data: null, error: null });
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append('symptoms', data.symptoms);
    formAction(formData);
  };
  
  // This effect is needed because useFormState does not provide a pending state.
  // We can determine the pending state has ended when the state object is updated.
  useState(() => {
    if(state.data || state.error) {
      setIsPending(false);
    }
  });
  
  const handleSymptomClick = (symptom: string) => {
    const currentSymptoms = form.getValues('symptoms');
    const newSymptoms = currentSymptoms ? `${currentSymptoms}, ${symptom}` : symptom;
    form.setValue('symptoms', newSymptoms, { shouldValidate: true });
  };


  const getSeverityVariant = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Symptoms</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., I have a headache, fever, and a sore throat..." {...field} rows={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Or select common symptoms:</p>
            <div className="flex flex-wrap gap-2">
                {predefinedSymptoms.map(symptom => (
                    <Button key={symptom} type="button" variant="outline" size="sm" onClick={() => handleSymptomClick(symptom)}>
                        {symptom}
                    </Button>
                ))}
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Analyze Symptoms
          </Button>
        </form>
      </Form>

      {isPending && (
         <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing your symptoms...</p>
            </div>
        </div>
      )}

      {state.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.data && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-semibold font-headline">Analysis Results</h3>
           <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This is a preliminary analysis and not a medical diagnosis. Please consult a healthcare professional.
              </AlertDescription>
            </Alert>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.data.conditions.map(c => (
              <Card key={c.condition}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{c.condition}</CardTitle>
                    <Badge variant={getSeverityVariant(c.severity)} className="capitalize">{c.severity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <Progress value={c.confidence * 100} />
                    <p className="text-right font-mono text-sm">{(c.confidence * 100).toFixed(0)}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
