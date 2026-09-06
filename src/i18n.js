export const DEFAULT_LANGUAGE = 'english';

export const LANGUAGES = [
  { id: 'english', label: 'English', voice: 'en-IN', dir: 'ltr' },
  { id: 'hindi', label: 'हिन्दी', voice: 'hi-IN', dir: 'ltr' },
  { id: 'bengali', label: 'বাংলা', voice: 'bn-IN', dir: 'ltr' },
  { id: 'marathi', label: 'मराठी', voice: 'mr-IN', dir: 'ltr' },
  { id: 'telugu', label: 'తెలుగు', voice: 'te-IN', dir: 'ltr' },
  { id: 'tamil', label: 'தமிழ்', voice: 'ta-IN', dir: 'ltr' },
  { id: 'gujarati', label: 'ગુજરાતી', voice: 'gu-IN', dir: 'ltr' },
  { id: 'urdu', label: 'اردو', voice: 'ur-PK', dir: 'rtl' }
];

export const getLanguageMeta = (language) =>
  LANGUAGES.find((item) => item.id === language) || LANGUAGES[0];

export const getLocalizedValue = (value, language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;

  return value[language] || value.english || Object.values(value).find(Boolean) || '';
};

export const UI_TEXT = {
  english: {
    header: {
      subtitle: 'AI Medicine Identifier',
      assistant: 'Your Health Assistant',
      languageLabel: 'Website language'
    },
    ocr: {
      title: 'Identify Medicine',
      description: 'Upload an image or speak the name of your medicine to know its use instantly.',
      uploadPhoto: 'Upload Photo',
      voiceType: 'Voice / Type',
      analyzing: 'AI is Analyzing...',
      identifyWithAi: 'Identify with AI',
      listening: 'Listening... Speak now!',
      tapMic: 'Tap mic & say the medicine name',
      inputPlaceholder: 'e.g. Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'Search medicine',
      unsupportedVoice: 'Sorry, your browser does not support voice input. Please use Chrome or Edge.',
      apiKeyMissing: 'Please add your Gemini API Key in the .env file (GEMINI_API_KEY) and restart the server.',
      backendUnavailable: 'Backend server unavailable. Start it with `npm run dev:all` (or `npm run server`).',
      notFound: 'Could not identify any medicine. Try again with a clearer image or name.',
      genericFailure: 'Could not identify medicine.',
      imageFailure: 'Failed to process image with AI.',
      voiceFailure: 'Failed to process voice query with AI.',
      quotaExceeded: 'API quota exceeded. Please check your plan or try again later.'
    },
    upload: {
      drop: 'Drop image here',
      click: 'Click or drag image to upload',
      hint: 'Upload a clear photo of the medicine strip or bottle label. Supports JPG, PNG.',
      selected: 'Image Selected',
      remove: 'Remove image'
    },
    result: {
      loadingTitle: 'AI is Analyzing...',
      loadingDescription: 'Please wait while our Gemini AI identifies the medicine and fetches its details in simple language.',
      stopSpeaking: 'Stop speaking',
      listen: 'Listen to result',
      useLabel: 'Use / Kis Kaam Aati Hai',
      dosageLabel: 'Dosage & Safety',
      referencePhotos: 'Medicine Photo Preview',
      photosLoading: 'Loading photos...',
      seeRealPhotos: 'See Real Photos of',
      medicineNotIdentified: 'Medicine Not Identified',
      notIdentifiedDescription: "Our AI couldn't clearly identify a medicine. Please ensure the image is clear, well-lit, and the medicine name is fully visible.",
      aiResponse: 'AI Response'
    },
    history: {
      title: 'Recent Scans',
      clear: 'Clear History',
      remove: 'Remove'
    },
    footer: {
      disclaimer: 'Disclaimer:',
      short: 'Not a substitute for professional medical advice.',
      long: 'The information provided by MedDost is for educational and informational purposes only. Always consult a qualified healthcare provider before starting, stopping, or altering any medication based on this tool.'
    }
  },
  hindi: {
    header: {
      subtitle: 'एआई दवा पहचानकर्ता',
      assistant: 'आपका स्वास्थ्य सहायक',
      languageLabel: 'वेबसाइट की भाषा'
    },
    ocr: {
      title: 'दवा पहचानें',
      description: 'दवा की फोटो अपलोड करें या नाम बोलें और उसका उपयोग तुरंत जानें।',
      uploadPhoto: 'फोटो अपलोड',
      voiceType: 'आवाज / टाइप',
      analyzing: 'एआई जांच कर रहा है...',
      identifyWithAi: 'एआई से पहचानें',
      listening: 'सुन रहा है... अब बोलें!',
      tapMic: 'माइक दबाकर दवा का नाम बोलें',
      inputPlaceholder: 'जैसे Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'दवा खोजें',
      unsupportedVoice: 'माफ करें, आपका ब्राउज़र वॉइस इनपुट सपोर्ट नहीं करता। कृपया Chrome या Edge इस्तेमाल करें।',
      apiKeyMissing: '.env फाइल में Gemini API Key (GEMINI_API_KEY) जोड़ें और सर्वर फिर से शुरू करें।',
      notFound: 'दवा पहचान नहीं पाई। साफ फोटो या सही नाम से फिर कोशिश करें।',
      genericFailure: 'दवा पहचान नहीं पाई।',
      imageFailure: 'एआई से फोटो प्रोसेस नहीं हो सकी।',
      voiceFailure: 'एआई से वॉइस खोज प्रोसेस नहीं हो सकी।'
    },
    upload: {
      drop: 'फोटो यहां छोड़ें',
      click: 'फोटो अपलोड करने के लिए क्लिक या ड्रैग करें',
      hint: 'दवा की स्ट्रिप या बोतल लेबल की साफ फोटो अपलोड करें। JPG, PNG सपोर्ट है।',
      selected: 'फोटो चुनी गई',
      remove: 'फोटो हटाएं'
    },
    result: {
      loadingTitle: 'एआई जांच कर रहा है...',
      loadingDescription: 'कृपया प्रतीक्षा करें, Gemini AI दवा पहचानकर आसान भाषा में जानकारी ला रहा है।',
      stopSpeaking: 'बोलना रोकें',
      listen: 'परिणाम सुनें',
      useLabel: 'उपयोग / किस काम आती है',
      dosageLabel: 'खुराक और सुरक्षा',
      referencePhotos: 'दवा फोटो प्रीव्यू',
      photosLoading: 'फोटो लोड हो रही हैं...',
      seeRealPhotos: 'असली फोटो देखें:',
      medicineNotIdentified: 'दवा पहचान नहीं पाई',
      notIdentifiedDescription: 'एआई दवा को साफ पहचान नहीं पाया। कृपया साफ, रोशनी वाली फोटो दें जिसमें दवा का नाम पूरा दिखे।',
      aiResponse: 'एआई जवाब'
    },
    history: {
      title: 'हाल की स्कैन',
      clear: 'इतिहास साफ करें'
    },
    footer: {
      disclaimer: 'अस्वीकरण:',
      short: 'यह डॉक्टर की सलाह का विकल्प नहीं है।',
      long: 'MedDost की जानकारी केवल शिक्षा और सामान्य जानकारी के लिए है। इस टूल के आधार पर कोई दवा शुरू, बंद या बदलने से पहले योग्य डॉक्टर से सलाह लें।'
    }
  },
  bengali: {
    header: {
      subtitle: 'এআই ওষুধ শনাক্তকারী',
      assistant: 'আপনার স্বাস্থ্য সহায়ক',
      languageLabel: 'ওয়েবসাইটের ভাষা'
    },
    ocr: {
      title: 'ওষুধ শনাক্ত করুন',
      description: 'ওষুধের ছবি আপলোড করুন বা নাম বলুন, ব্যবহার সঙ্গে সঙ্গে জানুন।',
      uploadPhoto: 'ছবি আপলোড',
      voiceType: 'ভয়েস / টাইপ',
      analyzing: 'এআই বিশ্লেষণ করছে...',
      identifyWithAi: 'এআই দিয়ে শনাক্ত করুন',
      listening: 'শুনছে... এখন বলুন!',
      tapMic: 'মাইক চাপুন ও ওষুধের নাম বলুন',
      inputPlaceholder: 'যেমন Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'ওষুধ খুঁজুন',
      unsupportedVoice: 'দুঃখিত, আপনার ব্রাউজার ভয়েস ইনপুট সমর্থন করে না। Chrome বা Edge ব্যবহার করুন।',
      apiKeyMissing: '.env ফাইলে Gemini API Key (GEMINI_API_KEY) যোগ করে সার্ভার আবার চালু করুন।',
      notFound: 'ওষুধ শনাক্ত করা যায়নি। পরিষ্কার ছবি বা নাম দিয়ে আবার চেষ্টা করুন।',
      genericFailure: 'ওষুধ শনাক্ত করা যায়নি।',
      imageFailure: 'এআই দিয়ে ছবি প্রসেস করা যায়নি।',
      voiceFailure: 'এআই দিয়ে ভয়েস সার্চ প্রসেস করা যায়নি।'
    },
    upload: {
      drop: 'ছবি এখানে ছাড়ুন',
      click: 'ছবি আপলোড করতে ক্লিক বা ড্র্যাগ করুন',
      hint: 'ওষুধের স্ট্রিপ বা বোতলের লেবেলের পরিষ্কার ছবি আপলোড করুন। JPG, PNG সমর্থিত।',
      selected: 'ছবি নির্বাচিত',
      remove: 'ছবি সরান'
    },
    result: {
      loadingTitle: 'এআই বিশ্লেষণ করছে...',
      loadingDescription: 'Gemini AI ওষুধ শনাক্ত করে সহজ ভাষায় তথ্য আনছে, অনুগ্রহ করে অপেক্ষা করুন।',
      stopSpeaking: 'পড়া বন্ধ করুন',
      listen: 'ফলাফল শুনুন',
      useLabel: 'ব্যবহার',
      dosageLabel: 'ডোজ ও নিরাপত্তা',
      referencePhotos: 'ওষুধের ছবি প্রিভিউ',
      photosLoading: 'ছবি লোড হচ্ছে...',
      seeRealPhotos: 'আসল ছবি দেখুন:',
      medicineNotIdentified: 'ওষুধ শনাক্ত হয়নি',
      notIdentifiedDescription: 'এআই পরিষ্কারভাবে ওষুধ শনাক্ত করতে পারেনি। দয়া করে পরিষ্কার, আলোযুক্ত ছবি দিন যেখানে ওষুধের নাম পুরো দেখা যায়।',
      aiResponse: 'এআই উত্তর'
    },
    history: {
      title: 'সাম্প্রতিক স্ক্যান',
      clear: 'ইতিহাস মুছুন'
    },
    footer: {
      disclaimer: 'দাবিত্যাগ:',
      short: 'এটি চিকিৎসকের পরামর্শের বিকল্প নয়।',
      long: 'MedDost-এর তথ্য শুধুমাত্র শিক্ষা ও সাধারণ তথ্যের জন্য। এই টুলের ভিত্তিতে কোনো ওষুধ শুরু, বন্ধ বা পরিবর্তন করার আগে যোগ্য স্বাস্থ্যকর্মীর পরামর্শ নিন।'
    }
  },
  marathi: {
    header: {
      subtitle: 'एआय औषध ओळखकर्ता',
      assistant: 'तुमचा आरोग्य सहाय्यक',
      languageLabel: 'वेबसाइट भाषा'
    },
    ocr: {
      title: 'औषध ओळखा',
      description: 'औषधाचा फोटो अपलोड करा किंवा नाव बोला आणि उपयोग लगेच जाणून घ्या.',
      uploadPhoto: 'फोटो अपलोड',
      voiceType: 'आवाज / टाइप',
      analyzing: 'एआय विश्लेषण करत आहे...',
      identifyWithAi: 'एआयने ओळखा',
      listening: 'ऐकत आहे... आता बोला!',
      tapMic: 'माइक दाबा आणि औषधाचे नाव बोला',
      inputPlaceholder: 'उदा. Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'औषध शोधा',
      unsupportedVoice: 'माफ करा, तुमचा ब्राउझर voice input सपोर्ट करत नाही. कृपया Chrome किंवा Edge वापरा.',
      apiKeyMissing: '.env फाइलमध्ये Gemini API Key (GEMINI_API_KEY) जोडा आणि सर्व्हर पुन्हा सुरू करा.',
      notFound: 'औषध ओळखता आले नाही. स्पष्ट फोटो किंवा नावाने पुन्हा प्रयत्न करा.',
      genericFailure: 'औषध ओळखता आले नाही.',
      imageFailure: 'एआयने फोटो प्रोसेस करता आला नाही.',
      voiceFailure: 'एआयने voice search प्रोसेस करता आला नाही.'
    },
    upload: {
      drop: 'फोटो येथे सोडा',
      click: 'फोटो अपलोड करण्यासाठी क्लिक किंवा ड्रॅग करा',
      hint: 'औषधाच्या स्ट्रिपचा किंवा बाटलीच्या लेबलचा स्पष्ट फोटो अपलोड करा. JPG, PNG सपोर्ट आहे.',
      selected: 'फोटो निवडला',
      remove: 'फोटो काढा'
    },
    result: {
      loadingTitle: 'एआय विश्लेषण करत आहे...',
      loadingDescription: 'Gemini AI औषध ओळखून सोप्या भाषेत माहिती आणत आहे, कृपया थांबा.',
      stopSpeaking: 'बोलणे थांबवा',
      listen: 'निकाल ऐका',
      useLabel: 'उपयोग',
      dosageLabel: 'डोस आणि सुरक्षितता',
      referencePhotos: 'औषध फोटो पूर्वावलोकन',
      photosLoading: 'फोटो लोड होत आहेत...',
      seeRealPhotos: 'खरे फोटो पहा:',
      medicineNotIdentified: 'औषध ओळखले नाही',
      notIdentifiedDescription: 'एआयला औषध स्पष्टपणे ओळखता आले नाही. कृपया प्रकाशात घेतलेला स्पष्ट फोटो द्या ज्यात नाव पूर्ण दिसेल.',
      aiResponse: 'एआय उत्तर'
    },
    history: {
      title: 'अलीकडील स्कॅन',
      clear: 'इतिहास साफ करा'
    },
    footer: {
      disclaimer: 'सूचना:',
      short: 'हे वैद्यकीय सल्ल्याचा पर्याय नाही.',
      long: 'MedDost ची माहिती केवळ शिक्षण आणि माहितीसाठी आहे. या टूलच्या आधारे कोणतेही औषध सुरू, बंद किंवा बदलण्यापूर्वी योग्य डॉक्टरांचा सल्ला घ्या.'
    }
  },
  telugu: {
    header: {
      subtitle: 'ఏఐ ఔషధ గుర్తింపు',
      assistant: 'మీ ఆరోగ్య సహాయకుడు',
      languageLabel: 'వెబ్‌సైట్ భాష'
    },
    ocr: {
      title: 'ఔషధాన్ని గుర్తించండి',
      description: 'ఔషధ ఫోటో అప్లోడ్ చేయండి లేదా పేరు చెప్పండి, ఉపయోగం వెంటనే తెలుసుకోండి.',
      uploadPhoto: 'ఫోటో అప్లోడ్',
      voiceType: 'వాయిస్ / టైప్',
      analyzing: 'ఏఐ విశ్లేషిస్తోంది...',
      identifyWithAi: 'ఏఐతో గుర్తించండి',
      listening: 'వింటోంది... ఇప్పుడు చెప్పండి!',
      tapMic: 'మైక్ నొక్కి ఔషధ పేరు చెప్పండి',
      inputPlaceholder: 'ఉదా. Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'ఔషధం వెతకండి',
      unsupportedVoice: 'క్షమించండి, మీ బ్రౌజర్ voice input కు మద్దతు ఇవ్వదు. Chrome లేదా Edge ఉపయోగించండి.',
      apiKeyMissing: '.env ఫైల్‌లో Gemini API Key (GEMINI_API_KEY) జోడించి సర్వర్‌ను మళ్లీ ప్రారంభించండి.',
      notFound: 'ఔషధం గుర్తించలేకపోయాం. స్పష్టమైన ఫోటో లేదా పేరుతో మళ్లీ ప్రయత్నించండి.',
      genericFailure: 'ఔషధం గుర్తించలేకపోయాం.',
      imageFailure: 'ఏఐతో ఫోటో ప్రాసెస్ కాలేదు.',
      voiceFailure: 'ఏఐతో voice search ప్రాసెస్ కాలేదు.'
    },
    upload: {
      drop: 'ఫోటోను ఇక్కడ వదలండి',
      click: 'ఫోటో అప్లోడ్ చేయడానికి క్లిక్ లేదా డ్రాగ్ చేయండి',
      hint: 'ఔషధ స్ట్రిప్ లేదా బాటిల్ లేబుల్ స్పష్టమైన ఫోటో అప్లోడ్ చేయండి. JPG, PNG మద్దతు ఉంది.',
      selected: 'ఫోటో ఎంపికైంది',
      remove: 'ఫోటో తీసివేయండి'
    },
    result: {
      loadingTitle: 'ఏఐ విశ్లేషిస్తోంది...',
      loadingDescription: 'Gemini AI ఔషధాన్ని గుర్తించి సులభమైన భాషలో వివరాలు తెస్తోంది. దయచేసి వేచి ఉండండి.',
      stopSpeaking: 'మాట్లాడటం ఆపండి',
      listen: 'ఫలితం వినండి',
      useLabel: 'ఉపయోగం',
      dosageLabel: 'మోతాదు మరియు భద్రత',
      referencePhotos: 'ఔషధ ఫోటో ప్రివ్యూ',
      photosLoading: 'ఫోటోలు లోడ్ అవుతున్నాయి...',
      seeRealPhotos: 'నిజమైన ఫోటోలు చూడండి:',
      medicineNotIdentified: 'ఔషధం గుర్తించబడలేదు',
      notIdentifiedDescription: 'ఏఐ ఔషధాన్ని స్పష్టంగా గుర్తించలేకపోయింది. దయచేసి పేరు పూర్తిగా కనిపించే స్పష్టమైన, వెలుతురు ఉన్న ఫోటో ఇవ్వండి.',
      aiResponse: 'ఏఐ సమాధానం'
    },
    history: {
      title: 'ఇటీవలి స్కాన్లు',
      clear: 'చరిత్ర తొలగించండి'
    },
    footer: {
      disclaimer: 'గమనిక:',
      short: 'ఇది వైద్య సలహాకు ప్రత్యామ్నాయం కాదు.',
      long: 'MedDost ఇచ్చే సమాచారం విద్యా మరియు సాధారణ సమాచార ప్రయోజనాల కోసం మాత్రమే. ఈ టూల్ ఆధారంగా ఏ మందును ప్రారంభించడానికి, ఆపడానికి లేదా మార్చడానికి ముందు అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.'
    }
  },
  tamil: {
    header: {
      subtitle: 'ஏஐ மருந்து அடையாளம்',
      assistant: 'உங்கள் ஆரோக்கிய உதவியாளர்',
      languageLabel: 'இணையதள மொழி'
    },
    ocr: {
      title: 'மருந்தை அடையாளம் காண்க',
      description: 'மருந்தின் புகைப்படத்தை பதிவேற்றவும் அல்லது பெயரை சொல்லவும், பயன்பாட்டை உடனே அறியவும்.',
      uploadPhoto: 'புகைப்படம் பதிவேற்றம்',
      voiceType: 'குரல் / தட்டச்சு',
      analyzing: 'ஏஐ பகுப்பாய்வு செய்கிறது...',
      identifyWithAi: 'ஏஐ மூலம் அடையாளம் காண்க',
      listening: 'கேட்கிறது... இப்போது பேசுங்கள்!',
      tapMic: 'மைக் தட்டி மருந்துப் பெயரை சொல்லுங்கள்',
      inputPlaceholder: 'எ.கா. Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'மருந்தை தேடுங்கள்',
      unsupportedVoice: 'மன்னிக்கவும், உங்கள் உலாவி voice input ஐ ஆதரிக்கவில்லை. Chrome அல்லது Edge பயன்படுத்தவும்.',
      apiKeyMissing: '.env கோப்பில் Gemini API Key (GEMINI_API_KEY) சேர்த்து சர்வரை மீண்டும் தொடங்கவும்.',
      notFound: 'மருந்தை அடையாளம் காண முடியவில்லை. தெளிவான படம் அல்லது பெயருடன் மீண்டும் முயற்சிக்கவும்.',
      genericFailure: 'மருந்தை அடையாளம் காண முடியவில்லை.',
      imageFailure: 'ஏஐ மூலம் படம் செயலாக்க முடியவில்லை.',
      voiceFailure: 'ஏஐ மூலம் voice search செயலாக்க முடியவில்லை.'
    },
    upload: {
      drop: 'படத்தை இங்கே விடுங்கள்',
      click: 'படத்தை பதிவேற்ற கிளிக் அல்லது டிராக் செய்யுங்கள்',
      hint: 'மருந்து ஸ்டிரிப் அல்லது பாட்டில் லேபிளின் தெளிவான படத்தை பதிவேற்றவும். JPG, PNG ஆதரிக்கப்படும்.',
      selected: 'படம் தேர்ந்தெடுக்கப்பட்டது',
      remove: 'படத்தை நீக்கு'
    },
    result: {
      loadingTitle: 'ஏஐ பகுப்பாய்வு செய்கிறது...',
      loadingDescription: 'Gemini AI மருந்தை அடையாளம் கண்டு எளிய மொழியில் தகவலை பெறுகிறது. தயவுசெய்து காத்திருக்கவும்.',
      stopSpeaking: 'பேச்சை நிறுத்து',
      listen: 'முடிவை கேளுங்கள்',
      useLabel: 'பயன்பாடு',
      dosageLabel: 'அளவு மற்றும் பாதுகாப்பு',
      referencePhotos: 'மருந்து புகைப்பட முன்னோட்டம்',
      photosLoading: 'புகைப்படங்கள் ஏற்றப்படுகின்றன...',
      seeRealPhotos: 'உண்மையான புகைப்படங்களை காண்க:',
      medicineNotIdentified: 'மருந்து அடையாளம் காணப்படவில்லை',
      notIdentifiedDescription: 'ஏஐ மருந்தை தெளிவாக அடையாளம் காண முடியவில்லை. மருந்துப் பெயர் முழுவதும் தெரியும் தெளிவான, நல்ல வெளிச்சப் படத்தை கொடுக்கவும்.',
      aiResponse: 'ஏஐ பதில்'
    },
    history: {
      title: 'சமீபத்திய ஸ்கான்கள்',
      clear: 'வரலாற்றை அழி'
    },
    footer: {
      disclaimer: 'மறுப்பு:',
      short: 'இது மருத்துவ ஆலோசனைக்கு மாற்றாகாது.',
      long: 'MedDost வழங்கும் தகவல் கல்வி மற்றும் தகவல் நோக்கங்களுக்காக மட்டுமே. இந்த கருவியின் அடிப்படையில் எந்த மருந்தையும் தொடங்க, நிறுத்த அல்லது மாற்ற முன் தகுதியான மருத்துவரை அணுகவும்.'
    }
  },
  gujarati: {
    header: {
      subtitle: 'એઆઈ દવા ઓળખનાર',
      assistant: 'તમારો આરોગ્ય સહાયક',
      languageLabel: 'વેબસાઇટ ભાષા'
    },
    ocr: {
      title: 'દવા ઓળખો',
      description: 'દવાની ફોટો અપલોડ કરો અથવા નામ બોલો અને તેનો ઉપયોગ તરત જાણો.',
      uploadPhoto: 'ફોટો અપલોડ',
      voiceType: 'વૉઇસ / ટાઇપ',
      analyzing: 'એઆઈ વિશ્લેષણ કરી રહ્યું છે...',
      identifyWithAi: 'એઆઈથી ઓળખો',
      listening: 'સાંભળી રહ્યું છે... હવે બોલો!',
      tapMic: 'માઇક દબાવી દવાનું નામ બોલો',
      inputPlaceholder: 'દા.ત. Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'દવા શોધો',
      unsupportedVoice: 'માફ કરશો, તમારું બ્રાઉઝર voice input સપોર્ટ કરતું નથી. કૃપા કરીને Chrome અથવા Edge વાપરો.',
      apiKeyMissing: '.env ફાઇલમાં Gemini API Key (GEMINI_API_KEY) ઉમેરો અને સર્વર ફરી શરૂ કરો.',
      notFound: 'દવા ઓળખી શકાઈ નથી. સ્પષ્ટ ફોટો અથવા નામથી ફરી પ્રયત્ન કરો.',
      genericFailure: 'દવા ઓળખી શકાઈ નથી.',
      imageFailure: 'એઆઈથી ફોટો પ્રોસેસ થઈ શક્યો નથી.',
      voiceFailure: 'એઆઈથી voice search પ્રોસેસ થઈ શક્યું નથી.'
    },
    upload: {
      drop: 'ફોટો અહીં છોડો',
      click: 'ફોટો અપલોડ કરવા ક્લિક અથવા ડ્રેગ કરો',
      hint: 'દવાની સ્ટ્રિપ અથવા બોટલ લેબલની સ્પષ્ટ ફોટો અપલોડ કરો. JPG, PNG સપોર્ટ છે.',
      selected: 'ફોટો પસંદ થયો',
      remove: 'ફોટો દૂર કરો'
    },
    result: {
      loadingTitle: 'એઆઈ વિશ્લેષણ કરી રહ્યું છે...',
      loadingDescription: 'Gemini AI દવા ઓળખી સરળ ભાષામાં માહિતી લાવી રહ્યું છે. કૃપા કરીને રાહ જુઓ.',
      stopSpeaking: 'બોલવું બંધ કરો',
      listen: 'પરિણામ સાંભળો',
      useLabel: 'ઉપયોગ',
      dosageLabel: 'ડોઝ અને સુરક્ષા',
      referencePhotos: 'દવા ફોટો પ્રિવ્યુ',
      photosLoading: 'ફોટા લોડ થઈ રહ્યા છે...',
      seeRealPhotos: 'ખરા ફોટા જુઓ:',
      medicineNotIdentified: 'દવા ઓળખાઈ નથી',
      notIdentifiedDescription: 'એઆઈ દવાને સ્પષ્ટ રીતે ઓળખી શક્યું નથી. કૃપા કરીને દવાનું નામ સંપૂર્ણ દેખાય એવો સ્પષ્ટ અને પ્રકાશવાળો ફોટો આપો.',
      aiResponse: 'એઆઈ જવાબ'
    },
    history: {
      title: 'તાજેતરના સ્કૅન',
      clear: 'ઇતિહાસ સાફ કરો'
    },
    footer: {
      disclaimer: 'ડિસ્ક્લેમર:',
      short: 'આ વ્યાવસાયિક તબીબી સલાહનો વિકલ્પ નથી.',
      long: 'MedDost દ્વારા આપવામાં આવેલી માહિતી માત્ર શિક્ષણ અને સામાન્ય માહિતી માટે છે. આ ટૂલના આધારે કોઈ દવા શરૂ, બંધ અથવા બદલતા પહેલા યોગ્ય ડૉક્ટરની સલાહ લો.'
    }
  },
  urdu: {
    header: {
      subtitle: 'اے آئی دوا شناخت کنندہ',
      assistant: 'آپ کا صحت معاون',
      languageLabel: 'ویب سائٹ زبان'
    },
    ocr: {
      title: 'دوا پہچانیں',
      description: 'دوا کی تصویر اپ لوڈ کریں یا نام بولیں اور استعمال فوراً جانیں۔',
      uploadPhoto: 'تصویر اپ لوڈ',
      voiceType: 'آواز / ٹائپ',
      analyzing: 'اے آئی تجزیہ کر رہا ہے...',
      identifyWithAi: 'اے آئی سے پہچانیں',
      listening: 'سن رہا ہے... اب بولیں!',
      tapMic: 'مائک دبائیں اور دوا کا نام بولیں',
      inputPlaceholder: 'مثلاً Paracetamol, Crocin, Cetirizine...',
      searchLabel: 'دوا تلاش کریں',
      unsupportedVoice: 'معذرت، آپ کا براؤزر voice input کو سپورٹ نہیں کرتا۔ براہ کرم Chrome یا Edge استعمال کریں۔',
      apiKeyMissing: '.env فائل میں Gemini API Key (GEMINI_API_KEY) شامل کریں اور سرور دوبارہ شروع کریں۔',
      notFound: 'دوا پہچانی نہیں جا سکی۔ صاف تصویر یا نام کے ساتھ دوبارہ کوشش کریں۔',
      genericFailure: 'دوا پہچانی نہیں جا سکی۔',
      imageFailure: 'اے آئی سے تصویر پروسیس نہیں ہو سکی۔',
      voiceFailure: 'اے آئی سے voice search پروسیس نہیں ہو سکی۔'
    },
    upload: {
      drop: 'تصویر یہاں چھوڑیں',
      click: 'تصویر اپ لوڈ کرنے کے لیے کلک یا ڈریگ کریں',
      hint: 'دوا کی اسٹرپ یا بوتل لیبل کی صاف تصویر اپ لوڈ کریں۔ JPG، PNG سپورٹ ہے۔',
      selected: 'تصویر منتخب ہو گئی',
      remove: 'تصویر ہٹائیں'
    },
    result: {
      loadingTitle: 'اے آئی تجزیہ کر رہا ہے...',
      loadingDescription: 'براہ کرم انتظار کریں، Gemini AI دوا پہچان کر آسان زبان میں معلومات لا رہا ہے۔',
      stopSpeaking: 'بولنا روکیں',
      listen: 'نتیجہ سنیں',
      useLabel: 'استعمال',
      dosageLabel: 'خوراک اور حفاظت',
      referencePhotos: 'دوا تصویر پیش منظر',
      photosLoading: 'تصاویر لوڈ ہو رہی ہیں...',
      seeRealPhotos: 'حقیقی تصاویر دیکھیں:',
      medicineNotIdentified: 'دوا پہچانی نہیں گئی',
      notIdentifiedDescription: 'اے آئی دوا کو صاف طور پر نہیں پہچان سکا۔ براہ کرم ایسی صاف اور روشن تصویر دیں جس میں دوا کا نام مکمل نظر آئے۔',
      aiResponse: 'اے آئی جواب'
    },
    history: {
      title: 'حالیہ اسکین',
      clear: 'تاریخ صاف کریں'
    },
    footer: {
      disclaimer: 'دستبرداری:',
      short: 'یہ ڈاکٹر کے مشورے کا متبادل نہیں ہے۔',
      long: 'MedDost کی معلومات صرف تعلیمی اور معلوماتی مقاصد کے لیے ہیں۔ اس ٹول کی بنیاد پر کوئی دوا شروع، بند یا تبدیل کرنے سے پہلے مستند ڈاکٹر سے مشورہ کریں۔'
    }
  }
};

export const getUiText = (language) => UI_TEXT[language] || UI_TEXT[DEFAULT_LANGUAGE];

