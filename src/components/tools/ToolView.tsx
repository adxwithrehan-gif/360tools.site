import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { 
  ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Lock, Sparkles, 
  Share2, ExternalLink, Zap, Play, Copy, Check, HelpCircle
} from 'lucide-react';
import { useToolSEO } from '../../utils/seo';
import { getToolTheme } from '../../utils/toolTheme';
import { ToolCard } from '../common/ToolCard';
import { AdSlot } from '../ads/AdSlot';
import { ADS_CONFIG } from '../../config/adsConfig';

// PDF Tools
import { MergePdfTool } from './pdf/MergePdfTool';
import { ImageToPdfTool } from './pdf/ImageToPdfTool';
import { SplitPdfTool } from './pdf/SplitPdfTool';
import { WatermarkPdfTool } from './pdf/WatermarkPdfTool';
import { TextToPdfTool } from './pdf/TextToPdfTool';

// Media Tools
import { AudioWaveformCutter } from './media/AudioWaveformCutter';
import { VideoAspectResizer } from './media/VideoAspectResizer';
import { ToneGenerator } from './media/ToneGenerator';
import { VoiceRecorder } from './media/VoiceRecorder';
import { VideoFrameExtractor } from './media/VideoFrameExtractor';

// Developer Suite
import { DeveloperToolsSuite } from './developer/DeveloperToolsSuite';

// Core Specialized Math Tools
import { ScientificCalculator } from './math/ScientificCalculator';
import { PercentageCalculator } from './math/PercentageCalculator';
import { FractionRatioTool } from './math/FractionRatioTool';
import { UnitConverter } from './math/UnitConverter';
import { QuadraticMatrixTool } from './math/QuadraticMatrixTool';
import { AdvancedMathSuite } from './math/AdvancedMathSuite';

// Core Specialized Finance Tools
import { LoanCalculator } from './finance/LoanCalculator';
import { CompoundInterestTool } from './finance/CompoundInterestTool';
import { CurrencyInflationTool } from './finance/CurrencyInflationTool';
import { SalesTaxGstTool } from './finance/SalesTaxGstTool';
import { SalaryPaycheckTool } from './finance/SalaryPaycheckTool';
import { AdvancedFinanceSuite } from './finance/AdvancedFinanceSuite';

// Core Specialized Health Tools
import { BmiCalculator } from './health/BmiCalculator';
import { CalorieTdeeTool } from './health/CalorieTdeeTool';
import { BodyFatCalculator } from './health/BodyFatCalculator';
import { WaterIntakeTool } from './health/WaterIntakeTool';
import { HeartRateZonesTool } from './health/HeartRateZonesTool';
import { AdvancedHealthSuite } from './health/AdvancedHealthSuite';

// General Utility Tools
import { StylishFontGenerator } from './utility/StylishFontGenerator';
import { GeneralUtilityTools } from './utility/GeneralUtilityTools';

// Universal Engine for remaining 360 tools
import { UniversalToolEngine } from './universal/UniversalToolEngine';

interface ToolViewProps {
  tool: ToolItem;
  onBack: () => void;
  onSelectTool: (toolId: string) => void;
  relatedTools: ToolItem[];
}

