import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M49.3,135.3,77.9,132a8,8,0,0,1,8,8.8l-3.3,26.2a8,8,0,0,0,8,8.8l23.4-2.9a8,8,0,0,1,8,8.8l-3.3,26.2a8,8,0,0,0,8,8.8l32-4a8,8,0,0,1,8,8.8l-3.3,26.2a8,8,0,0,0,8.8,8L225.3,248"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <path
        d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H184"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <polyline
        points="80 104 112 104 128 80 144 128 176 128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </svg>
  );
}
