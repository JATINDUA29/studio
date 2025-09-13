'use client';

import { useActionState, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aiSymptomChecker, AISymptomCheckerOutput } from '@/ai/flows/ai-symptom-checker';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please describe your symptoms in at least 10 characters.'),
  symptomImage: z.string().optional(),
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
  const symptomImage = formData.get('symptomImage') as string | undefined;
  
  try {
    const result = await aiSymptomChecker({ symptoms, symptomImage });
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
    'Rash',
];

export function SymptomChecker() {
  const [state, formAction, isPending] = useActionState(checkSymptoms, { data: null, error: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      symptomImage: '',
    },
  });
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('symptomImage', dataUri);
        setImagePreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue('symptomImage', '');
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('symptomImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('symptoms', data.symptoms);
    if (data.symptomImage) {
      formData.append('symptomImage', data.symptomImage);
    }
    formAction(formData);
  };
  
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
           <div className="grid md:grid-cols-2 gap-6">
             <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Symptoms</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., I have a headache, fever, and a sore throat..." {...field} rows={8} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Upload Image (Optional)</FormLabel>
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
                             <Input id="symptomImage" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*"/>
                        </div>
                    )}
                    </div>
                </FormControl>
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
            Analyze Symptoms
          </Button>
        </form>
      </Form>

      {isPending && (
         <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing your symptoms...</p>
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
                This is a preliminary analysis and not a medical diagnosis. Please consult a healthcare professional.
              </Aler_tDescription>
            </Alert>

          {state.data.conditions.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{item.condition}</p>
                        <Badge variant={getSeverityVariant(item.severity)} className="capitalize mt-1">
                            {item.severity} Severity
                        </Badge>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg">{(item.confidence * 100).toFixed(0)}%</p>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                    </div>
                </div>
                 <div className="mt-4">
                    <Progress value={item.confidence * 100} />
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
