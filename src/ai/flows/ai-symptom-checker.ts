'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI-powered symptom checker that also suggests medication.
 *
 * The flow takes a user's symptoms, age, and allergies as input, and returns a prioritized list of possible
 * conditions with severity levels, confidence scores, and medication suggestions.
 *
 * @fileOverview
 * - `aiSymptomChecker`: The main function to initiate the symptom check.
 * - `AISymptomCheckerInput`: Interface for the input data (symptoms, age, allergies).
 * - `AISymptomCheckerOutput`: Interface for the output data (possible conditions and medications).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the symptoms experienced by the user.'),
  symptomImage: z
    .string()
    .optional()
    .describe(
      "A photo of the symptom, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  patientAge: z.number().describe('The age of the patient in years.'),
  patientAllergies: z.array(z.string()).describe('A list of the patient’s known allergies.'),
});

export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  conditions: z.array(
    z.object({
      condition: z.string().describe('The name of the possible condition.'),
      severity: z
        .enum(['low', 'medium', 'high'])
        .describe('The severity level of the condition.'),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe('The confidence score of the diagnosis (0 to 1).'),
      medicationSuggestion: z.string().optional().describe('A suggested medication for the condition, considering the patient\'s age and allergies.'),
    })
  ).describe('A prioritized list of possible conditions.'),
  disclaimer: z.string().describe('A disclaimer that this is not a real medical diagnosis but is supervised by real doctors.'),
});

export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const aiSymptomCheckerPrompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI-powered medical assistant chatbot named Arogya AI. Your role is to provide a preliminary analysis of symptoms and suggest potential medications.

  **IMPORTANT**: Your advice is not a substitute for professional medical advice. Always start your response with a clear disclaimer stating that this is an AI-powered analysis supervised by real doctors, and users should consult a healthcare professional for a definitive diagnosis.

  Analyze the following symptoms for a patient of age {{{patientAge}}} with known allergies to: {{#each patientAllergies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

  Symptoms:
  {{symptoms}}

  {{#if symptomImage}}
  Also analyze the following image of the symptom:
  {{media url=symptomImage}}
  {{/if}}

  Based on the symptoms, provide a list of possible conditions with severity levels (low, medium, high) and confidence scores (0 to 1). 
  For each condition, suggest a suitable over-the-counter medication commonly available in the Indian context.
  When suggesting medication, you MUST consider the patient's age and allergies to avoid harmful recommendations. For example, do not suggest Aspirin to children. If there are no safe medications to suggest, state that.

  Prioritize the list based on the likelihood and severity of the conditions.

  Format the output as a JSON object.
  `,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await aiSymptomCheckerPrompt(input);
    const result = output!;
    // Ensure there is always a disclaimer.
    if (!result.disclaimer) {
      result.disclaimer = "This is a preliminary analysis provided by an AI supervised by medical professionals. It is not a substitute for a formal diagnosis. Please consult a healthcare professional for any health concerns.";
    }
    return result;
  }
);
