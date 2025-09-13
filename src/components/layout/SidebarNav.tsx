'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Calendar,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Bot,
  User,
  Shield,
  Home,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/symptom-checker', label: 'AI Chatbot', icon: Bot },
  { href: '/health-tips', label: 'Health Tips', icon: HeartPulse },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
];

const doctorMenuItems = [
  { href: '/doctor-dashboard', label: 'Doctor Dashboard', icon: User },
]

export function SidebarNav() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'doctor-2');


  return (
    <div className="flex flex-col h-full">
      <SidebarGroup className="flex-1">
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarSeparator className="my-4" />
          
           <p className="px-4 mb-2 text-xs text-muted-foreground font-medium">For Doctors</p>
           <SidebarMenu>
            {doctorMenuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
           <SidebarSeparator className="my-4" />
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/privacy'}
                  tooltip="Privacy Policy"
                >
                  <Link href="/privacy">
                    <Shield />
                    <span>Privacy Policy</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>


        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarSeparator />
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Avatar className="w-8 h-8">
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="font-semibold">User</span>
                  <span className="text-xs text-muted-foreground">user@example.com</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Log Out">
                    <Link href="/login">
                      <LogOut/>
                      <span>Log Out</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
