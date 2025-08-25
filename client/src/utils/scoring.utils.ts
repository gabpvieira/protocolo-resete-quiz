import { UserResponse, UserProfile, QuizResult } from '../types/quiz.types';

export const calculateUserScore = (responses: UserResponse[]) => {
  let urgencyScore = 0;
  let painLevel = 0;
  let readinessLevel = 0;
  
  responses.forEach(response => {
    switch(response.questionId) {
      case 'main_struggle':
        painLevel += response.answer === 'tentou_tudo' ? 35 : 
                    response.answer === 'efeito_sanfona' ? 30 :
                    response.answer === 'metabolismo_lento' ? 25 : 30;
        break;
      case 'struggle_time':
        painLevel += response.answer === 'mais_5_anos' ? 30 : 
                    response.answer === '3_5_anos' ? 25 : 20;
        break;
      case 'attempts_failed':
        urgencyScore += response.answer === 'mais_10' ? 35 :
                       response.answer === '7_10_tentativas' ? 30 : 
                       response.answer === '4_6_tentativas' ? 25 : 20;
        break;
      case 'emotional_feeling':
        urgencyScore += response.answer === 'desesperada' ? 35 :
                       response.answer === 'envergonhada' ? 30 :
                       response.answer === 'frustrada' ? 25 : 15;
        break;
      case 'magic_question':
        readinessLevel += 40;
        break;
    }
  });
  
  return { urgencyScore, painLevel, readinessLevel };
};

export const generateInsights = (responses: UserResponse[], userType: string): string[] => {
  const insights = [];
  
  const typeInsights = {
    efeito_sanfona: "Seu perfil de 'efeito sanfona' indica metabolismo adaptativo - você precisa do reset hormonal para quebrar esse ciclo.",
    metabolismo_lento: "Seu metabolismo lento é resultado de dietas restritivas anteriores - o protocolo vai reativar sua queima natural.",
    compulsao_doce: "Sua compulsão por doces revela desequilíbrio de serotonina - temos estratégias específicas para isso.",
    tentou_tudo: "Após tantas tentativas, você precisa de um método que funcione DE VERDADE - e nós temos."
  };
  
  insights.push(typeInsights[userType as keyof typeof typeInsights] || typeInsights.efeito_sanfona);
  
  const attemptResponse = responses.find(r => r.questionId === 'attempts_failed');
  if (attemptResponse?.answer === 'mais_10') {
    insights.push("Suas +10 tentativas mostram que métodos convencionais não funcionam para seu perfil - você precisa do protocolo científico.");
  } else {
    insights.push("Suas tentativas anteriores falharam porque atacaram sintomas, não a causa raiz do problema.");
  }
  
  const timeResponse = responses.find(r => r.questionId === 'struggle_time');
  if (timeResponse?.answer === 'mais_5_anos') {
    insights.push("Após 5+ anos de luta, seu corpo desenvolveu resistência - o reset vai quebrar essa barreira.");
  } else {
    insights.push("Você ainda tem tempo para reverter os danos metabólicos - quanto antes começar, melhor.");
  }
  
  insights.push("Sua determinação em chegar até aqui mostra que você está pronta para a transformação definitiva.");
  
  return insights;
};

export const calculateSuccessChance = (responses: UserResponse[]): number => {
  const scores = calculateUserScore(responses);
  const baseChance = 90;
  const random = Math.floor(Math.random() * 6) - 3; // -3 to +3
  const painBonus = Math.min(scores.painLevel / 20, 5);
  const attemptBonus = Math.min(scores.urgencyScore / 30, 2);
  
  return Math.min(Math.max(baseChance + random + painBonus + attemptBonus, 88), 97);
};

export const generateUserProfile = (responses: UserResponse[]): UserProfile => {
  const mainStruggle = responses.find(r => r.questionId === 'main_struggle');
  const struggleTime = responses.find(r => r.questionId === 'struggle_time');
  const attempts = responses.find(r => r.questionId === 'attempts_failed');
  
  const scores = calculateUserScore(responses);
  
  const urgencyLevel = scores.urgencyScore > 60 ? 'critical' : 
                      scores.urgencyScore > 40 ? 'high' : 
                      scores.urgencyScore > 25 ? 'medium' : 'low';
  
  return {
    userType: (mainStruggle?.answer as UserProfile['userType']) || 'efeito_sanfona',
    struggleTime: struggleTime?.answer as string || 'menos_1_ano',
    attempts: attempts?.answer as string || '2_3_tentativas',
    urgencyLevel,
    painLevel: scores.painLevel,
    readinessLevel: scores.readinessLevel
  };
};

export const generateQuizResult = (responses: UserResponse[]): QuizResult => {
  const userProfile = generateUserProfile(responses);
  const successChance = calculateSuccessChance(responses);
  const insights = generateInsights(responses, userProfile.userType);
  
  const typeDisplayNames = {
    efeito_sanfona: 'Metabolismo Adaptativo com Efeito Sanfona',
    metabolismo_lento: 'Metabolismo Naturalmente Lento',
    compulsao_doce: 'Desequilíbrio Hormonal com Compulsão',
    tentou_tudo: 'Resistência Metabólica Múltipla'
  };
  
  return {
    successChance: Math.round(successChance),
    userType: typeDisplayNames[userProfile.userType],
    personalizedInsights: insights,
    urgencyLevel: userProfile.urgencyLevel,
    recommendedPlan: userProfile.urgencyLevel === 'critical' || userProfile.urgencyLevel === 'high' ? 'premium' : 'essencial'
  };
};
