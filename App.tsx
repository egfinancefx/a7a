
import React, { useState } from 'react';
import { ImagePicker } from './components/ImagePicker';
import { QuestionDisplay } from './components/QuestionDisplay';
import { Button } from './components/Button';
import { AppState, QuestionData, ImageFile } from './types';
import { generateQuestionFromImages } from './services/geminiService';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImagesChange = (newImages: ImageFile[]) => {
    setImages(newImages);
    setQuestion(null);
    setError(null);
    setState(AppState.IDLE);
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    setState(AppState.LOADING);
    setError(null);
    
    try {
      const data = await generateQuestionFromImages(images);
      setQuestion(data);
      setState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ غير متوقع أثناء معالجة الصور. تأكد من أن الصور واضحة ومحتواها تعليمي.');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setImages([]);
    setQuestion(null);
    setError(null);
    setState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      <header className="bg-white border-b border-gray-100 py-6 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              G
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              مولد الاختبارات الذكي
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            حوّل صورك إلى أسئلة اختبار
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            ارفع حتى 3 صور (أوراق عمل، صفحات كتاب، أو صور توضيحية) وسيقوم الذكاء الاصطناعي بإنشاء سؤال تعليمي شامل عنها.
          </p>
        </div>

        <section className="space-y-8">
          <ImagePicker 
            images={images} 
            onImagesChange={handleImagesChange} 
            isLoading={state === AppState.LOADING}
          />
          
          {images.length > 0 && state !== AppState.SUCCESS && (
            <div className="flex justify-center animate-in fade-in slide-in-from-top-4">
              <Button 
                onClick={handleGenerate} 
                isLoading={state === AppState.LOADING}
                className="w-full max-w-sm h-14 text-xl"
              >
                إنشاء السؤال ({images.length} صور)
              </Button>
            </div>
          )}
        </section>

        {state === AppState.LOADING && (
          <div className="mt-12 text-center flex flex-col items-center gap-4 py-10">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-800">جاري قراءة الصور وتحليل المحتوى...</p>
              <p className="text-gray-500">يقوم Gemini الآن بربط المعلومات من الصور وصياغة سؤال اختبار ممتاز</p>
            </div>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="mt-12 p-8 bg-red-50 border border-red-100 rounded-3xl text-red-700 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="font-bold text-lg mb-6">{error}</p>
            <Button variant="danger" onClick={handleGenerate}>إعادة المحاولة</Button>
          </div>
        )}

        {state === AppState.SUCCESS && question && (
          <div className="mt-8">
             <QuestionDisplay data={question} onReset={handleReset} />
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-gray-100 py-10 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} مولد الاختبارات الذكي - مخصص للمعلمين والطلاب</p>
      </footer>
    </div>
  );
};

export default App;
