import React, { useState, useEffect, useRef } from 'react';
import { Music, Mic2, Sparkles, Copy, ExternalLink, RefreshCw, Heart, Share2, PlayCircle, Youtube, Video, Wand2, BookOpen, X, ChevronDown, CheckCircle2, Zap, Globe2, User, Smile, Radio, Disc, Layers, Clock, Lightbulb } from 'lucide-react';

const VibeFlow = () => {
  // --- STATE MANAGEMENT ---
  const [topic, setTopic] = useState('');
  const [inspiration, setInspiration] = useState('');
  
  // 5-Point Production Config
  const [language, setLanguage] = useState('Indonesia');
  const [vocalType, setVocalType] = useState('Auto Detect');
  const [mood, setMood] = useState('Auto Detect');
  const [genre, setGenre] = useState('Pop');
  const [musicStyle, setMusicStyle] = useState('Original');
  
  // Output State
  const [songTitle, setSongTitle] = useState('');
  const [stylePrompt, setStylePrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('3:00 - 4:00');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Cooking...');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null); 
  const [showGuide, setShowGuide] = useState(false);
  const [autoVibeTriggered, setAutoVibeTriggered] = useState(false);

  // --- DATA LISTS ---
  const quickTopics = ["Jatuh cinta diam-diam", "Healing ke pantai", "Motivasi kerja keras", "Kangen mantan", "Suasana hujan sore"];
  
  const languages = ['Indonesia', 'English', 'Jawa', 'Sunda', 'Sasak', 'Minang', 'Batak', 'Bali', 'Melayu', 'Madura', 'Korea', 'Jepang', 'Mandarin', 'Campuran (Indo-Eng)', 'Campuran (Indo-Jawa)'];
  
  const vocalTypes = ['Auto Detect', 'Pria (Male)', 'Wanita (Female)', 'Duet (Male & Female)', 'Grup / Choir', 'Robot / AI', 'Anak-anak (Kids)'];
  
  const moods = ['Auto Detect', 'Ceria (Happy)', 'Sedih (Sad)', 'Romantis (Romantic)', 'Semangat (Energetic)', 'Marah (Angry)', 'Santai (Chill)', 'Misterius (Dark)', 'Galau (Melancholy)', 'Lucu (Comedy)'];
  
  const genres = ['Pop', 'Dangdut', 'Melayu', 'Reggae', 'Rock', 'Jazz', 'R&B', 'Hip Hop', 'Indie', 'Metal', 'Religi', 'Campursari', 'EDM', 'Orchestra'];
  
  const musicStyles = ['Original', 'EDM / Club', 'Koplo', 'Jedag Jedug (JJ)', 'Lofi', 'Slowed + Reverb', 'Akustik', 'Remix', 'Orchestra', 'Cinematic', 'Funkot', 'Synthwave', 'Future Bass', 'Slap House', 'Trap', 'Punk'];

  const guideSteps = [
    { title: "1. Konsep & Bahasa", items: ["Pilih bahasa yang pas dengan target pendengar.", "Tentukan tema dasar."] },
    { title: "2. Karakter Vokal", items: ["Sesuaikan jenis vokal dengan emosi lagu (misal: Sedih = Wanita Soft)."] },
    { title: "3. Mood & Atmosfer", items: ["Tentukan 'rasa' lagu. Apakah ingin membuat orang joget atau menangis?"] },
    { title: "4. Genre & Style", items: ["Genre adalah akarnya (misal: Dangdut).", "Style adalah kemasannya (misal: Koplo/Jedag Jedug)."] }
  ];

  const viralTemplates = [
    {
      title: "🔥 EDM Barat Viral (Future Bass / Slap House)",
      desc: "Struktur standar untuk lagu Future Bass, Slap House, atau EDM Pop yang catchy.",
      structure: [
        { section: "1. Intro (4–16 bar)", detail: "Suasana awal: pad, vocal chop, pluck ringan. Drum minimal." },
        { section: "2. Verse 1 (8–16 bar)", detail: "Vokal utama masuk. Melodi ringan, beat sederhana." },
        { section: "3. Pre-Chorus (4–8 bar)", detail: "Musik naik perlahan (build-up). Tambah snare roll, riser." },
        { section: "4. DROP 1 (8–16 bar)", detail: "★ BAGIAN PALING VIRAL. Melodi utama, Bass kuat, Energi maksimal." },
        { section: "5. Verse 2 (8–16 bar)", detail: "Energi turun lagi. Vokal masuk. Variasi dari Verse 1." },
        { section: "6. DROP 2 (8–16 bar)", detail: "Drop utama kembali. Variasi lebih ramai." },
        { section: "7. Outro (4–16 bar)", detail: "Energi menurun. Transisi halus." }
      ],
      promptTip: "Keywords: Lead catchy, bass kuat, build-up snare roll, hook viral."
    }
  ];

  // --- LOGIC FUNCTIONS ---

  const getTargetDuration = (g, s, l, v) => {
    if (v === 'Anak-anak (Kids)') return "1:30 – 2:30 menit";
    if (g === 'Orchestra' || s === 'Cinematic' || s === 'Orchestra') return "5:00 – 8:00 menit";
    if (s === 'Jedag Jedug (JJ)' || s === 'Funkot' || (g === 'EDM' && s === 'Remix')) return "1:20 – 2:20 menit";
    if (g === 'Metal') return "4:30 – 7:00 menit";
    if (g === 'Dangdut' || g === 'Campursari' || s === 'Koplo') return "4:00 – 5:30 menit";
    if (g === 'Rock' || s === 'Punk') return "3:30 – 5:00 menit";
    if (g === 'Pop' && (l === 'Indonesia' || l === 'Jawa' || l === 'Melayu')) return "3:30 – 4:30 menit";
    if (g === 'Pop' && l !== 'Indonesia') return "2:45 – 3:30 menit";
    if (g === 'Hip Hop' || g === 'R&B' || s === 'Trap') return "2:20 – 3:30 menit";
    if (g === 'EDM' || s === 'Future Bass' || s === 'Slap House') return "2:30 – 3:30 menit";
    if (g === 'Indie' || s === 'Akustik') return "2:45 – 4:00 menit";
    return "3:00 – 4:00 menit";
  };

  useEffect(() => {
    const duration = getTargetDuration(genre, musicStyle, language, vocalType);
    setEstimatedDuration(duration);
  }, [genre, musicStyle, language, vocalType]);

  const suggestVibe = async (currentTopic, currentInspiration) => {
    if (!currentTopic || currentTopic.length < 3) return;
    
    setIsSuggesting(true);
    setAutoVibeTriggered(false); 

    try {
      const apiKey = ""; // SYSTEM NOTE: Will use Environment Variable in Production
      const prompt = `
        Based strictly on the song topic: "${currentTopic}" and inspiration: "${currentInspiration}", select the best single option for each category.
        
        Languages: ${languages.join(', ')}
        Vocals: ${vocalTypes.filter(v => v !== 'Auto Detect').join(', ')}
        Moods: ${moods.filter(m => m !== 'Auto Detect').join(', ')}
        Genres: ${genres.join(', ')}
        Styles: ${musicStyles.join(', ')}
        
        Prioritize cultural context. Return ONLY a JSON object with keys: "language", "vocalType", "mood", "genre", "musicStyle".
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const result = JSON.parse(text);
        if (languages.includes(result.language)) setLanguage(result.language);
        if (vocalTypes.includes(result.vocalType)) setVocalType(result.vocalType);
        if (moods.includes(result.mood)) setMood(result.mood);
        if (genres.includes(result.genre)) setGenre(result.genre);
        if (musicStyles.includes(result.musicStyle)) setMusicStyle(result.musicStyle);
        
        setAutoVibeTriggered(true);
        setTimeout(() => setAutoVibeTriggered(false), 3000);
      }
    } catch (error) {
      console.error("Error suggesting vibe:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (topic.length < 3) return;
    const delayDebounceFn = setTimeout(() => {
      suggestVibe(topic, inspiration);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [topic, inspiration]); 

  const generateLyrics = async () => {
    if (!topic) return;

    setLoading(true);
    setLoadingText('Meracik Konsep...');
    setLyrics('');
    setStylePrompt('');
    setSongTitle('');
    setCopiedSection(null);

    const loadingMessages = ['Menulis Lirik...', 'Menyusun Melodi...', 'Mengatur Bass...', 'Finishing Touch...'];
    let msgIdx = 0;
    const interval = setInterval(() => {
        setLoadingText(loadingMessages[msgIdx]);
        msgIdx = (msgIdx + 1) % loadingMessages.length;
    }, 1500);

    try {
      const apiKey = ""; // SYSTEM NOTE: Will use Environment Variable in Production
      const systemPrompt = "Kamu adalah produser musik senior dan penulis lirik hits.";
      
      const selectedVocal = vocalType === 'Auto Detect' ? 'Sesuaikan dengan vibe lagu' : vocalType;
      const selectedMood = mood === 'Auto Detect' ? 'Sesuaikan dengan topik' : mood;
      const targetDuration = getTargetDuration(genre, musicStyle, language, vocalType);

      const userPrompt = `Buatkan lirik lagu lengkap tentang: "${topic}".
      
      KONFIGURASI PRODUKSI:
      1. Bahasa: ${language}
      2. Vocal: ${selectedVocal}
      3. Mood: ${selectedMood}
      4. Genre: ${genre}
      5. Style: ${musicStyle}
      6. Inspirasi: ${inspiration || 'Original'}
      7. TARGET DURASI: ${targetDuration}
      
      OUTPUT JSON:
      {
        "title": "Judul Lagu",
        "stylePrompt": "Prompt teknis bahasa Inggris untuk Suno/Producer.ai. Gabungan Genre '${genre}', Style '${musicStyle}', Mood '${selectedMood}', Vocal '${selectedVocal}'. Tambahkan durasi instruksi.",
        "lyrics": "Lirik lengkap (Intro, Verse, Chorus, dst) tanpa chord."
      }
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const result = JSON.parse(text);
        setSongTitle(result.title);
        setStylePrompt(result.stylePrompt);
        setLyrics(result.lyrics);
      }

    } catch (error) {
      console.error("Error:", error);
      setLyrics("Gagal meracik lagu. Pastikan API Key terisi atau coba lagi!");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const copyToClipboard = (text, section) => {
    if (!text) return;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const openSuno = () => {
    window.open('https://suno.com/create', '_blank');
  };
  
  const setTrendingTopic = () => {
    const trends = ["Cinta beda agama", "Perantau rindu ibu", "Healing ke Bajo", "Cicilan numpuk", "Hujan di Malioboro"];
    setTopic(trends[Math.floor(Math.random() * trends.length)]);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full blur-[128px] opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="text-center mb-10 relative">
           <div className="md:absolute md:right-0 md:top-2 flex justify-center md:justify-end mb-4 md:mb-0">
            <button 
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 text-sm font-bold text-slate-300 transition-all hover:scale-105 shadow-lg group"
            >
              <BookOpen className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
              Panduan
            </button>
          </div>

          <div className="inline-flex items-center justify-center p-2 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-800 mb-4 px-4">
            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-xs font-bold text-slate-300 tracking-wider">V.5.1 USER FRIENDLY</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 text-transparent bg-clip-text drop-shadow-sm pb-2">
            V.I.R.A.L.
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-slate-700"></div>
            <p className="text-[10px] md:text-xs font-mono text-purple-300 tracking-[0.2em] uppercase">
              Virtual Intelligent Rhythm & Audio Lab
            </p>
            <div className="h-[1px] w-8 bg-slate-700"></div>
          </div>
        </header>

        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Input Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl h-full flex flex-col relative">
              
              {/* Indicators */}
              {isSuggesting && (
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 px-3 py-1.5 rounded-full animate-in fade-in">
                      <Zap className="w-3 h-3 text-purple-400 animate-pulse fill-purple-400" />
                      <span className="text-[10px] font-bold text-purple-200">Detecting...</span>
                  </div>
              )}
              {autoVibeTriggered && !isSuggesting && (
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 px-3 py-1.5 rounded-full animate-in fade-in zoom-in">
                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] font-bold text-green-200">Auto-Set!</span>
                  </div>
              )}

              <div className="space-y-6 flex-1">
                
                {/* 1. IDE UTAMA */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-700 pb-2">
                        1. Ide & Inspirasi
                    </h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400">Tentang apa lagunya?</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Ketik topik disini..."
                        className={`w-full bg-slate-800/80 border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${isSuggesting ? 'border-purple-500/50' : 'border-slate-700'}`}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {quickTopics.map((qt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setTopic(qt)}
                                className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/50 px-3 py-1.5 rounded-full text-slate-300 transition-all"
                            >
                                {qt}
                            </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-slate-400">Inspirasi Musik (Opsional)</label>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                           Link / Nama Artis
                        </span>
                      </div>
                      <input
                        type="text"
                        value={inspiration}
                        onChange={(e) => setInspiration(e.target.value)}
                        placeholder="Contoh: 'Tulus', 'Denny Caknan'..."
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      />
                    </div>
                </div>

                {/* 2. STUDIO CONFIG */}
                <div className="space-y-3">
                   <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide border-b border-slate-700 pb-2 flex justify-between items-center">
                        <span>2. Studio Produksi</span>
                        <span className="text-[10px] text-slate-500 font-normal normal-case bg-slate-800 px-2 rounded-full">Auto-Detect Aktif</span>
                   </h3>
                   
                   <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl space-y-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                             <Globe2 className="w-3 h-3 text-blue-400" /> Bahasa
                          </label>
                          <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                                 <User className="w-3 h-3 text-pink-400" /> Vocal
                              </label>
                              <select 
                                value={vocalType} 
                                onChange={(e) => setVocalType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {vocalTypes.map(v => <option key={v} value={v}>{v}</option>)}
                              </select>
                           </div>

                           <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                                 <Smile className="w-3 h-3 text-yellow-400" /> Mood
                              </label>
                              <select 
                                value={mood} 
                                onChange={(e) => setMood(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {moods.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                                 <Radio className="w-3 h-3 text-green-400" /> Genre
                              </label>
                              <select 
                                value={genre} 
                                onChange={(e) => setGenre(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {genres.map(g => <option key={g} value={g}>{g}</option>)}
                              </select>
                           </div>

                           <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1.5">
                                 <Disc className="w-3 h-3 text-purple-400" /> Style
                              </label>
                              <select 
                                value={musicStyle} 
                                onChange={(e) => setMusicStyle(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                {musicStyles.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                           </div>
                       </div>
                   </div>

                   {/* Duration Info */}
                   <div className="flex items-center gap-2 px-2 pt-1 opacity-70">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] text-slate-400">Estimasi Durasi: <span className="text-white font-bold">{estimatedDuration}</span></span>
                   </div>

                </div>

                <div className="pt-2">
                  <button
                    onClick={generateLyrics}
                    disabled={loading || !topic}
                    className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 ${
                      loading || !topic
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white hover:shadow-purple-500/25 border border-purple-400/30'
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        {loadingText}
                      </>
                    ) : (
                      <>
                        <Music className="w-5 h-5" />
                        Buat Lagu Sekarang
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="md:col-span-7">
            <div className="h-[800px] md:h-full bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
              
              {!lyrics ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 space-y-6 py-12 opacity-60">
                   <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                     <Lightbulb className="w-8 h-8 text-slate-500" />
                   </div>
                   <div className="text-center max-w-xs space-y-2">
                     <p className="text-lg font-bold text-slate-500">Mulai Berkarya</p>
                     <p className="text-sm">Isi topik di sebelah kiri, biarkan AI mengatur komposisinya, dan lihat hasilnya disini.</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                     
                     {/* 1. Lyrics Section */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-end bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                <Mic2 className="w-4 h-4 text-purple-500" />
                                Lirik Lagu
                            </label>
                            <button 
                                onClick={() => copyToClipboard(lyrics, 'lyrics')}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                                    copiedSection === 'lyrics' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/40'
                                }`}
                            >
                                {copiedSection === 'lyrics' ? "Disalin!" : "Salin Lirik"}
                            </button>
                        </div>
                        <div className="bg-slate-950/30 p-6 rounded-xl border border-slate-800 min-h-[200px]">
                           <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300 select-all">
                             {lyrics}
                           </pre>
                        </div>
                     </div>

                     {/* 2. Style Prompt Section */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-end bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Prompt (untuk Suno)
                            </label>
                            <button 
                                onClick={() => copyToClipboard(stylePrompt, 'prompt')}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                                    copiedSection === 'prompt' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/40'
                                }`}
                            >
                                {copiedSection === 'prompt' ? "Disalin!" : "Salin Prompt"}
                            </button>
                        </div>
                        <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 group hover:border-yellow-500/30 transition-colors">
                            <p className="text-sm text-slate-400 font-mono leading-relaxed select-all">
                                {stylePrompt}
                            </p>
                        </div>
                     </div>

                     {/* 3. Title Section */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded-lg border border-slate-800">
                            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                <Music className="w-4 h-4 text-pink-500" />
                                Judul Lagu
                            </label>
                            <button 
                                onClick={() => copyToClipboard(songTitle, 'title')}
                                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                                    copiedSection === 'title' 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-pink-600/20 text-pink-300 hover:bg-pink-600/40'
                                }`}
                            >
                                {copiedSection === 'title' ? "Disalin!" : "Salin Judul"}
                            </button>
                        </div>
                        <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800 text-center">
                            <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 leading-tight">
                                {songTitle}
                            </h3>
                        </div>
                     </div>

                  </div>

                  {/* Action Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-900/50 -mx-6 -mb-6 p-4 shrink-0">
                     <button 
                      onClick={openSuno}
                      className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-slate-200 py-3 rounded-xl transition-all font-bold text-sm shadow-lg hover:shadow-white/10"
                     >
                       <span>Buka Suno.ai & Paste</span>
                       <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Guide */}
        {showGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setShowGuide(false)}
            ></div>
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Panduan & Templates</h2>
                    <p className="text-xs text-slate-400">Cheat Sheet & Song Structure</p>
                  </div>
                </div>
                <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                {/* Basic Guide */}
                <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Basic Steps
                    </h3>
                    {guideSteps.map((step, index) => (
                    <div key={index} className="group">
                        <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors mt-0.5 shadow-sm">
                            {index + 1}
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-slate-200">{step.title.split('. ')[1]}</h3>
                            <ul className="space-y-1.5">
                            {step.items.map((item, i) => (
                                <li key={i} className="text-sm text-slate-400 flex items-start gap-2 leading-relaxed">
                                <span className="w-1 h-1 bg-slate-600 rounded-full mt-2 shrink-0"></span>
                                {item}
                                </li>
                            ))}
                            </ul>
                        </div>
                        </div>
                        {index < guideSteps.length - 1 && <div className="ml-4 pl-4 border-l border-slate-800 h-6 my-1"></div>}
                    </div>
                    ))}
                </div>

                {/* Viral Templates Section */}
                <div className="space-y-6 pt-6 border-t border-slate-800">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" /> Viral Templates
                    </h3>
                    
                    {viralTemplates.map((template, idx) => (
                        <div key={idx} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    {template.title}
                                </h4>
                                <p className="text-sm text-slate-400 mt-1">{template.desc}</p>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                                {template.structure.map((struct, sIdx) => (
                                    <div key={sIdx} className="grid grid-cols-12 gap-4 text-sm border-l-2 border-slate-700 pl-3 hover:border-purple-500 transition-colors">
                                        <div className="col-span-4 font-bold text-purple-300">{struct.section}</div>
                                        <div className="col-span-8 text-slate-400">{struct.detail}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
                                <p className="text-xs text-slate-500 font-mono">
                                    <span className="text-yellow-500 font-bold">PROMPT TIP:</span> {template.promptTip}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-slate-600 text-sm pb-8">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by VibeFlow AI v5.1
          </p>
        </footer>

      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default VibeFlow;