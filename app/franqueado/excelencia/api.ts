import { apiBackend } from "@/lib/api-backend";
import { Question, Submission, CreateSubmissionPayload, RankingItem } from "./types";

const BASE_URL = "/excelencia";

export const excelenciaApi = {
    getQuestions: async (): Promise<Question[]> => {
        return apiBackend.get<Question[]>(`${BASE_URL}/questions/`);
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
};
