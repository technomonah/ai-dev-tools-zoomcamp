import type { Language } from '../types';

interface LanguageSelectorProps {
  language: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}

export function LanguageSelector({ language, onChange, disabled }: LanguageSelectorProps) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value as Language)}
      disabled={disabled}
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
    </select>
  );
}
