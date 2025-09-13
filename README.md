# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# Arogya AI - Your Personal AI Health Companion

Arogya AI is a modern, AI-powered healthcare application designed to provide users with instant medical guidance, personalized health tips, and seamless access to healthcare professionals. Built with a focus on accessibility and user experience, it aims to make healthcare more intuitive and approachable for everyone.

## ✨ Key Features

- **🤖 AI Symptom Checker**: Users can describe their symptoms (and optionally upload an image) to receive a preliminary analysis of potential conditions, severity levels, and medication suggestions, all powered by generative AI.
- **✅ AI Prescription Validator**: A tool for doctors to validate prescriptions against patient data (age, allergies, pregnancy status, other medications) to identify potential risks and receive suggestions for safer alternatives.
- **💡 Personalized Health Tips**: An AI-powered feature that generates actionable, easy-to-understand health and lifestyle tips for users.
- **🗓️ Appointment Booking**: A user-friendly interface for finding doctors and booking appointments based on their availability.
- **💬 Multilingual Chat**: A real-time chat interface that allows patients to communicate with doctors in their preferred language (feature in development).
- **🧑‍⚕️ Doctor Dashboard**: A dedicated dashboard for healthcare professionals to manage appointments and utilize the AI Prescription Validator.
- **🚨 Emergency Alert**: A one-click emergency button that can notify on-call doctors with the user's location.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit (by Firebase)](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## 🚀 Getting Started

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20 or later)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    This project uses `npm` as its package manager.
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase project configuration.
    ```env
    # Firebase project configuration keys
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    # ... and so on for all the keys.
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002).

## ☁️ Deployment

This application is configured for deployment with **Firebase App Hosting**.

To deploy your application, ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and are logged in (`firebase login`).

Then, run the following command from the project root:

```bash
firebase deploy
```

The CLI will handle the build process and deploy your Next.js application to Firebase.
