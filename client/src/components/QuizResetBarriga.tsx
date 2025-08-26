import { useState, useEffect } from 'react';
import { QuizState, UserResponse, QuizResult, LoadingStep, Plan } from '../types/quiz.types';
import { generateQuizResult } from '../utils/scoring.utils';

const QuizResetBarriga = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentPage: 1,
    responses: [],
    userProfile: null,
    finalResult: null,
    multipleAnswers: {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const updateProgress = () => {
    const progress = (quizState.currentPage / 14) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    updateProgress();
    scrollToTop();
  }, [quizState.currentPage]);

  const selectAnswer = (questionId: string, answer: string) => {
    const newResponses = quizState.responses.filter(r => r.questionId !== questionId);
    newResponses.push({
      questionId,
      answer,
      timestamp: Date.now()
    });

    setQuizState(prev => ({
      ...prev,
      responses: newResponses
    }));

    setTimeout(() => {
      nextPage();
    }, 800);
  };

  const toggleMultipleAnswer = (questionId: string, answer: string) => {
    const currentAnswers = quizState.multipleAnswers[questionId] || [];
    const index = currentAnswers.indexOf(answer);
    
    let newAnswers;
    if (index > -1) {
      newAnswers = currentAnswers.filter(a => a !== answer);
    } else {
      newAnswers = [...currentAnswers, answer];
    }

    setQuizState(prev => ({
      ...prev,
      multipleAnswers: {
        ...prev.multipleAnswers,
        [questionId]: newAnswers
      }
    }));
  };

  const nextPageMultiple = () => {
    const questionId = 'symptoms';
    const answers = quizState.multipleAnswers[questionId] || [];
    
    if (answers.length > 0) {
      const newResponses = quizState.responses.filter(r => r.questionId !== questionId);
      newResponses.push({
        questionId,
        answer: answers,
        timestamp: Date.now()
      });

      setQuizState(prev => ({
        ...prev,
        responses: newResponses
      }));
      nextPage();
    } else {
      alert('Selecione pelo menos uma opção para continuar.');
    }
  };

  const nextPage = () => {
    if (quizState.currentPage === 10) {
      showLoadingAnalysis();
    } else if (quizState.currentPage === 12) {
      showProtocolLoading();
    } else if (quizState.currentPage === 13) {
      setQuizState(prev => ({ ...prev, currentPage: 14 }));
    } else {
      setQuizState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const showLoadingAnalysis = () => {
    setQuizState(prev => ({ ...prev, currentPage: 11 }));
    setIsLoading(true);
    setLoadingProgress(0);

    const steps = [
      'Analisando seu perfil metabólico único...',
      'Identificando os gatilhos que travam seu emagrecimento...',
      'Calculando seu potencial de perda de peso...',
      'Preparando seu protocolo personalizado exclusivo...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingProgress((step / steps.length) * 100);
      
      if (step >= steps.length) {
        clearInterval(interval);
        setIsLoading(false);
        
        // Generate result and navigate to page 12
        const result = generateQuizResult(quizState.responses);
        setQuizState(prev => ({
          ...prev,
          finalResult: result,
          currentPage: 12
        }));
      }
    }, 2000);
  };

  const showProtocolLoading = () => {
    setQuizState(prev => ({ ...prev, currentPage: 13 }));
    setIsLoading(true);
    setLoadingProgress(0);

    const steps = [
      'Configurando os 3 gatilhos metabólicos ideais para você...',
      'Personalizando estratégias para seu perfil específico...',
      'Calibrando protocolo Reset da Barriga...',
      'Finalizando seu plano personalizado...'
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoadingProgress((step / steps.length) * 100);
      
      if (step >= steps.length) {
        clearInterval(interval);
        setIsLoading(false);
        
        // Navigate directly to page 14 (final offer)
        setQuizState(prev => ({
          ...prev,
          currentPage: 14
        }));
      }
    }, 1750);
  };


  const selectPlan = (plan: 'essencial' | 'premium') => {
    console.log(`Selected plan: ${plan}`);
    
    // Preserve all existing URL parameters
    const currentParams = window.location.search;
    
    // Add plan parameter to the URL
    const separator = currentParams ? '&' : '?';
    const planParam = `${separator}plan=${plan}`;
    
    // Define checkout URLs for each plan
    const checkoutUrls = {
      essencial: `/checkout/essencial${currentParams}${planParam}`,
      premium: `/checkout/premium${currentParams}${planParam}`
    };
    
    // Redirect to the appropriate checkout page
    window.location.href = checkoutUrls[plan];
  };

  const plans: Plan[] = [
    {
      id: 'essencial',
      name: 'PLANO ESSENCIAL',
      price: 'R$ 9,90',
      features: [
        'Protocolo Reset da Barriga completo',
        'Guia dos 3 gatilhos alimentares',
        'Vídeo explicativo passo a passo',
        '7 dias de garantia'
      ],
      icon: 'fas fa-medal'
    },
    {
      id: 'premium',
      name: 'PLANO PREMIUM',
      price: 'R$ 29,90',
      originalPrice: 'R$ 692',
      features: [
        'Tudo do Plano Essencial +',
        'BÔNUS 1: Lista das Substituições Inteligentes (R$ 97)',
        'BÔNUS 2: Cardápio Anti-Compulsão de 21 Dias (R$ 127)',
        'BÔNUS 3: Reset Hormonal da Queima (R$ 147)',
        'BÔNUS 4: Treino de 7 Minutos em Casa (R$ 97)',
        'BÔNUS 5: Guia do Sono Emagrecedor (R$ 127)'
      ],
      recommended: true,
      icon: 'fas fa-crown'
    }
  ];

  const renderPage = () => {
    switch (quizState.currentPage) {
      case 1:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Descubra o Protocolo que 
                  <span className="text-primary"> Reativa seu Metabolismo Lento</span> 
                  e Elimina até <span className="text-accent">5kg em 21 Dias</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Mesmo que você já tenha tentado dietas, academia, remédios e shakes sem sucesso
                </p>
                
                <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-8">
                  <i className="fas fa-flask text-primary mr-3"></i>
                  <span className="text-primary font-semibold">Sistema de 3 Gatilhos Alimentares + Reset Metabólico de 7 Dias</span>
                </div>
              </div>

              <div className="mb-12 text-center">
                <img 
                  src="https://i.postimg.cc/XNZGNLBK/capa.jpg" 
                  alt="Transformação de perda de peso" 
                  className="rounded-xl shadow-2xl w-full max-w-3xl mx-auto"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
                  <div className="w-12 h-12 min-w-[48px] bg-primary/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square">
                    <i className="fas fa-weight text-primary text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">Elimine até 5kg em 21 dias</h3>
                    <p className="text-gray-600 text-xs">Sem passar fome ou dietas malucas</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
                  <div className="w-12 h-12 min-w-[48px] bg-accent/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square">
                    <i className="fas fa-cookie-bite text-accent text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">Continue comendo pão e doce</h3>
                    <p className="text-gray-600 text-xs">Do jeito certo, sem culpa</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg flex items-center">
                  <div className="w-12 h-12 min-w-[48px] bg-success/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square">
                    <i className="fas fa-chart-line text-success text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">Pare o efeito sanfona</h3>
                    <p className="text-gray-600 text-xs">De uma vez por todas</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={nextPage}
                  data-testid="button-start-quiz"
                  className="bg-gradient-to-r from-primary to-success text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <i className="fas fa-play mr-3"></i>
                  INICIAR MEU PROTOCOLO
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-12">
                <div className="text-6xl font-bold text-primary mb-4">+12.000</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">pessoas já reativaram o metabolismo</h2>
                <p className="text-xl text-gray-600">e eliminaram o efeito sanfona</p>
              </div>

              <div className="mb-12 text-center">
                <img 
                  src="https://i.postimg.cc/3JcKcQx2/capapg2.jpg" 
                  alt="Resultados do protocolo" 
                  className="rounded-xl shadow-2xl w-full mx-auto"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { 
                    name: 'Sandra', 
                    age: '42 anos', 
                    text: 'Eu já tinha tentado várias dietas, mas sempre desistia na primeira semana. Com o Reset, em 21 dias perdi 5kg sem abrir mão do meu café com pão francês. A maior diferença foi na disposição, parece que meu corpo acordou de novo.',
                    image: 'https://i.postimg.cc/rmHDC03t/01.png'
                  },
                  { 
                    name: 'Roberto', 
                    age: '35 anos', 
                    text: 'Meu problema não era só o peso, era o efeito sanfona. Emagrecia 3kg e ganhava 4 depois. Com o Reset consegui estabilizar, já faz 2 meses que não vejo a balança subir. Finalmente sinto que achei algo que funciona de verdade.',
                    image: 'https://i.postimg.cc/xCXv22SM/02.png'
                  },
                  { 
                    name: 'Mariana', 
                    age: '38 anos', 
                    text: 'Eu tinha compulsão por doce à noite, era automático abrir a geladeira. Depois do Reset, essa vontade diminuiu muito. Perdi 3,8kg no primeiro mês e pela primeira vez não me sinto em guerra com a comida.',
                    image: 'https://i.postimg.cc/Njx78D49/03.png'
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={`Depoimento de ${testimonial.name}`}
                        className="w-12 h-12 min-w-[48px] rounded-full object-cover mr-4 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.age}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{testimonial.text}</p>
                    <div className="flex text-accent">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-6 text-center mb-8">
                <i className="fas fa-microscope text-secondary text-3xl mb-4"></i>
                <p className="text-gray-700 font-medium">Método desenvolvido com base em estudos sobre metabolismo e hormônios da saciedade</p>
              </div>

              <div className="text-center">
                <button 
                  onClick={nextPage}
                  data-testid="button-continue"
                  className="bg-gradient-to-r from-primary to-success text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Continuar <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Qual dessas situações mais descreve sua luta com o peso?
                </h2>
                <p className="text-lg text-gray-600">Selecione a opção que mais se identifica com você</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'efeito_sanfona', text: 'Já fiz várias dietas mas sempre volto a engordar', desc: '(efeito sanfona)', icon: 'fas fa-sync-alt', bgColor: 'bg-red-100', iconColor: 'text-red-500' },
                  { id: 'metabolismo_lento', text: 'Como pouco mas não emagreço', desc: '(metabolismo lento)', icon: 'fas fa-tachometer-alt', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
                  { id: 'compulsao_doce', text: 'Tenho compulsão por doces e carboidratos', desc: 'Não consigo resistir', icon: 'fas fa-cookie-bite', bgColor: 'bg-amber-100', iconColor: 'text-amber-500' },
                  { id: 'tentou_tudo', text: 'Já tentei de tudo', desc: 'Dietas, academia, remédios, nada funciona', icon: 'fas fa-exclamation-triangle', bgColor: 'bg-purple-100', iconColor: 'text-purple-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('main_struggle', option.id)}
                    data-testid={`button-option-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} ${option.iconColor} text-xl`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                          <p className="text-gray-600">{option.desc}</p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Há quanto tempo você luta para emagrecer?
                </h2>
                <p className="text-lg text-gray-600">Isso nos ajuda a entender melhor seu perfil</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'menos_1_ano', text: 'Menos de 1 ano', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
                  { id: '1_3_anos', text: 'Entre 1 e 3 anos', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
                  { id: '3_5_anos', text: 'Entre 3 e 5 anos', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { id: 'mais_5_anos', text: 'Mais de 5 anos', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('struggle_time', option.id)}
                    data-testid={`button-time-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`fas fa-clock ${option.iconColor} text-xl`}></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Qual é seu maior obstáculo para emagrecer?
                </h2>
                <p className="text-lg text-gray-600">Vamos identificar a raiz do problema</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'efeito_sanfona', text: 'Sempre recupero o peso perdido (efeito sanfona)', icon: 'fas fa-sync-alt', bgColor: 'bg-red-100', iconColor: 'text-red-500' },
                  { id: 'compulsao_doce', text: 'Não consigo controlar a vontade de comer doce', icon: 'fas fa-cookie-bite', bgColor: 'bg-amber-100', iconColor: 'text-amber-500' },
                  { id: 'metabolismo_lento', text: 'Como pouco mas não perco peso', icon: 'fas fa-tachometer-alt', bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
                  { id: 'dietas_restritivas', text: 'Desisto das dietas porque são muito restritivas', icon: 'fas fa-ban', bgColor: 'bg-purple-100', iconColor: 'text-purple-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('main_obstacle', option.id)}
                    data-testid={`button-obstacle-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} ${option.iconColor} text-xl`}></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Quantas vezes você já tentou emagrecer e "falhou"?
                </h2>
                <p className="text-lg text-gray-600">Seja honesta conosco (isso é importante para seu resultado)</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: '2_3_tentativas', text: '2-3 tentativas', icon: 'fas fa-redo', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
                  { id: '4_6_tentativas', text: '4-6 tentativas', icon: 'fas fa-redo', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
                  { id: '7_10_tentativas', text: '7-10 tentativas', icon: 'fas fa-redo', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { id: 'mais_10', text: 'Mais de 10 tentativas', desc: '(já perdi a conta)', icon: 'fas fa-infinity', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('attempts_failed', option.id)}
                    data-testid={`button-attempts-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} ${option.iconColor} text-xl`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                          {option.desc && <p className="text-gray-600">{option.desc}</p>}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Como você se sente quando se olha no espelho?
                </h2>
                <p className="text-lg text-gray-600">Queremos entender o impacto emocional</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'pouco_insatisfeita', text: 'Um pouco insatisfeita comigo mesma', icon: 'fas fa-frown', bgColor: 'bg-green-100', iconColor: 'text-green-500' },
                  { id: 'frustrada', text: 'Frustrada por não conseguir emagrecer', icon: 'fas fa-frown', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500' },
                  { id: 'envergonhada', text: 'Envergonhada do meu corpo', icon: 'fas fa-sad-tear', bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
                  { id: 'desesperada', text: 'Desesperada e sem esperança', icon: 'fas fa-sad-cry', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('emotional_feeling', option.id)}
                    data-testid={`button-feeling-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} ${option.iconColor} text-xl`}></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Como o peso afeta sua vida social e relacionamentos?
                </h2>
                <p className="text-lg text-gray-600">O impacto vai além do físico</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'evito_fotos', text: 'Evito fotos e eventos sociais', icon: 'fas fa-camera', bgColor: 'bg-purple-100', iconColor: 'text-purple-500' },
                  { id: 'insegura_relacionamento', text: 'Me sinto insegura no relacionamento', icon: 'fas fa-heart', bgColor: 'bg-pink-100', iconColor: 'text-pink-500' },
                  { id: 'nao_uso_roupas', text: 'Não uso as roupas que gostaria', icon: 'fas fa-tshirt', bgColor: 'bg-indigo-100', iconColor: 'text-indigo-500' },
                  { id: 'afeta_autoestima', text: 'Afeta minha autoestima e confiança', icon: 'fas fa-user-times', bgColor: 'bg-red-100', iconColor: 'text-red-500' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('social_impact', option.id)}
                    data-testid={`button-social-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] ${option.bgColor} rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} ${option.iconColor} text-xl`}></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                      </div>
                      <div className="text-gray-400">
                        <i className="fas fa-chevron-right text-lg"></i>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 9:
        const selectedSymptoms = quizState.multipleAnswers['symptoms'] || [];
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-8">
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <i className="fas fa-microscope text-secondary text-3xl mb-4"></i>
                  <p className="text-lg text-gray-700 font-medium">
                    Pesquisas mostram que <span className="text-secondary font-bold">89% das pessoas</span> com metabolismo lento sofrem de:
                  </p>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Quais destes sintomas você reconhece em si?
                </h2>
                <p className="text-lg text-gray-600">Pode marcar mais de uma opção</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'ganho_peso_pouco', text: 'Ganho de peso mesmo comendo pouco', icon: 'fas fa-weight', color: 'red' },
                  { id: 'compulsao_doces', text: 'Compulsão por doces após as 18h', icon: 'fas fa-cookie-bite', color: 'amber' },
                  { id: 'cansaco_constante', text: 'Cansaço constante e falta de energia', icon: 'fas fa-tired', color: 'orange' },
                  { id: 'efeito_sanfona', text: 'Efeito sanfona (sempre recupera o peso)', icon: 'fas fa-sync-alt', color: 'purple' },
                  { id: 'inchaco_abdominal', text: 'Inchaço abdominal frequente', icon: 'fas fa-expand-arrows-alt', color: 'green' },
                  { id: 'dificuldade_dormir', text: 'Dificuldade para dormir bem', icon: 'fas fa-bed', color: 'blue' }
                ].map((option) => {
                  const isSelected = selectedSymptoms.includes(option.id);
                  return (
                    <button 
                      key={option.id}
                      onClick={() => toggleMultipleAnswer('symptoms', option.id)}
                      data-testid={`button-symptom-${option.id}`}
                      className={`w-full bg-white rounded-xl p-6 text-left shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 min-w-[48px] bg-${option.color}-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                          <i className={`${option.icon} text-${option.color}-500 text-xl`}></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg flex-grow">{option.text}</h3>
                        <div className="ml-auto">
                          <div className={`w-6 h-6 border-2 rounded ${
                            isSelected 
                              ? 'bg-primary border-primary text-white flex items-center justify-center' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <i className="fas fa-check text-white text-xs"></i>}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={nextPageMultiple}
                  data-testid="button-continue-symptoms"
                  className="bg-gradient-to-r from-primary to-success text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Continuar <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="text-center mb-8">
                <div className="bg-primary/10 rounded-xl p-6 mb-8">
                  <i className="fas fa-magic text-primary text-3xl mb-4"></i>
                  <p className="text-lg text-gray-700 font-medium">
                    O <span className="text-primary font-bold">Protocolo Reset da Barriga</span> combina 3 gatilhos alimentares científicos que reativam seu metabolismo em 7 dias...
                  </p>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Se você pudesse emagrecer 5kg em 21 dias sem passar fome e sem cortar pão ou doce, quanto isso mudaria sua vida?
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'mudaria_completamente', text: 'Mudaria completamente', desc: 'Recuperaria minha confiança e autoestima', icon: 'fas fa-star', color: 'green' },
                  { id: 'mudaria_muito', text: 'Mudaria muito', desc: 'Finalmente me sentiria bem comigo mesma', icon: 'fas fa-heart', color: 'blue' }
                ].map((option) => (
                  <button 
                    key={option.id}
                    onClick={() => selectAnswer('magic_question', option.id)}
                    data-testid={`button-magic-${option.id}`}
                    className="quiz-option w-full bg-white rounded-xl p-6 text-left transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-primary"
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 min-w-[48px] bg-${option.color}-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0 aspect-square`}>
                        <i className={`${option.icon} text-${option.color}-500 text-xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{option.text}</h3>
                        <p className="text-gray-600">{option.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 11:
        const analysisSteps = [
          { text: 'Analisando seu perfil metabólico único...', completed: loadingProgress >= 25 },
          { text: 'Identificando os gatilhos que travam seu emagrecimento...', completed: loadingProgress >= 50 },
          { text: 'Calculando seu potencial de perda de peso...', completed: loadingProgress >= 75 },
          { text: 'Preparando seu protocolo personalizado exclusivo...', completed: loadingProgress >= 100 }
        ];

        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5 pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center">
                {/* Loading Icon */}
                <div className="mb-12">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-brain text-primary text-2xl"></i>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Analisando seu <span className="text-primary">perfil</span>...
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Nossa IA exclusiva está processando suas respostas para criar um protocolo 100% personalizado
                  </p>
                </div>

                {/* Analysis Steps */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8 max-w-3xl mx-auto">
                  <div className="space-y-6">
                    {analysisSteps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                            step.completed 
                              ? 'bg-success text-white' 
                              : loadingProgress > (index * 25) 
                                ? 'bg-primary/20 text-primary animate-pulse'
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <i className="fas fa-check text-sm"></i>
                            ) : (
                              <i className="fas fa-cog animate-spin text-sm"></i>
                            )}
                          </div>
                          <span className={`text-lg font-medium transition-colors duration-300 ${
                            step.completed ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {step.text}
                          </span>
                        </div>
                        {step.completed && (
                          <div className="text-success font-semibold text-sm">
                            Concluído
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Progresso da Análise</span>
                    <span className="text-sm font-bold text-primary">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary via-success to-accent h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Exclusive Features */}
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-dna text-primary text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Análise Metabólica Avançada</h3>
                    <p className="text-gray-600 text-xs">Tecnologia exclusiva de mapeamento hormonal</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4 border border-success/20">
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-target text-success text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Protocolo Personalizado</h3>
                    <p className="text-gray-600 text-xs">Criado especificamente para seu biotipo</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-shield-alt text-accent text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Resultado Garantido</h3>
                    <p className="text-gray-600 text-xs">Baseado em mais de 12.000 casos de sucesso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 12:
        const result = quizState.finalResult;
        if (!result) return null;

        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-success/10 pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-5xl">
              
              {/* Header Section with Animation */}
              <div className="text-center mb-12">
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 bg-gradient-to-r from-success to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <i className="fas fa-check-circle text-white text-5xl"></i>
                  </div>
                  {/* Animated rings */}
                  <div className="absolute inset-0 w-32 h-32 border-4 border-success/30 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 w-28 h-28 border-2 border-success/20 rounded-full animate-ping animation-delay-200"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-primary to-success bg-clip-text text-transparent">
                  Seu perfil foi identificado!
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                  Veja os resultados da sua análise personalizada completa
                </p>
              </div>

              {/* Analysis Image */}
              <div className="mb-12 text-center">
                <img 
                  src="https://i.postimg.cc/h4b5ZLpn/analise1.jpg" 
                  alt="Análise Personalizada Completa" 
                  className="rounded-2xl shadow-2xl max-w-full mx-auto transform hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Success Rate Container - Enhanced */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-success to-green-400 rounded-2xl blur-xl opacity-30 transform scale-105"></div>
                <div className="relative bg-gradient-to-r from-success via-green-500 to-emerald-500 rounded-2xl p-10 text-white text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="mb-4">
                    <div className="text-7xl md:text-8xl font-black mb-4 drop-shadow-lg" data-testid="text-success-rate">
                      {result.successChance}%
                    </div>
                    <p className="text-2xl md:text-3xl font-semibold mb-2">de chance de sucesso com o protocolo</p>
                    <p className="text-lg opacity-95">Baseado no seu perfil e respostas</p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 rounded-full"></div>
                  <div className="absolute top-1/2 right-8 w-8 h-8 bg-white/10 rounded-full"></div>
                </div>
              </div>

              {/* Enhanced Info Cards */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center mr-6 shadow-lg">
                      <i className="fas fa-user-circle text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Seu Tipo Identificado</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed" data-testid="text-user-type">{result.userType}</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-orange-500 rounded-full flex items-center justify-center mr-6 shadow-lg">
                      <i className="fas fa-clock text-white text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Tempo de Luta</h3>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed" data-testid="text-struggle-time">
                    {(() => {
                      const timeResponse = quizState.responses.find(r => r.questionId === 'struggle_time');
                      const timeMap = {
                        'menos_1_ano': 'Menos de 1 ano tentando emagrecer',
                        '1_3_anos': '1-3 anos tentando emagrecer',
                        '3_5_anos': '3-5 anos tentando emagrecer',
                        'mais_5_anos': 'Mais de 5 anos tentando emagrecer'
                      };
                      return timeMap[timeResponse?.answer as keyof typeof timeMap] || 'Tempo não informado';
                    })()}
                  </p>
                </div>
              </div>

              {/* Enhanced Insights Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 shadow-xl border border-gray-100 mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                  <i className="fas fa-lightbulb text-accent mr-4 text-4xl"></i>
                  Insights Personalizados para Você
                </h3>
                <div className="space-y-6" data-testid="container-insights">
                  {result.personalizedInsights.map((insight, index) => (
                    <div key={index} className="flex items-start p-6 bg-gradient-to-r from-primary/5 to-success/5 rounded-xl border-l-4 border-primary shadow-md transform hover:scale-105 transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed" data-testid={`text-insight-${index}`}>{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-success rounded-full blur-xl opacity-50 transform scale-110"></div>
                  <button 
                    onClick={nextPage}
                    data-testid="button-view-protocol"
                    className="relative bg-gradient-to-r from-primary via-success to-emerald-500 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20"
                  >
                    <i className="fas fa-rocket mr-4 text-2xl"></i>
                    Ver Meu Protocolo Personalizado
                    <i className="fas fa-arrow-right ml-4 text-2xl"></i>
                  </button>
                </div>
                
                {/* Pulsing indicator */}
                <div className="mt-6">
                  <div className="w-4 h-4 bg-success rounded-full mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 13:
        const protocolSteps = [
          { text: 'Configurando os 3 gatilhos metabólicos ideais para você...', completed: loadingProgress >= 25 },
          { text: 'Personalizando estratégias para seu perfil específico...', completed: loadingProgress >= 50 },
          { text: 'Calibrando protocolo Reset da Barriga...', completed: loadingProgress >= 75 },
          { text: 'Finalizando seu plano personalizado...', completed: loadingProgress >= 100 }
        ];

        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-success/5 pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center">
                {/* Loading Icon */}
                <div className="mb-12">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full border-4 border-success/20 border-t-success animate-spin mx-auto mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-cogs text-success text-2xl"></i>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Preparando seu <span className="text-success">Protocolo Reset</span>
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
                    personalizado...
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Configurando os gatilhos metabólicos específicos para seu perfil único
                  </p>
                </div>

                {/* Protocol Steps */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8 max-w-3xl mx-auto">
                  <div className="space-y-6">
                    {protocolSteps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-500 ${
                            step.completed 
                              ? 'bg-success text-white' 
                              : loadingProgress > (index * 25) 
                                ? 'bg-success/20 text-success animate-pulse'
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <i className="fas fa-check text-sm"></i>
                            ) : (
                              <i className="fas fa-cog animate-spin text-sm"></i>
                            )}
                          </div>
                          <span className={`text-lg font-medium transition-colors duration-300 ${
                            step.completed ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {step.text}
                          </span>
                        </div>
                        {step.completed && (
                          <div className="text-success font-semibold text-sm">
                            Concluído
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Configuração do Protocolo</span>
                    <span className="text-sm font-bold text-success">{Math.round(loadingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-success via-green-400 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Protocol Features */}
                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-4 border border-success/20">
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-bullseye text-success text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">3 Gatilhos Metabólicos</h3>
                    <p className="text-gray-600 text-xs">Calibrados para seu biotipo específico</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-4 border border-green-500/20">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-rocket text-green-500 text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Reset em 21 Dias</h3>
                    <p className="text-gray-600 text-xs">Protocolo acelerado de resultados</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-medal text-emerald-500 text-xl"></i>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">100% Personalizado</h3>
                    <p className="text-gray-600 text-xs">Baseado nas suas respostas únicas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 14:
        return (
          <div className="min-h-screen pt-[159px] pb-8">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-12">
                <div className="w-24 h-24 min-w-[96px] bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0 aspect-square">
                  <i className="fas fa-check-circle text-success text-4xl"></i>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Seu resultado está pronto!
                </h2>
                <p className="text-xl text-gray-600 mb-8">Identificamos exatamente o que está travando seu emagrecimento.</p>
              </div>

              {/* Personalized Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-primary/5 rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  <i className="fas fa-user-check text-primary mr-3"></i>
                  Seu Resumo Personalizado
                </h3>
                <div className="grid md:grid-cols-3 gap-6" data-testid="container-final-summary">
                  {[
                    `Você tem perfil de ${quizState.finalResult?.userType.toLowerCase()}`,
                    'Sua compulsão por doces indica desequilíbrio hormonal',
                    'Após tantas tentativas, você precisa de um método que funcione DE VERDADE'
                  ].map((point, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex items-center">
                        <div className="w-8 h-8 min-w-[32px] bg-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0 aspect-square">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <p className="text-gray-700 text-sm" data-testid={`text-summary-${index}`}>{point}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Method Presentation */}
              <div className="text-center mb-12">
                <div className="bg-gradient-to-r from-primary to-success text-white rounded-xl p-8 mb-8">
                  <h3 className="text-3xl font-bold mb-4">PROTOCOLO RESET DA BARRIGA</h3>
                  <p className="text-xl">O único método que combina 3 gatilhos alimentares para reativar metabolismo lento em 7 dias</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-16 h-16 min-w-[64px] bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0 aspect-square">
                      <span className="text-red-600 font-bold text-xl">1-7</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">DIAS 1-7</h4>
                    <p className="text-gray-600">Reset metabólico que 'desperta' hormônios dormentes</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-16 h-16 min-w-[64px] bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0 aspect-square">
                      <span className="text-amber-600 font-bold text-xl">8-21</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">DIAS 8-21</h4>
                    <p className="text-gray-600">Ativação dos 3 gatilhos alimentares para queima contínua</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-16 h-16 min-w-[64px] bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0 aspect-square">
                      <i className="fas fa-trophy text-green-600 text-2xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">RESULTADO</h4>
                    <p className="text-gray-600">Até 5kg eliminados sem fome, sem cortar doce, sem academia</p>
                  </div>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`bg-white rounded-xl p-8 shadow-lg ${
                      plan.recommended 
                        ? 'border-4 border-accent relative' 
                        : 'border-2 border-gray-200'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-bold">RECOMENDADO</span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 min-w-[64px] ${plan.recommended ? 'bg-accent/10' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0 aspect-square`}>
                        <i className={`${plan.icon} ${plan.recommended ? 'text-accent' : 'text-gray-600'} text-2xl`}></i>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      {plan.originalPrice && (
                        <div className="mb-2">
                          <span className="text-2xl text-gray-500 line-through">{plan.originalPrice}</span>
                        </div>
                      )}
                      <div className={`${plan.recommended ? 'text-4xl font-bold text-accent' : 'text-3xl font-bold text-gray-900'}`}>
                        {plan.price}
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <i className={`fas ${feature.includes('BÔNUS') ? 'fa-gift text-accent' : 'fa-check text-success'} mr-3`}></i>
                          <span className={feature.includes('BÔNUS') ? 'font-medium' : ''}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={() => selectPlan(plan.id)}
                      data-testid={`button-plan-${plan.id}`}
                      className={`w-full font-bold py-4 px-6 rounded-full transition-all duration-300 ${
                        plan.recommended
                          ? 'bg-gradient-to-r from-accent to-orange-500 text-white hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {plan.recommended ? (
                        <>
                          <i className="fas fa-crown mr-2"></i>
                          QUERO O PREMIUM
                        </>
                      ) : (
                        'Escolher Essencial'
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Value Message */}
              <div className="bg-amber-50 rounded-xl p-6 text-center mb-8">
                <i className="fas fa-lightbulb text-amber-500 text-2xl mb-3"></i>
                <p className="text-lg font-medium text-gray-800">
                  Você pode levar só o protocolo por R$ 9,90... mas por apenas <span className="text-accent font-bold">+R$ 20</span> você recebe bônus que valem <span className="text-accent font-bold">R$ 595</span>. A escolha é óbvia!
                </p>
              </div>

              {/* Guarantees */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <i className="fas fa-shield-alt text-success text-3xl mb-3"></i>
                  <h4 className="font-bold text-gray-900 mb-2">7 Dias de Garantia</h4>
                  <p className="text-gray-600">Incondicional e total</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <i className="fas fa-weight text-primary text-3xl mb-3"></i>
                  <h4 className="font-bold text-gray-900 mb-2">Garantia de Resultado</h4>
                  <p className="text-gray-600">Se não perder 2kg, devolvemos seu dinheiro</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                  <i className="fas fa-infinity text-accent text-3xl mb-3"></i>
                  <h4 className="font-bold text-gray-900 mb-2">Acesso Vitalício</h4>
                  <p className="text-gray-600">Imediato e para sempre</p>
                </div>
              </div>

              {/* Objection Handling */}
              <div className="bg-gray-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quebra de Objeções</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { q: '"E se não funcionar comigo?"', a: '→ 7 dias de garantia total' },
                      { q: '"Já tentei tantas coisas..."', a: '→ Este método é diferente: reativa o metabolismo ao invés de desacelerar' },
                      { q: '"E se for muito difícil?"', a: '→ São apenas 3 gatilhos simples, sem dieta maluca' }
                    ].map((objection, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-question-circle text-red-500 mr-3 mt-1"></i>
                        <div>
                          <p className="font-bold text-gray-900">{objection.q}</p>
                          <p className="text-gray-600">{objection.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      { q: '"E se eu não conseguir parar os doces?"', a: '→ O protocolo reduz naturalmente a compulsão' },
                      { q: '"E se for caro demais?"', a: '→ R$ 29,90 é menos que um dia de delivery' }
                    ].map((objection, index) => (
                      <div key={index} className="flex items-start">
                        <i className="fas fa-question-circle text-red-500 mr-3 mt-1"></i>
                        <div>
                          <p className="font-bold text-gray-900">{objection.q}</p>
                          <p className="text-gray-600">{objection.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Urgency and Scarcity */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle text-red-500 text-2xl mr-4"></i>
                  <div>
                    <p className="font-bold text-red-800">Oferta especial válida apenas hoje</p>
                    <p className="text-red-700">Amanhã volta ao preço normal de R$ 97</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8">
                <div className="flex items-center">
                  <i className="fas fa-users text-orange-500 text-2xl mr-4"></i>
                  <div>
                    <p className="font-bold text-orange-800">Vagas limitadas</p>
                    <p className="text-orange-700">Para acompanhamento personalizado</p>
                  </div>
                </div>
              </div>

              {/* Final CTAs */}
              <div className="text-center space-y-4">
                <button 
                  onClick={() => selectPlan('premium')}
                  data-testid="button-premium-final"
                  className="w-full max-w-md bg-gradient-to-r from-accent to-orange-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <i className="fas fa-crown mr-3"></i>
                  SIM! Quero o PLANO PREMIUM por R$ 29,90
                </button>
                <button 
                  onClick={() => selectPlan('essencial')}
                  data-testid="button-essencial-final"
                  className="w-full max-w-md bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-700 transition-colors"
                >
                  Prefiro apenas o Essencial por R$ 9,90
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        {/* Logo */}
        <div className="text-center py-4">
          <img 
            src="https://i.postimg.cc/6QhfB0SL/LOGO-RESET-DA-BARRIGA.png" 
            alt="Logo Reset da Barriga" 
            className="h-[70px] mx-auto"
          />
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              id="progress-bar" 
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${(quizState.currentPage / 14) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="fade-in-up">
        {renderPage()}
      </div>
    </div>
  );
};

export default QuizResetBarriga;
