import * as React from 'react';

export function Table({ children, className }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={`min-w-full border ${className}`}>{children}</table>;
}

export function TableHeader({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableBody({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b hover:bg-gray-50">{children}</tr>;
}

export function TableHead({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-2 text-left text-sm font-semibold">{children}</th>;
}

export function TableCell({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-2 text-sm">{children}</td>;
}
