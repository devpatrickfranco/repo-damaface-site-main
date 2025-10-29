import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const newsletter = (email: string) => {
    
  return api.post("newsletter", { email }); 
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}