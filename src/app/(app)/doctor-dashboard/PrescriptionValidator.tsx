'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { validatePrescription, PrescriptionValidationOutput } from '@/ai/flows/prescription-validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2, PlusCircle, Trash2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  medicationName: z.string().min(2, 'Medication name is required.'),
  patientAge: z.coerce.number().min(0, 'Age must be positive.').max(120),
  patientAllergies: z.array(z.object({ value: z.string() })).optional(),
  patientPregnancyStatus: z.boolean().default(false),
  patientOtherMedications: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function PrescriptionValidator() {
  const [result, setResult] = useState<PrescriptionValidationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationName: '',
      patientAge: 30,
      patientAllergies: [],
      patientPregnancyStatus: false,
      patientOtherMedications: [],
    },
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control: form.control,
    name: "patientAllergies",
  });

  const { fields: otherMedFields, append: appendOtherMed, remove: removeOtherMed } = useFieldArray({
    control: form.control,
    name: "patientOtherMedications",
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    setResult(null);
    setError(null);
    try {
      const input = {
        ...data,
        patientAllergies: data.patientAllergies?.map(a => a.value).filter(Boolean) ?? [],
        patientOtherMedications: data.patientOtherMedications?.map(m => m.value).filter(Boolean) ?? [],
      };
      const validationResult = await validatePrescription(input);
      setResult(validationResult);
    } catch (err) {
      setError('An error occurred during validation. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="medicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication to Validate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Amoxicillin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 35" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <FormLabel>Known Allergies</FormLabel>
              <div className="space-y-2 mt-2">
                {allergyFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`patientAllergies.${index}.value`}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Penicillin"/>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAllergy(index)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendAllergy({ value: "" })}><PlusCircle className="h-4 w-4 mr-2"/>Add Allergy</Button>
              </div>
            </div>
             <div>
              <FormLabel>Other Medications</FormLabel>
              <div className="space-y-2 mt-2">
                {otherMedFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`patientOtherMedications.${index}.value`}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g., Warfarin" />
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeOtherMed(index)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                ))}
                 <Button type="button" variant="outline" size="sm" onClick={() => appendOtherMed({ value: "" })}><PlusCircle className="h-4 w-4 mr-2"/>Add Medication</Button>
              </div>
            </div>
          </div>
          
           <FormField
            control={form.control}
            name="patientPregnancyStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Patient is Pregnant</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Validate Prescription
          </Button>
        </form>
      </Form>
      
      {isPending && (
         <div className="flex items-center space-x-2 pt-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is validating the prescription...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    {result.isValid ? <CheckCircle2 className="h-8 w-8 text-green-600"/> : <XCircle className="h-8 w-8 text-destructive"/>}
                    Validation Result: {result.isValid ? "Safe to Prescribe" : "Potential Risks Found"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </div>
                {!result.isValid && result.risks.length > 0 && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Identified Risks</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5">
                                {result.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
                {result.safeAlternatives.length > 0 && (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Safer Alternatives</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5">
                                {result.safeAlternatives.map((alt, i) => <li key={i}>{alt}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
