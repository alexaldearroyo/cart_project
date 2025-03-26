import React from 'react';

export default function Header({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <h2 className="section-title">
      {icon} {title}
    </h2>
  );
}
