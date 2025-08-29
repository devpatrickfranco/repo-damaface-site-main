import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const newsletter = (email: string) => {
    
  return api.post("newsletter", { email }); 
};
