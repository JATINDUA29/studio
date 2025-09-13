'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getPatientFriendlyHealthTips, PatientFriendlyHealthTipsOutput } from '@/ai/flows/patient-friendly-health-tips';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  medicalInformation: z.string().min(20, 'Please provide medical information of at least 20 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

type HealthTipsState = {
  data: PatientFriendlyHealthTipsOutput | null;
  error: string | null;
};

async function getTips(
  prevState: HealthTipsState,
  formData: FormData
): Promise<HealthTipsState> {
  const medicalInformation = formData.get('medicalInformation') as string;
  try {
    const result = await getPatientFriendlyHealthTips({ medicalInformation });
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: 'An error occurred while generating tips. Please try again.' };
  }
}

export function HealthTips() {
  const [state, formAction] = useFormState(getTips, { data: null, error: null });
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalInformation: '',
    },
  });
  
  const onSubmit = (data: FormValues) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append('medicalInformation', data.medicalInformation);
    formAction(formData);
  };
  
  useState(() => {
    if(state.data || state.error) {
      setIsPending(false);
    }
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="medicalInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Information</FormLabel>
                <FormControl>
                  <Textarea placeholder="Paste medical text here..." {...field} rows={8} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simplify and Advise
          </Button>
        </form>
      </Form>

      {isPending && (
         <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is generating your summary and tips...</p>
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
        <div className="grid gap-6 md:grid-cols-2 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Simplified Summary</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
                <p>{state.data.summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Health Tips</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
                <p>{state.data.healthTips}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
