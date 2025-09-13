'use client';

import { useActionState, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Loader2, Image as ImageIcon, X, PlusCircle, Trash2, Pill } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in at least 10 characters.'),
  symptomImage: z.instanceof(File).optional(),
  patientAge: z.coerce.number().min(0, 'Age must be positive.').max(120),
  patientAllergies: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

async function checkSymptoms(
  prevState: { data: AISymptomCheckerOutput | null; error: string | null },
  formData: FormData
): Promise<{ data: AISymptomCheckerOutput | null; error: string | null }> {
  const symptoms = formData.get('symptoms') as string;
  const imageFile = formData.get('symptomImage') as File | null;
  const patientAge = formData.get('patientAge') as string;
  
  let symptomImage: string | undefined = undefined;

  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    symptomImage = `data:${imageFile.type};base64,${base64}`;
  }

  // We need to manually collect array data for server actions
  const patientAllergies: {value: string}[] = [];
  formData.forEach((value, key) => {
    if (key.startsWith('patientAllergies[')) {
      const match = key.match(/patientAllergies\[(\d+)]\.value/);
      if (match) {
        patientAllergies[parseInt(match[1])] = { value: value as string };
      }
    }
  });


  const validatedFields = formSchema.safeParse({ 
    symptoms, 
    symptomImage: imageFile ?? undefined,
    patientAge: Number(patientAge),
    patientAllergies: patientAllergies.filter(a => a.value)
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error);
    return {
      data: null,
      error: "Invalid data provided. Please check the form."
    };
  }
  
  try {
    const input = {
      symptoms: validatedFields.data.symptoms,
      symptomImage,
      patientAge: validatedFields.data.patientAge,
      patientAllergies: validatedFields.data.patientAllergies?.map(a => a.value).filter(Boolean) ?? [],
    }
    const result = await aiSymptomChecker(input);
    return { data: result, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'An error occurred while analyzing your symptoms. Please try again.' };
  }
}

const predefinedSymptoms = [
    'Headache', 'Fever', 'Cough', 'Sore throat', 'Runny nose',
    'Body ache', 'Nausea', 'Fatigue', 'Rash', 'Dizziness'
];

export function SymptomChecker() {
  const [state, formAction, isPending] = useActionState(checkSymptoms, { data: null, error: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      patientAge: 30,
      patientAllergies: [],
    },
  });

  const { fields: allergyFields, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control: form.control,
    name: "patientAllergies",
  });
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('symptomImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue('symptomImage', undefined);
    setImagePreview(null);
    const fileInput = document.getElementById('symptom-image-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleSymptomClick = (symptom: string) => {
    const currentSymptoms = form.getValues('symptoms');
    const newSymptoms = currentSymptoms ? `${currentSymptoms}, ${symptom}` : symptom;
    form.setValue('symptoms', newSymptoms, { shouldValidate: true });
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageFile = form.getValues('symptomImage');
    if (imageFile) {
      formData.append('symptomImage', imageFile);
    }
    formAction(formData);
  };

  const getSeverityVariant = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
           <FormField
              control={form.control}
              name="patientAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 35" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <div className="space-y-2">
              <FormLabel>Known Allergies (if any)</FormLabel>
              <div className="space-y-2">
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

           <div className="grid md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I have a headache, fever, and a sore throat..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Upload Image (Optional)</FormLabel>
                 <FormField
                    control={form.control}
                    name="symptomImage"
                    render={() => (
                      <FormControl>
                          <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center h-full flex flex-col justify-center items-center">
                          {imagePreview ? (
                              <div className="relative w-full h-40">
                                  <Image src={imagePreview} alt="Symptom preview" fill className="object-contain rounded-md" />
                                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={removeImage}>
                                      <X className="h-4 w-4"/>
                                  </Button>
                              </div>
                          ) : (
                              <div className="space-y-2">
                                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">Drag & drop or click to upload an image of your symptom.</p>
                                  <Input id="symptom-image-input" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*"/>
                              </div>
                          )}
                          </div>
                      </FormControl>
                    )}
                  />
                <FormMessage />
            </FormItem>
           </div>
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
            Get Advice
          </Button>
        </form>
      </Form>

      {isPending && (
         <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">Arogya AI is analyzing your symptoms...</p>
            </div>
        </div>
      )}

      {state.error && (
        <Alert variant="destructive" className="mt-4">
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
                {state.data.disclaimer}
              </AlertDescription>
            </Alert>
          <Card>
            <CardContent className="pt-6 space-y-6">
              {state.data.conditions.map((item, index) => (
                <div key={index} className="space-y-4 border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{item.condition}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">Confidence:</span>
                            <Progress value={item.confidence * 100} className="w-40" />
                            <span className="text-sm font-medium w-12 text-right">{Math.round(item.confidence * 100)}%</span>
                        </div>
                    </div>
                    <Badge variant={getSeverityVariant(item.severity)}>{item.severity}</Badge>
                  </div>
                   {item.medicationSuggestion && (
                     <div className="flex items-start gap-3 bg-secondary/50 p-3 rounded-md">
                        <Pill className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-sm">Medication Suggestion</p>
                            <p className="text-sm text-muted-foreground">{item.medicationSuggestion}</p>
                        </div>
                     </div>
                   )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
