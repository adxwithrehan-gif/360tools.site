import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { 
  Share2, Copy, Check, MessageCircle, Twitter, Facebook, 
  Linkedin, Send, ExternalLink, Bookmark
} from 'lucide-react';

interface SocialShareBarProps {
  tool: ToolItem;
  className?: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ tool, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const toolUrl = typeof window !== 'undefined' 
    ? `https://360tools.site/tools/${encodeURIComponent(tool.id)}`
    : `https://360tools.site/tools/${tool.id}`;
  
  const shareText = `Check out this free online ${tool.name} tool on 360tools.site - 100% private, instant calculation with zero upload!`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(toolUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = toolUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Free Online ${tool.name} | 360tools`,
          text: shareText,
          url: toolUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      copyToClipboard();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${toolUrl}`)}`,
      icon: MessageCircle,
      bg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200/80',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(toolUrl)}&hashtags=tools,online,free,productivity`,
      icon: Twitter,
      bg: 'bg-slate-100 text-slate-900 hover:bg-black hover:text-white border-slate-300',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`,
      icon: Facebook,
      bg: 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border-blue-200/80',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(toolUrl)}`,
      icon: Linkedin,
      bg: 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border-sky-200/80',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: Send,
      bg: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white border-cyan-200/80',
    },
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3.5 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              Share & Support This Tool
            </h4>
            <p className="text-[11px] text-slate-500">
              Help fellow students, creators & developers discover free 100% private web tools.
            </p>
          </div>
        </div>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={copyToClipboard}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-150 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-900 text-white hover:bg-blue-600'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Tool URL'}</span>
        </button>
      </div>

      {/* Social Button Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {shareLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share ${tool.name} on ${item.name}`}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${item.bg}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </a>
          );
        })}

        {/* Native Mobile Share Trigger */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>More Apps</span>
        </button>
      </div>
    </div>
  );
};
