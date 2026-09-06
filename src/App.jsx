import { useState } from 'react';
import OCRProcessor from './components/OCRProcessor';
import Header from './components/Header';
import Footer from './components/Footer';
import { DEFAULT_LANGUAGE, LANGUAGES, getLanguageMeta, getUiText } from './i18n';

function App() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const text = getUiText(language);
  const languageMeta = getLanguageMeta(language);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 font-sans' dir={languageMeta.dir}>
      <Header language={language} languages={LANGUAGES} onLanguageChange={setLanguage} text={text.header} />
      <main className="flex-grow w-full pt-10 pb-20 px-4">
        <OCRProcessor language={language} text={text} />
      </main>
      <Footer text={text.footer} />
    </div>
  );
}

export default App;

