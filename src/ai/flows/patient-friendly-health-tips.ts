'use server';
/**
 * @fileOverview Provides patient-friendly health tips.
 *
 * - getPatientFriendlyHealthTips - A function that returns general health tips.
 * - PatientFriendlyHealthTipsOutput - The return type for the getPatientFriendlyHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientFriendlyHealthTipsOutputSchema = z.object({
  healthTips: z.array(z.string()).describe('A list of patient-friendly health tips.'),
});
export type PatientFriendlyHealthTipsOutput = z.infer<typeof PatientFriendlyHealthTipsOutputSchema>;

export async function getPatientFriendlyHealthTips(): Promise<PatientFriendlyHealthTipsOutput> {
  return patientFriendlyHealthTipsFlow();
}

const prompt = ai.definePrompt({
  name: 'patientFriendlyHealthTipsPrompt',
  output: {schema: PatientFriendlyHealthTipsOutputSchema},
  prompt: `You are a helpful AI assistant that provides general, patient-friendly health tips.

  Provide a list of 5 basic, actionable health tips for a healthy lifestyle. The tips should be easy to understand for everyone.
  `,
});

const patientFriendlyHealthTipsFlow = ai.defineFlow(
  {
    name: 'patientFriendlyHealthTipsFlow',
    outputSchema: PatientFriendlyHealthTipsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
