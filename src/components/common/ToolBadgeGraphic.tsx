import React from 'react';
import { ToolItem } from '../../types';

interface ToolBadgeGraphicProps {
  tool: ToolItem;
  className?: string;
}

export const ToolBadgeGraphic: React.FC<ToolBadgeGraphicProps> = ({ tool, className = 'w-full h-full' }) => {
  const id = tool.id.toLowerCase();
  const category = tool.category;
  const name = tool.name.toLowerCase();

  // 1. Specific PDF Tools (Exact match to iLovePDF style badges from screenshot)
  if (category === 'pdf' || id.includes('pdf')) {
    // Merge PDF: Red rounded box with two arrows pointing toward center
    if (id.includes('merge') || id.includes('combine')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E5322D" />
          {/* Top-left arrow pointing down-right */}
          <path d="M19 19L27 27M27 27H21M27 27V21" stroke="white" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bottom-right arrow pointing up-left */}
          <path d="M37 37L29 29M29 29H35M29 29V35" stroke="white" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          {/* Subtle sheet indicator */}
          <rect x="23" y="23" width="10" height="10" rx="2" fill="white" fillOpacity="0.25" />
        </svg>
      );
    }

    // Split PDF: Red rounded box with two arrows pointing outward
    if (id.includes('split') || id.includes('separate') || id.includes('extract-page')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E5322D" />
          {/* Top-left arrow pointing away */}
          <path d="M25 25L18 18M18 18H24M18 18V24" stroke="white" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          {/* Bottom-right arrow pointing away */}
          <path d="M31 31L38 38M38 38H32M38 38V32" stroke="white" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="23" y="23" width="10" height="10" rx="2" fill="white" fillOpacity="0.25" />
        </svg>
      );
    }

    // Compress PDF: Emerald green rounded box with 4 inward arrows
    if (id.includes('compress') || id.includes('shrink') || id.includes('reduce')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#16A34A" />
          {/* 4 inward arrows */}
          <path d="M19 19L24 24M24 24H19M24 24V19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M37 19L32 24M32 24H37M32 24V19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 37L24 32M24 32H19M24 32V37" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M37 37L32 32M32 32H37M32 32V37" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // PDF to Word / Word to PDF: Blue document with bold 'W'
    if (id.includes('word') || id.includes('doc')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background sheet */}
          <rect x="7" y="7" width="30" height="38" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
          {/* Top-left small arrow */}
          <path d="M13 14L18 19M18 19H14M18 19V15" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Main Word Badge */}
          <rect x="18" y="16" width="31" height="33" rx="8" fill="#2563EB" />
          <text x="33.5" y="39" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">W</text>
        </svg>
      );
    }

    // PDF to PowerPoint / PowerPoint to PDF: Orange document with bold 'P'
    if (id.includes('powerpoint') || id.includes('ppt') || id.includes('presentation')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background sheet */}
          <rect x="7" y="7" width="30" height="38" rx="6" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.5" />
          {/* Top-left small arrow */}
          <path d="M13 14L18 19M18 19H14M18 19V15" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Main PPT Badge */}
          <rect x="18" y="16" width="31" height="33" rx="8" fill="#EA580C" />
          <text x="33.5" y="39" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">P</text>
        </svg>
      );
    }

    // PDF to Excel / Excel to PDF: Emerald document with bold 'X'
    if (id.includes('excel') || id.includes('sheet') || id.includes('csv')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background sheet */}
          <rect x="7" y="7" width="30" height="38" rx="6" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
          {/* Top-left small arrow */}
          <path d="M13 14L18 19M18 19H14M18 19V15" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Main Excel Badge */}
          <rect x="18" y="16" width="31" height="33" rx="8" fill="#16A34A" />
          <text x="33.5" y="39" fill="white" fontSize="18" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">X</text>
        </svg>
      );
    }

    // Edit PDF: Purple badge with edit pencil / cursor
    if (id.includes('edit') || id.includes('annotate') || id.includes('draw')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#9333EA" />
          {/* Edit boundary rectangle with corner dots */}
          <rect x="15" y="15" width="26" height="26" rx="4" stroke="white" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="15" cy="15" r="2.5" fill="white" />
          <circle cx="41" cy="15" r="2.5" fill="white" />
          <circle cx="15" cy="41" r="2.5" fill="white" />
          <circle cx="41" cy="41" r="2.5" fill="white" />
          {/* Text cursor / pencil */}
          <path d="M28 20V36M24 20H32M24 36H32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }

    // Watermark / Stamp PDF
    if (id.includes('watermark') || id.includes('stamp')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E5322D" />
          <rect x="14" y="12" width="28" height="32" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <circle cx="28" cy="28" r="9" stroke="white" strokeWidth="2" />
          <path d="M23 28H33M28 23V33" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    // Rotate PDF
    if (id.includes('rotate')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E5322D" />
          <path d="M38 25C36.8 19.8 32.2 16 26.5 16C19.6 16 14 21.6 14 28.5C14 35.4 19.6 41 26.5 41C32.8 41 38 36.3 38.8 30.2" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <path d="M33 26H39V20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Lock / Protect / Unlock PDF
    if (id.includes('protect') || id.includes('lock') || id.includes('password') || id.includes('unlock')) {
      const isUnlock = id.includes('unlock');
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill={isUnlock ? '#059669' : '#DC2626'} />
          <rect x="17" y="25" width="22" height="18" rx="4" fill="white" />
          {isUnlock ? (
            <path d="M22 25V19C22 15.7 24.7 13 28 13C31.3 13 34 15.7 34 19" stroke="white" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M22 25V20C22 16.7 24.7 14 28 14C31.3 14 34 16.7 34 20V25" stroke="white" strokeWidth="3" strokeLinecap="round" />
          )}
          <circle cx="28" cy="34" r="2.5" fill={isUnlock ? '#059669' : '#DC2626'} />
        </svg>
      );
    }

    // Image to PDF / PDF to JPG
    if (id.includes('image') || id.includes('jpg') || id.includes('png')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E5322D" />
          <rect x="14" y="14" width="28" height="28" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <circle cx="21" cy="22" r="3" fill="white" />
          <path d="M15 36L23 28L31 35L36 30L41 35" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Generic PDF document badge
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#E5322D" />
        <path d="M19 14H31L39 22V42H19V14Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M31 14V22H39" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <text x="28.5" y="36" fill="white" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">PDF</text>
      </svg>
    );
  }

  // 2. Finance Calculators & Wealth Tools (Emerald & Gold)
  if (category === 'finance') {
    // Loan, Mortgage, EMI, Interest
    if (id.includes('loan') || id.includes('mortgage') || id.includes('emi') || id.includes('interest')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#059669" />
          {/* Home outline + dollar symbol */}
          <path d="M16 28L28 17L40 28V41H16V28Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <text x="28" y="36" fill="white" fontSize="15" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">$</text>
        </svg>
      );
    }

    // Investment, ROI, Compound Interest, SIP, Growth
    if (id.includes('investment') || id.includes('roi') || id.includes('compound') || id.includes('sip') || id.includes('profit')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0D9488" />
          <path d="M14 40L24 28L32 34L42 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 18H42V26" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="42" cy="18" r="3" fill="#34D399" />
        </svg>
      );
    }

    // Tax, GST, VAT, Receipt
    if (id.includes('tax') || id.includes('gst') || id.includes('vat') || id.includes('receipt') || id.includes('invoice')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#047857" />
          <path d="M18 14H38V42L33 39L28 42L23 39L18 42V14Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <text x="28" y="30" fill="white" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">%</text>
        </svg>
      );
    }

    // Currency Converter, Exchange, Cash
    if (id.includes('currency') || id.includes('exchange') || id.includes('cash') || id.includes('money')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#059669" />
          <circle cx="24" cy="28" r="11" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <text x="24" y="33" fill="white" fontSize="14" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">$</text>
          <circle cx="34" cy="24" r="9" fill="#10B981" stroke="white" strokeWidth="2" />
          <text x="34" y="29" fill="white" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">€</text>
        </svg>
      );
    }

    // Crypto, Bitcoin
    if (id.includes('crypto') || id.includes('bitcoin')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#D97706" />
          <circle cx="28" cy="28" r="14" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <text x="28" y="34" fill="white" fontSize="17" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">₿</text>
        </svg>
      );
    }

    // Salary, Paycheck, Wage
    if (id.includes('salary') || id.includes('wage') || id.includes('paycheck')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#059669" />
          <rect x="15" y="20" width="26" height="20" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <path d="M22 20V16C22 14.9 22.9 14 24 14H32C33.1 14 34 14.9 34 16V20" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="28" cy="30" r="3" fill="white" />
        </svg>
      );
    }

    // Generic Finance
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#059669" />
        <rect x="14" y="18" width="28" height="20" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
        <circle cx="28" cy="28" r="4" fill="white" />
        <circle cx="19" cy="28" r="1.5" fill="white" />
        <circle cx="37" cy="28" r="1.5" fill="white" />
      </svg>
    );
  }

  // 3. Math & Scientific Calculators (Indigo Blueprint & Precision)
  if (category === 'math') {
    // Scientific Calculator
    if (id.includes('scientific') || id.includes('advanced-calc')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4338CA" />
          <rect x="16" y="14" width="24" height="28" rx="4" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2" />
          <rect x="19" y="18" width="18" height="6" rx="2" fill="white" />
          <circle cx="21" cy="29" r="1.5" fill="white" />
          <circle cx="28" cy="29" r="1.5" fill="white" />
          <circle cx="35" cy="29" r="1.5" fill="white" />
          <circle cx="21" cy="36" r="1.5" fill="white" />
          <circle cx="28" cy="36" r="1.5" fill="white" />
          <circle cx="35" cy="36" r="1.5" fill="#818CF8" />
        </svg>
      );
    }

    // Matrix Calculator
    if (id.includes('matrix')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4338CA" />
          <path d="M20 18H16V38H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M36 18H40V38H36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="24" r="2" fill="white" />
          <circle cx="34" cy="24" r="2" fill="white" />
          <circle cx="22" cy="32" r="2" fill="white" />
          <circle cx="34" cy="32" r="2" fill="white" />
        </svg>
      );
    }

    // Fraction Calculator
    if (id.includes('fraction')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4F46E5" />
          <text x="28" y="24" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">½</text>
          <path d="M18 28H38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <text x="28" y="42" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">¾</text>
        </svg>
      );
    }

    // Percentage Calculator
    if (id.includes('percentage') || id.includes('percent')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4F46E5" />
          <circle cx="21" cy="21" r="3.5" stroke="white" strokeWidth="2.5" />
          <path d="M35 19L21 37" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <circle cx="35" cy="35" r="3.5" stroke="white" strokeWidth="2.5" />
        </svg>
      );
    }

    // Geometry / Triangle / Pythagorean
    if (id.includes('geometry') || id.includes('triangle') || id.includes('pythagorean') || id.includes('circle')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4338CA" />
          <path d="M18 38H38L18 18V38Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M18 32H24V38" stroke="white" strokeWidth="1.5" />
        </svg>
      );
    }

    // Statistics / Normal Distribution / Deviation
    if (id.includes('deviation') || id.includes('statistics') || id.includes('probability')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4338CA" />
          <path d="M14 38C20 38 22 20 28 20C34 20 36 38 42 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 20V38" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      );
    }

    // Generic Math
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#4F46E5" />
        <path d="M18 22H28M23 17V27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 22H38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 34H26M18 38H26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M31 32L37 38M37 32L31 38" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Health & Vitality Tools (Rose, Coral, Cyan)
  if (category === 'health') {
    // Calorie, BMR, TDEE
    if (id.includes('calorie') || id.includes('bmr') || id.includes('tdee') || id.includes('burn')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E11D48" />
          <path d="M28 14C28 14 36 21 36 29C36 34 32.5 38 28 38C23.5 38 20 34 20 29C20 23 25 18 28 14Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M28 26C28 26 31 29 31 32C31 34 29.5 35 28 35C26.5 35 25 34 25 32C25 30 27 28 28 26Z" fill="white" />
        </svg>
      );
    }

    // BMI, Weight, Body Fat, Scale
    if (id.includes('bmi') || id.includes('weight') || id.includes('fat') || id.includes('scale')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#E11D48" />
          <rect x="15" y="16" width="26" height="24" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <circle cx="28" cy="24" r="5" fill="white" />
          <path d="M28 24L31 21" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    }

    // Heart Rate, Pulse, Cardio
    if (id.includes('heart') || id.includes('pulse') || id.includes('cardio') || id.includes('blood')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#BE123C" />
          <path d="M28 39L17 28C14 25 14 20 18 17C22 14 26 17 28 20C30 17 34 14 38 17C42 20 42 25 39 28L28 39Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M18 28H23L26 23L30 33L33 28H38" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    // Water Intake, Hydration
    if (id.includes('water') || id.includes('drink') || id.includes('hydration')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0284C7" />
          <path d="M28 15C28 15 37 25 37 32C37 37 33 41 28 41C23 41 19 37 19 32C19 25 28 15 28 15Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 33C24 35 26 36 28 36" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    // Sleep Calculator
    if (id.includes('sleep') || id.includes('rem') || id.includes('wake')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#4338CA" />
          <path d="M34 18C28 19 23 24 23 31C23 38 29 43 36 41C31 43 25 41 21 36C17 31 18 24 23 19C26 16 30 16 34 18Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="38" cy="22" r="1.5" fill="#FCD34D" />
          <circle cx="34" cy="30" r="1" fill="#FCD34D" />
        </svg>
      );
    }

    // Generic Health
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#E11D48" />
        <circle cx="28" cy="28" r="13" stroke="white" strokeWidth="2" />
        <path d="M28 20V36M20 28H36" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. Media & Audio/Video Tools (Purple Studio)
  if (category === 'media') {
    // Audio Cutter, Trimmer, Waveform
    if (id.includes('audio') || id.includes('sound') || id.includes('tone') || id.includes('voice')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#7E22CE" />
          <path d="M16 28V28M21 21V35M26 16V40M31 24V32M36 18V38M41 28V28" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    }

    // Video, Film, Trimmer, Screen
    if (id.includes('video') || id.includes('screen') || id.includes('cam') || id.includes('film')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#6B21A8" />
          <rect x="14" y="17" width="28" height="22" rx="4" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" />
          <path d="M25 23L33 28L25 33V23Z" fill="white" />
        </svg>
      );
    }

    // Generic Media
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#7E22CE" />
        <circle cx="24" cy="35" r="4" fill="white" />
        <circle cx="36" cy="32" r="4" fill="white" />
        <path d="M28 35V20H40V32M28 25H40" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. Developer & Code Tools (Dark Slate & Neon Emerald / Cyan)
  if (category === 'developer') {
    // JSON Formatter / Validator
    if (id.includes('json')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0F172A" />
          <text x="28" y="36" fill="#10B981" fontSize="24" fontWeight="900" fontFamily="monospace" textAnchor="middle">{'{ }'}</text>
        </svg>
      );
    }

    // Regex Tester
    if (id.includes('regex')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0F172A" />
          <text x="28" y="36" fill="#06B6D4" fontSize="22" fontWeight="900" fontFamily="monospace" textAnchor="middle">.*</text>
        </svg>
      );
    }

    // SQL Formatter
    if (id.includes('sql') || id.includes('db')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0F172A" />
          <ellipse cx="28" cy="19" rx="12" ry="4" stroke="#10B981" strokeWidth="2" />
          <path d="M16 19V28C16 30.2 21.4 32 28 32C34.6 32 40 30.2 40 28V19" stroke="#10B981" strokeWidth="2" />
          <path d="M16 28V37C16 39.2 21.4 41 28 41C34.6 41 40 39.2 40 37V28" stroke="#10B981" strokeWidth="2" />
        </svg>
      );
    }

    // Hash / Base64 / JWT
    if (id.includes('hash') || id.includes('base64') || id.includes('jwt') || id.includes('uuid')) {
      return (
        <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="56" height="56" rx="14" fill="#0F172A" />
          <path d="M22 17L18 39M38 17L34 39M15 24H39M13 32H37" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }

    // Code Minifier / Formatter / HTML / CSS
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#0F172A" />
        <path d="M21 21L15 28L21 35M35 21L41 28L35 35M30 17L26 39" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 7. Utility & Daily Converter Tools (Royal Blue & Amber)
  // QR Code Generator
  if (id.includes('qr')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#1D4ED8" />
        {/* QR corners */}
        <rect x="15" y="15" width="10" height="10" rx="2" stroke="white" strokeWidth="2" />
        <rect x="18" y="18" width="4" height="4" fill="white" />
        <rect x="31" y="15" width="10" height="10" rx="2" stroke="white" strokeWidth="2" />
        <rect x="34" y="18" width="4" height="4" fill="white" />
        <rect x="15" y="31" width="10" height="10" rx="2" stroke="white" strokeWidth="2" />
        <rect x="18" y="34" width="4" height="4" fill="white" />
        {/* Pixel bits */}
        <rect x="31" y="31" width="3" height="3" fill="white" />
        <rect x="38" y="31" width="3" height="3" fill="white" />
        <rect x="35" y="35" width="3" height="3" fill="white" />
        <rect x="31" y="38" width="3" height="3" fill="white" />
        <rect x="38" y="38" width="3" height="3" fill="white" />
      </svg>
    );
  }

  // Barcode Generator
  if (id.includes('barcode')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#1E40AF" />
        <path d="M15 18V38M18 18V38M22 18V38M25 18V38M30 18V38M34 18V38M37 18V38M41 18V38" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Unit Converter (Length, Weight, Temp, Speed, Area)
  if (id.includes('converter') || id.includes('unit') || id.includes('temperature') || id.includes('length')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#2563EB" />
        <path d="M16 22H38M38 22L32 17M38 22L32 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 34H18M18 34L24 29M18 34L24 39" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Password / Security Generator
  if (id.includes('password') || id.includes('generator') && id.includes('pass')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#1D4ED8" />
        <path d="M28 14L38 18V26C38 33 33 39 28 41C23 39 18 33 18 26V18L28 14Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="28" cy="25" r="2.5" fill="white" />
        <path d="M28 28V33" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Time / Clock / Timer / Stopwatch
  if (id.includes('time') || id.includes('clock') || id.includes('timer') || id.includes('stopwatch')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#2563EB" />
        <circle cx="28" cy="28" r="14" stroke="white" strokeWidth="2.5" />
        <path d="M28 19V28L34 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Text Case / Word Counter / Typography
  if (id.includes('case') || id.includes('word') || id.includes('text') || id.includes('font')) {
    return (
      <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="56" height="56" rx="14" fill="#2563EB" />
        <text x="21" y="36" fill="white" fontSize="20" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">A</text>
        <text x="35" y="36" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">a</text>
      </svg>
    );
  }

  // Fallback Clean Utility Badge
  return (
    <svg viewBox="0 0 56 56" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="14" fill="#2563EB" />
      <path d="M19 23L28 15L37 23M19 33L28 41L37 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="28" cy="28" r="3" fill="white" />
    </svg>
  );
};
