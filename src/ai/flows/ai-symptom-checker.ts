'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI-powered symptom checker.
 *
 * The flow takes a user's symptoms as input and returns a prioritized list of possible
 * conditions with severity levels and confidence scores.
 *
 * @fileOverview
 * - `aiSymptomChecker`: The main function to initiate the symptom check.
 * - `AISymptomCheckerInput`: Interface for the input data (symptoms).
 * - `AISymptomCheckerOutput`: Interface for the output data (possible conditions).
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
    })
  ).describe('A prioritized list of possible conditions.'),
});

export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const aiSymptomCheckerPrompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker that provides a prioritized list of possible conditions based on the user's symptoms.

  Analyze the following symptoms:
  {{symptoms}}

  {{#if symptomImage}}
  Also analyze the following image of the symptom:
  {{media url=symptomImage}}
  {{/if}}

  Provide a list of possible conditions with severity levels (low, medium, high) and confidence scores (0 to 1). Prioritize the list based on the likelihood and severity of the conditions.

  Format the output as a JSON array of objects, where each object represents a possible condition and includes the condition name, severity, and confidence score.
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
    return output!;
  }
);
