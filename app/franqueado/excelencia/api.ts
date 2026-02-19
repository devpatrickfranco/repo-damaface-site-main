import { apiBackend } from "@/lib/api-backend";
import { Question, Submission, CreateSubmissionPayload, RankingItem, Category } from "./types";

const BASE_URL = "/excelencia";

export const excelenciaApi = {
    getQuestions: async (params?: { target_role?: string; is_active?: boolean }): Promise<Question[]> => {
        const queryParams = new URLSearchParams();
        if (params?.target_role) queryParams.append("target_role", params.target_role);
        if (params?.is_active !== undefined) queryParams.append("is_active", String(params.is_active));

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
        return apiBackend.get<Question[]>(`${BASE_URL}/questions/${queryString}`);
    },

    getCategories: async (): Promise<Category[]> => {
        return apiBackend.get<Category[]>(`${BASE_URL}/categories/`);
    },

    getSubmissions: async (): Promise<Submission[]> => {
        // Queries can be added later if needed (e.g., page, limit)
        return apiBackend.get<Submission[]>(`${BASE_URL}/submissions/`);
    },

    createSubmission: async (payload: CreateSubmissionPayload): Promise<Submission> => {
        return apiBackend.post<Submission>(`${BASE_URL}/submissions/`, payload);
    },

    getSubmissionById: async (id: number): Promise<Submission> => {
        return apiBackend.get<Submission>(`${BASE_URL}/submissions/${id}/`);
    },

    getRanking: async (): Promise<RankingItem[]> => {
        return apiBackend.get<RankingItem[]>(`${BASE_URL}/ranking/`);
    },

    // Admin methods
    createQuestion: async (data: any): Promise<Question> => {
        return apiBackend.post<Question>(`${BASE_URL}/questions/`, data);
    },

    updateQuestion: async (id: number, data: any): Promise<Question> => {
        return apiBackend.put<Question>(`${BASE_URL}/questions/${id}/`, data);
    },

    deleteQuestion: async (id: number): Promise<void> => {
        return apiBackend.delete(`${BASE_URL}/questions/${id}/`);
    },
    // Category methods
    createCategory: async (data: any): Promise<Category> => {
        return apiBackend.post<Category>(`${BASE_URL}/categories/`, data);
    },

    updateCategory: async (id: number, data: any): Promise<Category> => {
        return apiBackend.put<Category>(`${BASE_URL}/categories/${id}/`, data);
    },

    deleteCategory: async (id: number): Promise<void> => {
        return apiBackend.delete(`${BASE_URL}/categories/${id}/`);
    },

    // Answer Template methods
    getAnswerTemplates: async (): Promise<any[]> => {
        return apiBackend.get<any[]>(`${BASE_URL}/answer-templates/`);
    },

    createAnswerTemplate: async (data: any): Promise<any> => {
        return apiBackend.post<any>(`${BASE_URL}/answer-templates/`, data);
    },

    updateAnswerTemplate: async (id: number, data: any): Promise<any> => {
        return apiBackend.put<any>(`${BASE_URL}/answer-templates/${id}/`, data);
    },

    deleteAnswerTemplate: async (id: number): Promise<void> => {
        return apiBackend.delete(`${BASE_URL}/answer-templates/${id}/`);
    },
};
