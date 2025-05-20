import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from "../context/LanguageContext";

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* SVG de impressora 3D a meio da impressão */}
        <svg viewBox="0 0 256 256" width="220" height="220" fill="none">
          <rect x="40" y="180" width="176" height="24" rx="8" fill="#CBD5E1"/>
          <rect x="56" y="60" width="144" height="120" rx="12" fill="#E0E7EF" stroke="#64748B" strokeWidth="4"/>
          <rect x="96" y="120" width="64" height="32" rx="6" fill="#60A5FA"/>
          <rect x="120" y="152" width="16" height="16" rx="4" fill="#FBBF24"/>
          <rect x="128" y="40" width="8" height="40" rx="4" fill="#64748B"/>
          <rect x="120" y="32" width="24" height="16" rx="4" fill="#64748B"/>
          <rect x="120" y="16" width="24" height="8" rx="4" fill="#64748B"/>
        </svg>
        {/* Fio de impressão */}
        <div className="absolute left-1/2 top-24 w-1 h-16 bg-yellow-400 animate-bounce" style={{transform: 'translateX(-50%)'}} />
      </div>
      <h1 className="text-5xl font-bold text-primary mb-2">{t.notFound.title}</h1>
      <p className="text-xl text-gray-600 mb-4">{t.notFound.subtitle}</p>
      <p className="text-md text-gray-500 mb-8 italic">{t.notFound.joke}</p>
      <Button asChild>
        <Link to="/designs">{t.notFound.back}</Link>
      </Button>
    </div>
  );
};

export default NotFound;
