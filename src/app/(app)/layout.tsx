'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Bell, Siren } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          setError(null);
        },
        err => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleEmergency = () => {
    // In a real app, this would trigger a backend process
    // to alert doctors, send SMS, etc.
    toast({
      title: '🚨 Emergency Alert Sent!',
      description: `Your alert with location ${location || 'unavailable'} has been sent to on-call doctors.`,
      variant: 'destructive',
    });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold font-headline">Arogya AI</h2>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-4">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="animate-pulse">
                <Siren className="h-5 w-5" />
                <span className="hidden sm:inline">Emergency</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Emergency Alert</AlertDialogTitle>
                <AlertDialogDescription>
                  This will immediately notify on-call doctors with your location and vital information.
                  Are you sure you want to proceed?
                  {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleEmergency}>
                  Yes, Send Alert
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
