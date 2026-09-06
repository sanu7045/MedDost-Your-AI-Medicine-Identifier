import { describe, it, expect } from 'vitest';
import { DEFAULT_LANGUAGE, LANGUAGES, getLanguageMeta, getLocalizedValue, getUiText } from '../i18n';

describe('i18n utilities', () => {
  it('returns the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('english');
  });

  it('exposes all expected languages', () => {
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(8);
    expect(LANGUAGES.map((l) => l.id)).toContain('english');
  });

  it('getLanguageMeta returns correct metadata', () => {
    const meta = getLanguageMeta('urdu');
    expect(meta.id).toBe('urdu');
    expect(meta.dir).toBe('rtl');
  });

  it('getLanguageMeta falls back to first language for unknown id', () => {
    const meta = getLanguageMeta('nonexistent');
    expect(meta.id).toBe(LANGUAGES[0].id);
  });

  it('getLocalizedValue extracts language-specific string', () => {
    const value = { english: 'Use', hindi: 'उपयोग' };
    expect(getLocalizedValue(value, 'hindi')).toBe('उपयोग');
    expect(getLocalizedValue(value, 'english')).toBe('Use');
  });

  it('getLocalizedValue falls back to english', () => {
    const value = { english: 'Use' };
    expect(getLocalizedValue(value, 'hindi')).toBe('Use');
  });

  it('getLocalizedValue handles plain strings', () => {
    expect(getLocalizedValue('plain', 'english')).toBe('plain');
  });

  it('getLocalizedValue returns empty for falsy input', () => {
    expect(getLocalizedValue(null, 'english')).toBe('');
    expect(getLocalizedValue(undefined, 'english')).toBe('');
  });

  it('getUiText returns a complete UI_TEXT object', () => {
    const text = getUiText('english');
    expect(text.header).toBeDefined();
    expect(text.ocr).toBeDefined();
    expect(text.result).toBeDefined();
    expect(text.upload).toBeDefined();
    expect(text.history).toBeDefined();
    expect(text.footer).toBeDefined();
  });

  it('getUiText falls back to english for unknown language', () => {
    const text = getUiText('nonexistent');
    const english = getUiText('english');
    expect(text).toEqual(english);
  });

  it('apiKeyMissing message references GEMINI_API_KEY not VITE_GEMINI_API_KEY', () => {
    LANGUAGES.forEach((lang) => {
      const text = getUiText(lang.id);
      expect(text.ocr.apiKeyMissing).not.toContain('VITE_GEMINI_API_KEY');
      expect(text.ocr.apiKeyMissing).toContain('GEMINI_API_KEY');
    });
  });
});
