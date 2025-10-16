// lib/staticParams.ts
import { categorias, cursos, trilhas } from "@/data/academy/data-cursos"

// ===========================================
// CATEGORIAS
// ===========================================

export function generateCategoryParams() {
  const params = categorias.map((cat) => ({
    categorySlug: cat.slug 
  }));
  return params;
}

// ===========================================
// CURSOS
// ===========================================
export function generateCourseParams() {
  return cursos.map((curso) => ({
    courseSlug: curso.slug
  }))
}

// ===========================================
// AULAS (baseado nos módulos dos cursos)
// ===========================================
export function generateLessonParams() {
  const params: { courseSlug: string; lessonSlug: string }[] = []
  
  cursos.forEach((curso) => {
    if (curso.modulos && curso.modulos.length > 0) {
      curso.modulos.forEach((modulo) => {
        if (modulo.aulas && modulo.aulas.length > 0) {
          modulo.aulas.forEach((aula) => {
            params.push({
              courseSlug: curso.slug,
              lessonSlug: aula.slug
            })
          })
        }
      })
    }
  })
  
  return params
}

// ===========================================
// TRILHAS
// ===========================================
export function generateTrilhaParams() {
  return trilhas.map((trilha) => ({
    trilhaSlug: trilha.slug
  }))
}

// ===========================================
// CURSOS DENTRO DE TRILHAS
// ===========================================
export function generateTrilhaCourseParams() {
  const params: { trilhaSlug: string; courseSlug: string }[] = []
  
  trilhas.forEach((trilha) => {
    if (trilha.cursos && trilha.cursos.length > 0) {
      trilha.cursos.forEach((cursoId) => {
        // Encontrar o curso pelo ID
        const curso = cursos.find(c => c.id === Number(cursoId))
        if (curso) {
          params.push({
            trilhaSlug: trilha.slug,
            courseSlug: curso.slug
          })
        }
      })
    }
  })
  
  return params
}

// ===========================================
// AULAS DENTRO DE TRILHAS
// ===========================================
export function generateTrilhaLessonParams() {
  const params: { trilhaSlug: string; courseSlug: string; lessonSlug: string }[] = []
  
  trilhas.forEach((trilha) => {
    if (trilha.cursos && trilha.cursos.length > 0) {
      trilha.cursos.forEach((cursoId) => {
        // Encontrar o curso pelo ID
        const curso = cursos.find(c => c.id === Number(cursoId))
        if (curso && curso.modulos && curso.modulos.length > 0) {
          curso.modulos.forEach((modulo) => {
            if (modulo.aulas && modulo.aulas.length > 0) {
              modulo.aulas.forEach((aula) => {
                params.push({
                  trilhaSlug: trilha.slug,
                  courseSlug: curso.slug,
                  lessonSlug: aula.slug
                })
              })
            }
          })
        }
      })
    }
  })
  
  return params
}

// ===========================================
// TYPES AUXILIARES
// ===========================================
export type CategoryParams = { categorySlug: string }
export type CourseParams = { courseSlug: string }
export type LessonParams = { courseSlug: string; lessonSlug: string }
export type TrilhaParams = { trilhaSlug: string }
export type TrilhaCourseParams = { trilhaSlug: string; courseSlug: string }
export type TrilhaLessonParams = { trilhaSlug: string; courseSlug: string; lessonSlug: string }