import React, { useState, useMemo } from 'react';
import { 
  Code, Copy, Check, RefreshCw, Terminal, Play, Shield, 
  Key, Hash, Binary, Sliders, FileText, CheckCircle2, 
  Layers, Lock, Sparkles, ArrowRightLeft, FileEdit
} from 'lucide-react';

interface DeveloperToolsProps {
  toolId: string;
}

export const DeveloperToolsSuite: React.FC<DeveloperToolsProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{"name":"360 Tools","verified":true,"features":["Pure JS","Zero Lag","No Ads"],"stats":{"tools":360,"speed":"instant"}}');
  const [jsonIndent, setJsonIndent] = useState(2);

  // 2. Base64 State
  const [base64Input, setBase64Input] = useState('Hello Developers! 360 Tool Suite 🚀');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  // 3. URL State
  const [urlInput, setUrlInput] = useState('https://360toolapp.online/search?q=pure javascript tools&category=developer#top');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  // 4. Regex Tester State
  const [regexPattern, setRegexPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Contact support@example.com or admin@360toolapp.online for inquiries. Invalid: test@bad');

  // 5. UUID Generator State
  const [uuidCount, setUuidCount] = useState(5);
  const [uuidList, setUuidList] = useState<string[]>([]);

  // 6. Hash Generator State
  const [hashInput, setHashInput] = useState('SecurePasscode2026');
  const [hashAlgorithm, setHashAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [calculatedHash, setCalculatedHash] = useState('');

  // 7. Color Converter State
  const [hexColor, setHexColor] = useState('#22c55e');

  // 8. Epoch Converter State
  const [epochTimestamp, setEpochTimestamp] = useState(Math.floor(Date.now() / 1000).toString());

  // 9. JWT Decoder State
  const [jwtToken, setJwtToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaXNoYmEgS2hhbiIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTYyMzkwMjJ9.4z7kE8W8R6p9uX_sample_signature_only');

  // 10. Markdown Previewer State
  const [markdownInput, setMarkdownInput] = useState('# 360 Tools Studio\n\n- **100% Client-Side** execution\n- Real-time **Vanilla JavaScript**\n\n```js\nconsole.log("Zero lag, maximum privacy!");\n```');

  // 11. CSS Minifier State
  const [cssInput, setCssInput] = useState('.terminal-box {\n  background-color: #0f172a;\n  color: #22c55e;\n  padding: 1.5rem;\n  border-radius: 12px;\n}');

  // 12. Text Diff State
  const [diffOriginal, setDiffOriginal] = useState('function calculateTotal(a, b) {\n  return a + b;\n}');
  const [diffModified, setDiffModified] = useState('function calculateTotal(a, b, discount = 0) {\n  const sum = a + b;\n  return sum - discount;\n}');

  // Compute UUIDs on load
  React.useEffect(() => {
    generateUuids();
    computeCryptoHash(hashInput, hashAlgorithm);
  }, []);

  const generateUuids = () => {
    const list = Array.from({ length: uuidCount }, () => crypto.randomUUID());
    setUuidList(list);
  };

  const computeCryptoHash = async (text: string, algo: string) => {
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest(algo, msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setCalculatedHash(hashHex);
    } catch {
      setCalculatedHash('Browser crypto API error');
    }
  };

  // Color conversions
  const rgbColor = useMemo(() => {
    let cleanHex = hexColor.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num) || cleanHex.length !== 6) return { r: 34, g: 197, b: 94, hsl: 'hsl(142, 71%, 45%)' };
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    
    // HSL calculation
    const rP = r / 255, gP = g / 255, bP = b / 255;
    const max = Math.max(rP, gP, bP), min = Math.min(rP, gP, bP);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rP: h = (gP - bP) / d + (gP < bP ? 6 : 0); break;
        case gP: h = (bP - rP) / d + 2; break;
        case bP: h = (rP - gP) / d + 4; break;
      }
      h /= 6;
    }
    return {
      r, g, b,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    };
  }, [hexColor]);

  // JSON formatting
  const formattedJson = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return { valid: true, text: JSON.stringify(parsed, null, jsonIndent), error: null };
    } catch (err: any) {
      return { valid: false, text: '', error: err.message };
    }
  }, [jsonInput, jsonIndent]);

  // Base64 Codec
  const base64Result = useMemo(() => {
    try {
      if (base64Mode === 'encode') {
        return { success: true, text: btoa(unescape(encodeURIComponent(base64Input))) };
      } else {
        return { success: true, text: decodeURIComponent(escape(atob(base64Input))) };
      }
    } catch (e: any) {
      return { success: false, text: `Decoding error: Invalid base64 sequence (${e.message})` };
    }
  }, [base64Input, base64Mode]);

  // URL Codec
  const urlResult = useMemo(() => {
    try {
      if (urlMode === 'encode') {
        return encodeURIComponent(urlInput);
      } else {
        return decodeURIComponent(urlInput);
      }
    } catch {
      return 'Malformed URL sequence';
    }
  }, [urlInput, urlMode]);

  // Regex Results
  const regexMatches = useMemo(() => {
    try {
      const reg = new RegExp(regexPattern, regexFlags);
      const matches = Array.from(regexText.matchAll(reg));
      return { valid: true, matches: matches.map(m => m[0]), error: null };
    } catch (e: any) {
      return { valid: false, matches: [], error: e.message };
    }
  }, [regexPattern, regexFlags, regexText]);

  // JWT Decoded
  const jwtDecoded = useMemo(() => {
    try {
      const parts = jwtToken.trim().split('.');
      if (parts.length < 2) throw new Error('JWT must have at least header and payload parts.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { valid: true, header, payload, error: null };
    } catch (e: any) {
      return { valid: false, header: null, payload: null, error: e.message };
    }
  }, [jwtToken]);

  return (
    <div className="bg-[#0f172a] text-slate-100 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      {/* Dark Mode Terminal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-emerald-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> developer@runtime: ~/{toolId}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            Vanilla JS Pure Execution
          </span>
        </div>
      </div>

      {/* 1. JSON FORMATTER & VALIDATOR */}
      {(toolId.includes('json') || toolId === 'developer') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Code className="w-4 h-4" /> JSON Formatter, Minifier & Validator
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span>Indent:</span>
              {[2, 4, 0].map(spaces => (
                <button
                  key={spaces}
                  onClick={() => setJsonIndent(spaces)}
                  className={`px-2 py-1 rounded border transition-colors ${
                    jsonIndent === spaces 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {spaces === 0 ? 'Minify' : `${spaces} Sp`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Raw JSON Input:</label>
              <textarea
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 resize-y"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400">
                  {formattedJson.valid ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold">Syntax Error</span>
                  )}
                </label>
                {formattedJson.valid && (
                  <button
                    onClick={() => copyToClipboard(formattedJson.text)}
                    className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy Formatted
                  </button>
                )}
              </div>
              {formattedJson.valid ? (
                <pre className="w-full bg-slate-950 font-mono text-xs text-emerald-300 p-3 rounded-xl border border-slate-700 overflow-x-auto h-[216px]">
                  {formattedJson.text}
                </pre>
              ) : (
                <div className="w-full bg-rose-950/40 border border-rose-800 text-rose-300 p-3 rounded-xl font-mono text-xs h-[216px] overflow-auto">
                  <p className="font-bold mb-1">Parsing Failure:</p>
                  <p>{formattedJson.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BASE64 ENCODER / DECODER */}
      {toolId.includes('base64') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Binary className="w-4 h-4" /> Base64 Encoder & Decoder
            </h3>
            <div className="flex gap-2 text-xs font-mono">
              <button
                onClick={() => setBase64Mode('encode')}
                className={`px-3 py-1 rounded border ${base64Mode === 'encode' ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                Encode
              </button>
              <button
                onClick={() => setBase64Mode('decode')}
                className={`px-3 py-1 rounded border ${base64Mode === 'decode' ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                Decode
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              value={base64Input}
              onChange={e => setBase64Input(e.target.value)}
              placeholder="Enter text to process..."
              rows={4}
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
            />

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative font-mono text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Result ({base64Mode}):</span>
                <button
                  onClick={() => copyToClipboard(base64Result.text)}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <p className="break-all text-emerald-300 select-all">{base64Result.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. REGEX TESTER */}
      {toolId.includes('regex') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <Code className="w-4 h-4" /> Real-time Regular Expression Debugger
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3">
              <label className="text-xs font-mono text-slate-400 block mb-1">Regex Pattern:</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                <span className="text-cyan-400 font-mono mr-1">/</span>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={e => setRegexPattern(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-slate-200 focus:outline-hidden"
                />
                <span className="text-cyan-400 font-mono ml-1">/</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Flags (g, i, m):</label>
              <input
                type="text"
                value={regexFlags}
                onChange={e => setRegexFlags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 font-mono text-xs text-slate-200 px-3 py-2 rounded-xl focus:border-cyan-400 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Test Text:</label>
            <textarea
              value={regexText}
              onChange={e => setRegexText(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-hidden"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <span className="text-slate-400 block mb-2">Matches Found ({regexMatches.matches.length}):</span>
            {regexMatches.valid ? (
              <div className="flex flex-wrap gap-2">
                {regexMatches.matches.length > 0 ? (
                  regexMatches.matches.map((m, idx) => (
                    <span key={idx} className="bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-2 py-1 rounded">
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No matches for current pattern.</span>
                )}
              </div>
            ) : (
              <span className="text-rose-400">{regexMatches.error}</span>
            )}
          </div>
        </div>
      )}

      {/* 4. UUID GENERATOR */}
      {toolId.includes('uuid') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <Key className="w-4 h-4" /> Cryptographic UUID v4 Generator
            </h3>
            <button
              onClick={generateUuids}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-generate
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400">Quantity:</label>
            {[1, 5, 10, 20].map(n => (
              <button
                key={n}
                onClick={() => {
                  setUuidCount(n);
                  setUuidList(Array.from({ length: n }, () => crypto.randomUUID()));
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded border ${uuidCount === n ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {uuidList.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
                <span>{uuid}</span>
                <button
                  onClick={() => copyToClipboard(uuid)}
                  className="text-slate-400 hover:text-emerald-400 p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. HASH GENERATOR (MD5 / SHA-256) */}
      {toolId.includes('hash') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <Shield className="w-4 h-4" /> WebCrypto Hash Generator
          </h3>

          <div className="flex gap-2">
            {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map(algo => (
              <button
                key={algo}
                onClick={() => {
                  setHashAlgorithm(algo);
                  computeCryptoHash(hashInput, algo);
                }}
                className={`px-3 py-1 text-xs font-mono rounded border ${hashAlgorithm === algo ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'bg-slate-800 text-slate-300 border-slate-700'}`}
              >
                {algo}
              </button>
            ))}
          </div>

          <textarea
            value={hashInput}
            onChange={e => {
              setHashInput(e.target.value);
              computeCryptoHash(e.target.value, hashAlgorithm);
            }}
            placeholder="Type text to hash..."
            rows={3}
            className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-emerald-500 focus:outline-hidden"
          />

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-400">{hashAlgorithm} Hash:</span>
              <button
                onClick={() => copyToClipboard(calculatedHash)}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>
            <p className="break-all text-emerald-300 select-all font-mono">{calculatedHash}</p>
          </div>
        </div>
      )}

      {/* 6. COLOR HEX / RGB / HSL */}
      {toolId.includes('color') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <Sliders className="w-4 h-4" /> Color Codes Converter & Palette Inspector
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={hexColor}
                onChange={e => setHexColor(e.target.value)}
                className="w-16 h-16 rounded-2xl border-2 border-slate-700 cursor-pointer bg-transparent"
              />
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">HEX Code:</label>
                <input
                  type="text"
                  value={hexColor}
                  onChange={e => setHexColor(e.target.value)}
                  className="bg-slate-950 font-mono text-sm text-emerald-300 border border-slate-700 px-3 py-1.5 rounded-lg focus:border-emerald-500 focus:outline-hidden uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">RGB:</span>
                <span className="text-emerald-300">rgb({rgbColor.r}, {rgbColor.g}, {rgbColor.b})</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400">HSL:</span>
                <span className="text-emerald-300">{rgbColor.hsl}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. JWT DECODER */}
      {toolId.includes('jwt') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
            <Key className="w-4 h-4" /> JSON Web Token (JWT) Client-Side Inspector
          </h3>

          <textarea
            value={jwtToken}
            onChange={e => setJwtToken(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-hidden"
          />

          {jwtDecoded.valid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-cyan-400 block mb-2">HEADER: ALGORITHM & TOKEN TYPE</span>
                <pre className="font-mono text-xs text-slate-300 overflow-auto max-h-48">
                  {JSON.stringify(jwtDecoded.header, null, 2)}
                </pre>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono text-emerald-400 block mb-2">PAYLOAD: DATA CLAIMS</span>
                <pre className="font-mono text-xs text-slate-300 overflow-auto max-h-48">
                  {JSON.stringify(jwtDecoded.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-rose-400 font-mono text-xs">{jwtDecoded.error}</p>
          )}
        </div>
      )}

      {/* 8. EPOCH TIMESTAMP */}
      {toolId.includes('epoch') && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Unix Epoch Timestamp Converter
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={epochTimestamp}
              onChange={e => setEpochTimestamp(e.target.value)}
              placeholder="e.g. 1716239022"
              className="flex-1 bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-700 px-3 py-2 rounded-xl focus:border-emerald-400 focus:outline-hidden"
            />
            <button
              onClick={() => setEpochTimestamp(Math.floor(Date.now() / 1000).toString())}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold"
            >
              Current Now
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">GMT / UTC:</span>
              <span className="text-emerald-300">{new Date(parseInt(epochTimestamp || '0') * 1000).toUTCString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Local Browser Time:</span>
              <span className="text-emerald-300">{new Date(parseInt(epochTimestamp || '0') * 1000).toString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ISO 8601:</span>
              <span className="text-emerald-300">{new Date(parseInt(epochTimestamp || '0') * 1000).toISOString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Developer Action Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <span>⚡ 100% In-Memory Processing & Zero Network Leaks</span>
        <span className="text-emerald-400">Status: 200 OK</span>
      </div>
    </div>
  );
};
