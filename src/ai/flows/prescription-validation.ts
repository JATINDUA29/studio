// prescription-validation.ts
'use server';

/**
 * @fileOverview Validates a proposed prescription against patient data to identify potential risks.
 *
 * - validatePrescription - Validates a prescription based on patient information.
 * - PrescriptionValidationInput - The input type for the validatePrescription function.
 * - PrescriptionValidationOutput - The return type for the validatePrescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionValidationInputSchema = z.object({
  medicationName: z.string().describe('The name of the prescribed medication.'),
  patientAge: z.number().describe('The age of the patient in years.'),
  patientAllergies: z.array(z.string()).describe('A list of the patient’s known allergies.'),
  patientPregnancyStatus: z.boolean().describe('Whether the patient is currently pregnant.'),
  patientOtherMedications: z.array(z.string()).describe('A list of other medications the patient is currently taking.'),
});
export type PrescriptionValidationInput = z.infer<typeof PrescriptionValidationInputSchema>;

const PrescriptionValidationOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the prescription is considered safe based on the provided information.'),
  risks: z.array(z.string()).describe('A list of potential risks associated with the prescription, such as allergies or drug interactions.'),
  safeAlternatives: z.array(z.string()).describe('A list of safer alternative medications, if any.'),
  explanation: z.string().describe('A detailed explanation of the validation results.'),
});
export type PrescriptionValidationOutput = z.infer<typeof PrescriptionValidationOutputSchema>;

export async function validatePrescription(input: PrescriptionValidationInput): Promise<PrescriptionValidationOutput> {
  return validatePrescriptionFlow(input);
}

const prescriptionValidationPrompt = ai.definePrompt({
  name: 'prescriptionValidationPrompt',
  input: {schema: PrescriptionValidationInputSchema},
  output: {schema: PrescriptionValidationOutputSchema},
  prompt: `You are a clinical pharmacist tasked with validating prescriptions for patient safety.

  Based on the following patient information and proposed medication, identify any potential risks such as allergies, drug interactions, or contraindications due to age or pregnancy status.
  If risks are identified, suggest safer alternatives.

  Patient Age: {{{patientAge}}}
  Patient Allergies: {{#each patientAllergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Patient Pregnancy Status: {{#if patientPregnancyStatus}}Pregnant{{else}}Not Pregnant{{/if}}
  Other Medications: {{#each patientOtherMedications}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Proposed Medication: {{{medicationName}}}

  Provide a detailed explanation of your validation results.

  Ensure that the output is valid and includes the list of risks, safe alternatives and an overall explanation.
  `,
});

const validatePrescriptionFlow = ai.defineFlow(
  {
    name: 'validatePrescriptionFlow',
    inputSchema: PrescriptionValidationInputSchema,
    outputSchema: PrescriptionValidationOutputSchema,
  },
  async input => {
    const {output} = await prescriptionValidationPrompt(input);
    return output!;
  }
);
