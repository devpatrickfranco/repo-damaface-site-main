export type QuestionType = 'YES_NO' | 'YES_PARTIAL_NO' | 'NPS' | 'NUMERIC' | 'PERCENTAGE' | 'CUSTOM';

export interface AnswerOption {
    id: string;
    label: string;
    value: number;
    color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}

export interface AnswerTemplate {
    id: number;
    name: string;
    options: AnswerOption[];
    created_at?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    weight_percent: number;
    color: string;
    created_at?: string;
}

export interface Question {
    id: number;
    text: string;
    category: number;
    category_name?: string;
    question_type: QuestionType;
    weight: number;
    target_role: 'FRANQUEADO' | 'FUNCIONARIO' | 'ADMIN';
    is_active: boolean;
    // For NUMERIC
    numeric_min?: number | null;
    numeric_max?: number | null;
    numeric_unit?: string;
    // For CUSTOM
    custom_options?: AnswerOption[] | null;
    created_at?: string;
}

export interface Submission {
    id: number;
    unit: number;
    user: number;
    total_score: number;
    status: 'PENDING' | 'APPROVED';
    created_at?: string;
    answers?: Answer[];
}

export interface Answer {
    id?: number;
    question: number;
    value: number;
}

export interface CreateSubmissionPayload {
    answers: { question: number; value: number }[];
}

export interface RankingItem {
    id: number;
    name: string;
    rank: number;
    is_self: boolean;
    latest_score: number;
    lowest_category: string | null;
}
