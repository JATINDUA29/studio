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
        d="M176,40H80A56,56,0,0,0,24,96v2.5C24,150,72.5,216,128,216s104-66,104-117.5V96A56,56,0,0,0,176,40Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <circle cx="128" cy="128" r="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
      <line x1="128" y1="108" x2="128" y2="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
      <line x1="128" y1="176" x2="128" y2="148" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
      <line x1="108" y1="128" x2="80" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
      <line x1="176" y1="128" x2="148" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
    </svg>
  );
}
