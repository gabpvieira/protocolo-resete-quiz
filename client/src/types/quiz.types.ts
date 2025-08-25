export interface UserResponse {
  questionId: string;
  answer: string | string[];
  timestamp: number;
}

export interface QuizState {
  currentPage: number;
  responses: UserResponse[];
  userProfile: UserProfile | null;
  finalResult: QuizResult | null;
  multipleAnswers: Record<string, string[]>;
}

export interface UserProfile {
  userType: 'efeito_sanfona' | 'metabolismo_lento' | 'compulsao_doce' | 'tentou_tudo';
  struggleTime: string;
  attempts: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  painLevel: number;
  readinessLevel: number;
}

export interface QuizResult {
  successChance: number;
  userType: string;
  personalizedInsights: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedPlan: 'essencial' | 'premium';
}

export interface AnswerOption {
  id: string;
  text: string;
  description?: string;
  icon: string;
  iconColor: string;
}

export interface QuizPage {
  id: number;
  title: string;
  subtitle?: string;
  questionId: string;
  multipleChoice?: boolean;
  options: AnswerOption[];
}

export interface LoadingStep {
  id: string;
  text: string;
  duration: number;
}

export interface Plan {
  id: 'essencial' | 'premium';
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  recommended?: boolean;
  icon: string;
}
