export interface Category {
    id?: number; // Optional if not returned directly
    name: string;
}

export interface Question {
    id: number;
    text: string;
    category: number | string; // ID or Name depending on backend serialization
    weight: number;
    is_active: boolean;
    target_role: 'FRANQUEADO' | 'FUNCIONARIO' | 'ADMIN';
}

export interface Submission {
    id: number;
    unit: number; // ID of the unit
    user: number; // ID of the user
    total_score: number;
    status: 'PENDING' | 'APPROVED';
    created_at?: string;
    answers?: Answer[];
}

export interface Answer {
    id?: number;
    question: number; // ID of the question
    value: number; // 0.0, 0.5, 1.0
}

export interface AnswerInput {
    question: number;
    value: number;
}

export interface CreateSubmissionPayload {
    answers: AnswerInput[];
}

export interface RankingItem {
    id: number;
    name: string;
    rank: number;
    is_self: boolean;
    latest_score: number;
    lowest_category: string | null;
}
