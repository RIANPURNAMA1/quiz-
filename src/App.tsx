import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader, User, Phone, MapPin } from 'lucide-react';

interface UserInfo {
  name: string;
  whatsapp: string;
  province: string;
  city: string;
}

interface Answers {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
}

interface Option {
  value: number;
  label: string;
}

interface Question {
  id: keyof Answers;
  question: string;
  options: Option[];
}

interface FormData {
  timestamp: string;
  name: string;
  whatsapp: string;
  province: string;
  city: string;
  q1_budget: number;
  q1_label: string;
  q2_waktu: number;
  q2_label: string;
  q3_skill: number;
  q3_label: string;
  q4_bahasa: number;
  q4_label: string;
  q5_target: number;
  q5_label: string;
  q6_mental: number;
  q6_label: string;
  rekomendasi_sistem: string;
  jalur_cadangan: string;
  total_skor: number;
}

interface Province {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

const KuisJalurKorea: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    whatsapp: '',
    province: '',
    city: ''
  });
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(true);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  
  const [answers, setAnswers] = useState<Answers>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0
  });
  
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (userInfo.province) {
      fetchCities(userInfo.province);
    } else {
      setCities([]);
      setUserInfo(prev => ({ ...prev, city: '' }));
    }
  }, [userInfo.province]);

  const fetchProvinces = async (): Promise<void> => {
    try {
      setLoadingProvinces(true);
      const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      alert('Gagal memuat data provinsi. Silakan refresh halaman.');
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchCities = async (provinceId: string): Promise<void> => {
    try {
      setLoadingCities(true);
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      alert('Gagal memuat data kota/kabupaten.');
    } finally {
      setLoadingCities(false);
    }
  };

  const questions: Question[] = [
    {
      id: 'q1',
      question: 'Budget awal kamu untuk persiapan karier di Korea?',
      options: [
        { value: 1, label: 'minim banget (serba mepet)' },
        { value: 2, label: 'ada, tapi tipis' },
        { value: 3, label: 'cukup buat persiapan bertahap' },
        { value: 4, label: 'cukup aman' },
        { value: 5, label: 'siap dana lebih besar' }
      ]
    },
    {
      id: 'q2',
      question: 'Kamu butuh cepat atau siap proses yang lebih panjang?',
      options: [
        { value: 1, label: 'harus cepat banget' },
        { value: 2, label: 'pengin cepat' },
        { value: 3, label: 'medium' },
        { value: 4, label: 'siap agak panjang' },
        { value: 5, label: 'siap panjang (yang penting jelas)' }
      ]
    },
    {
      id: 'q3',
      question: 'Skill kamu saat ini gimana?',
      options: [
        { value: 1, label: 'belum ada skill khusus' },
        { value: 2, label: 'ada sedikit, tapi belum rapi' },
        { value: 3, label: 'ada skill, tapi belum punya bukti/portofolio' },
        { value: 4, label: 'skill ada + mulai ada bukti' },
        { value: 5, label: 'skill kuat + portofolio jelas' }
      ]
    },
    {
      id: 'q4',
      question: 'Kesiapan kamu belajar bahasa Korea?',
      options: [
        { value: 1, label: 'susah konsisten' },
        { value: 2, label: 'semangatnya naik turun' },
        { value: 3, label: 'bisa kalau ada panduan' },
        { value: 4, label: 'cukup disiplin' },
        { value: 5, label: 'siap gas serius dan konsisten' }
      ]
    },
    {
      id: 'q5',
      question: 'Target kamu di Korea lebih ke arah mana?',
      options: [
        { value: 1, label: 'kerja jangka pendek dulu' },
        { value: 2, label: 'kerja dulu yang penting jalan' },
        { value: 3, label: 'masih bingung' },
        { value: 4, label: 'karier jangka menengah' },
        { value: 5, label: 'karier jangka panjang' }
      ]
    },
    {
      id: 'q6',
      question: 'Mental adaptasi kamu gimana? (lingkungan baru, budaya baru, tekanan baru)',
      options: [
        { value: 1, label: 'gampang down' },
        { value: 2, label: 'butuh waktu lama untuk adaptasi' },
        { value: 3, label: 'adaptasi pelan-pelan bisa' },
        { value: 4, label: 'cukup kuat' },
        { value: 5, label: 'siap mental dan siap belajar' }
      ]
    }
  ];

  const handleUserInfoChange = (field: keyof UserInfo, value: string): void => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartQuiz = (): void => {
    if (!userInfo.name.trim()) {
      alert('Mohon isi nama kamu terlebih dahulu!');
      return;
    }
    if (!userInfo.whatsapp.trim()) {
      alert('Mohon isi nomor WhatsApp kamu terlebih dahulu!');
      return;
    }
    if (!userInfo.province) {
      alert('Mohon pilih provinsi kamu terlebih dahulu!');
      return;
    }
    if (!userInfo.city) {
      alert('Mohon pilih kota/kabupaten kamu terlebih dahulu!');
      return;
    }
    
    // Validasi nomor WhatsApp (hanya angka, minimal 10 digit)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(userInfo.whatsapp.replace(/\D/g, ''))) {
      alert('Format nomor WhatsApp tidak valid! (10-15 digit)');
      return;
    }
    
    setShowQuestions(true);
  };

  const handleAnswerChange = (questionId: keyof Answers, value: number): void => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateResult = (): { primary: string; backup: string } => {
    const { q1, q2, q3, q4, q5, q6 } = answers;
    
    let primary = '';
    let backup = '';
    
    // Hitung total skor
    const totalScore = q1 + q2 + q3 + q4 + q5 + q6;
    
    // Jalur Studi/Kuliah
    if (q2 >= 4 && q5 >= 4 && q6 >= 4) {
      primary = 'Jalur Studi/Kuliah';
      backup = q4 >= 3 ? 'Jalur Kursus Bahasa' : 'EPS (G-to-G)';
    }
    // Jalur Kursus Bahasa
    else if (q4 >= 4 && q2 >= 3) {
      primary = 'Jalur Kuliah Bahasa';
      backup = q5 >= 4 ? 'Jalur Studi/Kuliah' : 'EPS (G-to-G)';
    }
    // Jalur Skilled / Direct Hire
    else if (q3 >= 4) {
      primary = 'Jalur Skilled / Direct Hire';
      backup = q4 >= 3 ? 'Jalur Kursus Bahasa' : 'EPS (G-to-G)';
    }
    // Jalur Musiman
    else if (q2 <= 2 && q5 <= 2) {
      primary = 'Jalur Musiman';
      backup = totalScore >= 15 ? 'EPS (G-to-G)' : 'Jalur Kuliah Bahasa';
    }
    // EPS (G-to-G)
    else {
      primary = 'EPS (G-to-G)';
      if (q4 >= 3) {
        backup = 'Jalur Kuliah Bahasa';
      } else if (q3 >= 3) {
        backup = 'Jalur Skilled / Direct Hire';
      } else {
        backup = 'Jalur Musiman';
      }
    }
    
    return { primary, backup };
  };

  const getQuestionLabel = (qId: keyof Answers, value: number): string => {
    const question = questions.find(q => q.id === qId);
    const option = question?.options.find(opt => opt.value === value);
    return option?.label || '';
  };

  const handleSubmitQuiz = async (): Promise<void> => {
    const allAnswered = Object.values(answers).every(val => val > 0);
    
    if (!allAnswered) {
      alert('Mohon jawab semua pertanyaan terlebih dahulu!');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const recommendation = calculateResult();
      
      // Data yang akan dikirim ke Google Sheets
      const formData: FormData = {
        timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        name: userInfo.name,
        whatsapp: userInfo.whatsapp,
        province: provinces.find(p => p.id === userInfo.province)?.name || userInfo.province,
        city: cities.find(c => c.id === userInfo.city)?.name || userInfo.city,
        q1_budget: answers.q1,
        q1_label: getQuestionLabel('q1', answers.q1),
        q2_waktu: answers.q2,
        q2_label: getQuestionLabel('q2', answers.q2),
        q3_skill: answers.q3,
        q3_label: getQuestionLabel('q3', answers.q3),
        q4_bahasa: answers.q4,
        q4_label: getQuestionLabel('q4', answers.q4),
        q5_target: answers.q5,
        q5_label: getQuestionLabel('q5', answers.q5),
        q6_mental: answers.q6,
        q6_label: getQuestionLabel('q6', answers.q6),
        rekomendasi_sistem: recommendation.primary,
        jalur_cadangan: recommendation.backup,
        total_skor: answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6
      };

      // Kirim ke Google Sheets melalui Google Apps Script Web App
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxEXcbhDq-GNB9lCC90XoJp9GU2hSTl_DWyd2_j2DniVEearsLMa9bi0QERLb46D5LKQ/exec';
      
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      setSubmitSuccess(true);
      setShowResult(true);
      
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      // Tetap tampilkan hasil meskipun gagal kirim
      setShowResult(true);
      alert('Data quiz berhasil diselesaikan! (Note: Koneksi ke Google Sheets mungkin belum tersambung)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = (): void => {
    setUserInfo({ name: '', whatsapp: '', province: '', city: '' });
    setAnswers({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 });
    setShowQuestions(false);
    setShowResult(false);
    setSubmitSuccess(false);
    setCities([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalAnswered = Object.values(answers).filter(val => val > 0).length;
  const progressPercentage = (totalAnswered / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Kuis Penentuan Jalur Karier Korea
          </h1>

          <p className="text-gray-600 text-center">
            Kerjakan kuis ini untuk mengetahui jalur karier yang paling cocok untuk kamu.
            <br />
            Waktu: ~5 Menit
          </p>

          {!showQuestions && !showResult && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Petunjuk Skor:</strong><br />
                1 = sangat tidak siap / sangat minim<br />
                3 = sedang / cukup tapi perlu dibangun<br />
                5 = sangat siap / sudah kuat
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {showQuestions && !showResult && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Progress: {totalAnswered}/{questions.length}
                </span>
                <span className="text-sm font-semibold text-indigo-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* User Info Form */}
        {!showQuestions && !showResult && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Mulai dengan Data Diri Kamu
            </h2>
            
            <div className="space-y-6">
              {/* Nama */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline mr-2" size={18} />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => handleUserInfoChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="Masukkan nama lengkap kamu"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline mr-2" size={18} />
                  Nomor WhatsApp
                </label>
                <input
                  type="tel"
                  value={userInfo.whatsapp}
                  onChange={(e) => handleUserInfoChange('whatsapp', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Provinsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline mr-2" size={18} />
                  Provinsi
                </label>
                <select
                  value={userInfo.province}
                  onChange={(e) => handleUserInfoChange('province', e.target.value)}
                  disabled={loadingProvinces}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="">
                    {loadingProvinces ? 'Memuat provinsi...' : 'Pilih Provinsi'}
                  </option>
                  {provinces.map(province => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kota/Kabupaten */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline mr-2" size={18} />
                  Kota/Kabupaten
                </label>
                <select
                  value={userInfo.city}
                  onChange={(e) => handleUserInfoChange('city', e.target.value)}
                  disabled={!userInfo.province || loadingCities}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                >
                  <option value="">
                    {!userInfo.province 
                      ? 'Pilih provinsi terlebih dahulu' 
                      : loadingCities 
                      ? 'Memuat kota/kabupaten...' 
                      : 'Pilih Kota/Kabupaten'}
                  </option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleStartQuiz}
                className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Mulai Quiz
              </button>

              <p className="text-xs text-gray-500 text-center">
                Data kamu akan disimpan dengan aman untuk keperluan analisis hasil quiz
              </p>
            </div>
          </div>
        )}

        {/* Questions */}
        {showQuestions && !showResult && (
          <div className="space-y-6">
            {/* User Info Display */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">
                <strong>Peserta:</strong> {userInfo.name} | WA: {userInfo.whatsapp} | {provinces.find(p => p.id === userInfo.province)?.name}, {cities.find(c => c.id === userInfo.city)?.name}
              </p>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    answers[q.id] > 0 ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {answers[q.id] > 0 ? '✓' : idx + 1}
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-800">
                    {q.question}
                  </h3>
                </div>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        answers[q.id] === option.value
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={option.value}
                        checked={answers[q.id] === option.value}
                        onChange={() => handleAnswerChange(q.id, option.value)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="ml-3 text-gray-700">
                        <strong>{option.value}</strong> = {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || totalAnswered < questions.length}
              className={`w-full font-semibold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center ${
                isSubmitting || totalAnswered < questions.length
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin mr-2" size={20} />
                  Mengirim ke Google Sheets...
                </>
              ) : (
                `Submit Quiz ${totalAnswered < questions.length ? `(${totalAnswered}/${questions.length})` : ''}`
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {showResult && (
          <div className="space-y-6">
            {submitSuccess && (
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 flex items-center">
                <CheckCircle className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-green-800 font-semibold">
                    ✓ Data berhasil dikirim 
                  </p>
                  <p className="text-green-700 text-sm">
                    Hasil quiz kamu sudah tersimpan
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* User Info Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Peserta:</strong> {userInfo.name}<br/>
                  <strong>WhatsApp:</strong> {userInfo.whatsapp}<br/>
                  <strong>Lokasi:</strong> {provinces.find(p => p.id === userInfo.province)?.name}, {cities.find(c => c.id === userInfo.city)?.name}
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Rekomendasi Jalur Kamu
              </h2>
              
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg mb-4 border-2 border-green-200">
                <p className="text-lg font-semibold text-green-800 mb-2">
                  🎯 Jalur Utama yang Direkomendasikan:
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {calculateResult().primary}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-6 border-2 border-blue-200">
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  🔄 Jalur Cadangan (Alternatif):
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {calculateResult().backup}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Jika jalur utama tidak memungkinkan, kamu bisa pertimbangkan jalur ini
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Ringkasan Skor Kamu:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Budget</p>
                    <p className="text-2xl font-bold text-indigo-600">{answers.q1}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q1', answers.q1)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Waktu</p>
                    <p className="text-2xl font-bold text-purple-600">{answers.q2}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q2', answers.q2)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                    <p className="text-sm text-gray-600 mb-1">Skill</p>
                    <p className="text-2xl font-bold text-pink-600">{answers.q3}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q3', answers.q3)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Bahasa Korea</p>
                    <p className="text-2xl font-bold text-orange-600">{answers.q4}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q4', answers.q4)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                    <p className="text-sm text-gray-600 mb-1">Target</p>
                    <p className="text-2xl font-bold text-teal-600">{answers.q5}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q5', answers.q5)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
                    <p className="text-sm text-gray-600 mb-1">Mental Adaptasi</p>
                    <p className="text-2xl font-bold text-cyan-600">{answers.q6}/5</p>
                    <p className="text-xs text-gray-500 mt-1">{getQuestionLabel('q6', answers.q6)}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-center text-lg">
                    <span className="text-gray-600">Total Skor:</span>{' '}
                    <span className="font-bold text-2xl text-indigo-600">
                      {answers.q1 + answers.q2 + answers.q3 + answers.q4 + answers.q5 + answers.q6}/30
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full mt-6 bg-indigo-600 text-white font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Mulai Quiz Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KuisJalurKorea;