export const ToolView: React.FC<ToolViewProps> = ({ tool, onBack, onSelectTool, relatedTools }) => {
  useToolSEO(tool);
  const theme = getToolTheme(tool.id, tool.category);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Render matching interactive tool component with 100% full JS/TS functional logic
  const renderToolComponent = () => {
    // 1. Dedicated Developer suite (Dark mode #0f172a theme)
    if (
      tool.category === 'developer' ||
      [
        'json-formatter-validator', 'base64-encode-decode', 'url-encode-decode', 'regex-tester',
        'uuid-v4-generator', 'hash-generator-md5-sha256', 'color-hex-rgb-converter', 'css-minifier-beautifier',
        'html-entity-encoder', 'sql-formatter', 'jwt-debugger-decoder', 'epoch-timestamp-converter',
        'markdown-to-html-converter', 'text-diff-checker', 'binary-ascii-converter', 'user-agent-parser',
        'meta-tag-generator', 'html-minifier', 'javascript-beautifier', 'curl-to-fetch-converter',
        'crontab-generator', 'xml-to-json-converter', 'yaml-to-json-converter', 'string-obfuscator',
        'ip-subnet-calculator'
      ].includes(tool.id)
    ) {
      return <DeveloperToolsSuite toolId={tool.id} />;
    }

    // 2. Dedicated PDF tools
    if (tool.id === 'merge-pdf') return <MergePdfTool />;
    if (tool.id === 'image-to-pdf') return <ImageToPdfTool />;
    if (tool.id === 'split-pdf') return <SplitPdfTool />;
    if (tool.id === 'watermark-pdf') return <WatermarkPdfTool />;
    if (tool.id === 'text-to-pdf') return <TextToPdfTool />;

    // 3. Dedicated Media tools
    if (tool.id === 'audio-waveform-cutter') return <AudioWaveformCutter />;
    if (tool.id === 'video-aspect-resizer') return <VideoAspectResizer />;
    if (tool.id === 'tone-frequency-generator' || tool.id === 'sound-tone-generator') return <ToneGenerator />;
    if (tool.id === 'voice-recorder') return <VoiceRecorder />;
    if (tool.id === 'video-frame-extractor') return <VideoFrameExtractor />;

    // 4. Dedicated Math tools
    if (tool.id === 'scientific-calculator') return <ScientificCalculator />;
    if (tool.id === 'percentage-calculator') return <PercentageCalculator />;
    if (tool.id === 'fraction-calculator' || tool.id === 'fraction-ratio') return <FractionRatioTool />;
    if (tool.id === 'unit-converter') return <UnitConverter />;
    if (tool.id === 'quadratic-matrix') return <QuadraticMatrixTool />;

    // 5. Dedicated Finance tools
    if (tool.id === 'loan-calculator') return <LoanCalculator />;
    if (tool.id === 'compound-interest' || tool.id === 'compound-interest-calculator') return <CompoundInterestTool />;
    if (tool.id === 'currency-inflation' || tool.id === 'currency-inflation-calculator') return <CurrencyInflationTool />;
    if (tool.id === 'sales-tax-gst' || tool.id === 'sales-tax-gst-calculator') return <SalesTaxGstTool />;
    if (tool.id === 'salary-paycheck' || tool.id === 'salary-paycheck-calculator') return <SalaryPaycheckTool />;

    // 6. Dedicated Health tools
    if (tool.id === 'bmi-calculator') return <BmiCalculator />;
    if (tool.id === 'calorie-calculator' || tool.id === 'calorie-tdee') return <CalorieTdeeTool />;
    if (tool.id === 'body-fat-percentage' || tool.id === 'body-fat-calculator') return <BodyFatCalculator />;
    if (tool.id === 'water-intake' || tool.id === 'daily-water-intake-calculator') return <WaterIntakeTool />;
    if (tool.id === 'heart-rate-zones' || tool.id === 'target-heart-rate-calculator') return <HeartRateZonesTool />;

    // 7. Utility: Stylish Font Generator
    if (tool.id === 'stylish-font-generator') return <StylishFontGenerator />;

    // 8. Advanced suites for category collections
    if (tool.category === 'math' && [
      'triangle-calculator', 'volume-calculator', 'standard-deviation-calculator',
      'random-number-generator', 'number-sequence-calculator', 'exponent-calculator',
      'quadratic-formula-calculator', 'slope-calculator', 'log-calculator'
    ].includes(tool.id)) {
      return <AdvancedMathSuite toolId={tool.id} />;
    }

    if (tool.category === 'finance' && [
      'mortgage-calculator', 'auto-loan-calculator', 'retirement-calculator',
      'amortization-calculator', 'investment-calculator', '401k-calculator',
      'credit-card-calculator', 'debt-payoff-calculator', 'roi-calculator'
    ].includes(tool.id)) {
      return <AdvancedFinanceSuite toolId={tool.id} />;
    }

    if (tool.category === 'health' && [
      'bmr-calculator', 'macro-calculator', 'ideal-weight-calculator',
      'pregnancy-calculator', 'due-date-calculator', 'pace-calculator',
      'one-rep-max-calculator', 'tdee-calculator', 'daily-water-intake-calculator'
    ].includes(tool.id)) {
      return <AdvancedHealthSuite toolId={tool.id} />;
    }

    if (tool.category === 'utility' && [
      'age-calculator', 'password-generator', 'dice-roller', 'ohms-law-calculator',
      'tip-calculator', 'gpa-calculator', 'bra-size-calculator', 'love-calculator',
      'conversion-calculator', 'fuel-cost-calculator'
    ].includes(tool.id)) {
      return <GeneralUtilityTools toolId={tool.id} />;
    }

    // 9. Universal Tool Engine (Guarantees every single one of the 360 tools is 100% interactive)
    return <UniversalToolEngine tool={tool} />;
  };

  const isDark = theme.themeType === 'developer' || theme.themeType === 'media';

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumbs & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Tools
          </button>
          <span>/</span>
          <span className="capitalize">{tool.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{tool.name}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          {copiedLink ? 'Link Copied!' : 'Share Tool'}
        </button>
      </div>

      {/* Tool Ad #1: Top Banner (Leaderboard above Tool Header) */}
      <AdSlot adConfig={ADS_CONFIG.toolAds.slot1Top} variant="banner" />

      {/* Tool Header - Styled with Category Theme */}
      <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${
        isDark 
          ? 'bg-[#0f172a] border-slate-800 text-slate-100 shadow-2xl' 
          : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/30">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md capitalize ${theme.badgeClass}`}>
                {tool.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Lock className="w-3 h-3 text-emerald-500" /> 100% Client-Side Privacy
              </span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 hidden sm:inline-flex">
                No Download Required
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Free Online {tool.name}
            </h1>
            <p className={`mt-1.5 text-sm max-w-3xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {tool.longDesc || tool.shortDesc || tool.description} Free, browser-based, and lightning-fast with instant calculation and zero server uploads.
            </p>
          </div>
        </div>

        {/* Interactive Tool Main Area + Privacy Guarantee Box + Ads */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 space-y-6">
            {renderToolComponent()}

            {/* Tool Ad #3: Post-Result / Output Area (High CTR) */}
            <AdSlot adConfig={ADS_CONFIG.toolAds.slot3PostResult} variant="banner" />
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Privacy Guarantee Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3 text-slate-800">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  Zero Server Upload Guarantee
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Your files, calculations, and inputs are processed solely inside your browser memory.
                  No sensitive documents or private data are ever transmitted to any remote servers.
                </p>
              </div>

              {/* Instant Execution Guarantee */}
              <div className={`p-5 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-900/60 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Instant Client-Side Engine
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  Real-time computations running natively in your browser memory for maximum speed and zero cloud latency.
                </p>
              </div>

              {/* Tool Ad #2: Workspace Mid / Sticky Sidebar Ad */}
              <AdSlot adConfig={ADS_CONFIG.toolAds.slot2Workspace} variant="box" />
            </div>
          </div>
        </div>
      </div>

      {/* Tool Ad #4: Pre-FAQ & Guide Banner */}
      <AdSlot adConfig={ADS_CONFIG.toolAds.slot4PreFaq} variant="banner" />

      {/* STEP-BY-STEP GUIDE & QUICK EXAMPLE (Exact requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-10 text-slate-900">
        
        {/* Step-by-Step Guide */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              How to Use This Tool? (Step-by-Step Guide)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Follow these simple steps to calculate, generate, or process your data right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                Step 1
              </div>
              <h3 className="font-bold text-sm text-slate-900">Open the Interface</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tool ko open karein, interface bilkul clean aur responsive hai jo mobile, tablet aur desktop har device par proper work karta hai.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                Step 2
              </div>
              <h3 className="font-bold text-sm text-slate-900">Enter Input Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Diye gaye input box ya field mein apna data/text enter karein (jaise number, text ya option select karna).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                Step 3
              </div>
              <h3 className="font-bold text-sm text-slate-900">Click Process / Generate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Process / Generate" ya "Calculate" button par click karein. Browser ke andar instant calculations run hon gi.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                Step 4
              </div>
              <h3 className="font-bold text-sm text-slate-900">Instant Result Screen</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aapka result instant screen par show ho jayega, jise aap direct one-click mein copy ya download kar sakte hain.
              </p>
            </div>
          </div>
        </div>

        {/* 💡 Quick Example Section */}
        <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h3 className="font-black text-slate-900 text-base">
                Quick Example Demonstration
              </h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(tool.exampleOutput || 'Verified Instant Result');
                setCopiedExample(true);
                setTimeout(() => setCopiedExample(false), 2000);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              {copiedExample ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedExample ? 'Copied Output' : 'Copy Sample Output'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Typical Input:
              </span>
              <p className="text-xs font-mono text-slate-800 break-words">
                {tool.exampleInput || 'Standard parameter inputs (e.g. Rate = 15%, Value = 240)'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Instant Output Result:
              </span>
              <p className="text-xs font-mono font-bold text-emerald-700 break-words">
                {tool.exampleOutput || 'Verified calculation computed in under 1ms'}
              </p>
            </div>
          </div>
        </div>

        {/* Structured Frequently Asked Questions (FAQ) Section */}
        {(() => {
          const rawFaqs = (tool.faq && tool.faq.length > 0) ? tool.faq : (tool.faqs || []);
          const displayFaqs = rawFaqs.length > 0 ? rawFaqs : [
            {
              question: `Is ${tool.name} completely free to use?`,
              answer: `Yes! ${tool.name} is 100% free forever with unlimited calculations and zero hidden subscriptions or paywalls.`
            },
            {
              question: `Are my files and calculations private and secure?`,
              answer: `Absolutely. All processing runs 100% client-side inside your browser memory using local JavaScript. No files or personal data are ever uploaded to remote servers.`
            },
            {
              question: `Does ${tool.name} work on mobile devices and tablets?`,
              answer: `Yes, ${tool.name} is fully responsive and optimized for smartphones, tablets, and desktop computers.`
            }
          ];

          return (
            <section
              id="faq-section"
              itemScope
              itemType="https://schema.org/FAQPage"
              className="space-y-4 pt-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Frequently Asked Questions (FAQ)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Everything you need to know about using {tool.name}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 self-start sm:self-auto bg-slate-100 px-3 py-1 rounded-full">
                  {displayFaqs.length} Questions Answered
                </span>
              </div>

              <div className="space-y-3">
                {displayFaqs.map((faq, idx) => {
                  const q = (faq as any).question || (faq as any).q;
                  const a = (faq as any).answer || (faq as any).a;
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      itemScope
                      itemProp="mainEntity"
                      itemType="https://schema.org/Question"
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen 
                          ? 'border-blue-300 bg-white shadow-xs' 
                          : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span itemProp="name" className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-700 text-[11px] font-black flex items-center justify-center shrink-0">
                            Q{idx + 1}
                          </span>
                          <span>{q}</span>
                        </span>
                        <span className="shrink-0 p-1 rounded-lg bg-slate-100 text-slate-500">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                          className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white"
                        >
                          <div itemProp="text" className="pl-7">
                            {a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

        {/* Tool Ad #5: Bottom Banner (Above Related Tools) */}
        <AdSlot adConfig={ADS_CONFIG.toolAds.slot5Bottom} variant="banner" className="pt-4" />

        {/* Related Tools - Opens in New Tab */}
        {relatedTools.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Explore More {tool.category.toUpperCase()} Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
