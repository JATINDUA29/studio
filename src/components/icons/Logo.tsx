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
        d="M128,56v40a16,16,0,0,1-16-16,16.3,16.3,0,0,0-16-16,16,16,0,0,0,0,32,48,48,0,0,1,48,48v40"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <path
        d="M128,96a16,16,0,0,1,16-16,16.3,16.3,0,0,1,16-16,16,16,0,0,1,0,32,16,16,0,0,0-16,16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <path
        d="M216,128a88,88,0,1,1-88-88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="88"
        y1="128"
        x2="168"
        y2="128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <line
        x1="128"
        y1="88"
        x2="128"
        y2="168"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </svg>
  );
}
