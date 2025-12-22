'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === 'dark';

  const bgFill = isDark ? '#222' : '#e6e6ea';
  const windowFill = isDark ? '#222' : '#e6e6ea';
  const titleBarFill = isDark ? '#222' : '#e6e6ea';
  const logoFill = isDark ? '#eee' : '#444';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      style={{ flex: 'none', lineHeight: 1 }}
      {...props}
    >
      <title>MCP UI Studio</title>
      <path
        d="M48 0 H208 C236 0 256 20 256 48 V208 C256 236 236 256 208 256 H48 C20 256 0 236 0 208 V48 C0 20 20 0 48 0 Z"
        fill={bgFill}
      />

      <rect x="20" y="20" width="216" height="216" rx="20" fill={windowFill} />

      <rect x="20" y="20" width="216" height="40" rx="20" fill={titleBarFill} />

      <circle cx="40" cy="40" r="6" fill="#ff5f57" />
      <circle cx="58" cy="40" r="6" fill="#febc2e" />
      <circle cx="76" cy="40" r="6" fill="#28c840" />

      <g transform="translate(40 52) scale(7)" fill={logoFill}>
        <path d="M15.688 2.343a2.588 2.588 0 00-3.61 0l-9.626 9.44a.863.863 0 01-1.203 0 .823.823 0 010-1.18l9.626-9.44a4.313 4.313 0 016.016 0 4.116 4.116 0 011.204 3.54 4.3 4.3 0 013.609 1.18l.05.05a4.115 4.115 0 010 5.9l-8.706 8.537a.274.274 0 000 .393l1.788 1.754a.823.823 0 010 1.18.863.863 0 01-1.203 0l-1.788-1.753a1.92 1.92 0 010-2.754l8.706-8.538a2.47 2.47 0 000-3.54l-.05-.049a2.588 2.588 0 00-3.607-.003l-7.172 7.034-.002.002-.098.097a.863.863 0 01-1.204 0 .823.823 0 010-1.18l7.273-7.133a2.47 2.47 0 00-.003-3.537z" />
        <path d="M14.485 4.703a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a4.115 4.115 0 000 5.9 4.314 4.314 0 006.016 0l7.12-6.982a.823.823 0 000-1.18.863.863 0 00-1.204 0l-7.119 6.982a2.588 2.588 0 01-3.61 0 2.47 2.47 0 010-3.54l7.12-6.982z" />
      </g>
    </svg>
  );
};
