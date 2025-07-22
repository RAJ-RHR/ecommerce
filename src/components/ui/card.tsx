import * as React from 'react';

export function Card({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border p-4 shadow-sm bg-white ${className}`}>{children}</div>;
}

export function CardContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
