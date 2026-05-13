export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADVOGADO' | 'CLIENTE';
  oab?: string;
  specialties?: string[];
  plan: 'ESSENTIAL' | 'PROFESSIONAL' | 'ELITE';
  subscriptionStatus: 'ACTIVE' | 'INACTIVE';
  lat?: number;
  long?: number;
  rating?: number;
}

export interface Case {
  id: string;
  lawyerId: string;
  clientId: string;
  title: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PRIORITY';
  createdAt: string;
  aiSummary?: string;
}

export interface TriageSession {
  id: string;
  clientName: string;
  summary: string;
  timestamp: string;
}
