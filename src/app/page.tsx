import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, HeartPulse, MessageCircle, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/icons/Logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Stethoscope className="h-10 w-10 text-primary" />,
    title: 'AI Symptom Checker',
    description: 'Get an instant analysis of your symptoms with our advanced AI.',
  },
  {
    icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
    title: 'Prescription Validation',
    description: 'Ensure your prescriptions are safe and effective.',
  },
  {
    icon: <HeartPulse className="h-10 w-10 text-primary" />,
    title: 'Patient Health Tips',
    description: 'Receive personalized, easy-to-understand health advice.',
  },
  {
    icon: <MessageCircle className="h-10 w-10 text-primary" />,
    title: 'Multilingual Chat',
    description: 'Communicate with healthcare professionals in your preferred language.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">Arogya AI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-foreground">
                Your Personal AI Health Companion
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                Arogya AI provides intelligent symptom analysis, personalized health tips, and seamless
                doctor consultations. Take control of your health today.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Button size="lg" asChild>
                  <Link href="/dashboard">Check Symptoms Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/appointments">Book an Appointment</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] md:min-h-[400px]">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  data-ai-hint={heroImage.imageHint}
                />
              )}
            </div>
          </div>
        </section>

        <section className="bg-white/50 dark:bg-black/20 py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                A Smarter Way to Manage Your Health
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From instant symptom checks to multilingual support, Arogya AI is packed with features to make healthcare more accessible and intuitive.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-secondary rounded-full">
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Arogya AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
