'use server';
/**
 * @fileOverview Provides patient-friendly health tips and summaries of medical information.
 *
 * - getPatientFriendlyHealthTips - A function that processes medical information and returns simplified summaries and health tips.
 * - PatientFriendlyHealthTipsInput - The input type for the getPatientFriendlyHealthTips function.
 * - PatientFriendlyHealthTipsOutput - The return type for the getPatientFriendlyHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientFriendlyHealthTipsInputSchema = z.object({
  medicalInformation: z.string().describe('Complex medical information that needs to be simplified.'),
});
export type PatientFriendlyHealthTipsInput = z.infer<typeof PatientFriendlyHealthTipsInputSchema>;

const PatientFriendlyHealthTipsOutputSchema = z.object({
  summary: z.string().describe('A simplified summary of the medical information.'),
  healthTips: z.string().describe('Patient-friendly health tips based on the medical information.'),
});
export type PatientFriendlyHealthTipsOutput = z.infer<typeof PatientFriendlyHealthTipsOutputSchema>;

export async function getPatientFriendlyHealthTips(input: PatientFriendlyHealthTipsInput): Promise<PatientFriendlyHealthTipsOutput> {
  return patientFriendlyHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'patientFriendlyHealthTipsPrompt',
  input: {schema: PatientFriendlyHealthTipsInputSchema},
  output: {schema: PatientFriendlyHealthTipsOutputSchema},
  prompt: `You are a helpful AI assistant that simplifies complex medical information and provides patient-friendly health tips.

  Summarize the following medical information in a way that is easy for patients to understand. Then, provide some actionable health tips based on the information.

  Medical Information: {{{medicalInformation}}}

  Summary:
  Health Tips: `,
});

const patientFriendlyHealthTipsFlow = ai.defineFlow(
  {
    name: 'patientFriendlyHealthTipsFlow',
    inputSchema: PatientFriendlyHealthTipsInputSchema,
    outputSchema: PatientFriendlyHealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
