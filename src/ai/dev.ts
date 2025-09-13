import { config } from 'dotenv';
config();

import '@/ai/flows/patient-friendly-health-tips.ts';
import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/prescription-validation.ts';