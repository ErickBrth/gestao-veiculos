import axios, { type AxiosError } from 'axios'
import type { ProblemDetail } from '../types'

export class ApiError extends Error {
  public problemDetail: ProblemDetail

  constructor(problemDetail: ProblemDetail) {
    super(problemDetail.detail || problemDetail.title || 'Erro na requisição')
    this.name = 'ApiError'
    this.problemDetail = problemDetail
  }
}

export const apiClient = axios.create({
  baseURL: '', // Using Vite proxy to avoid CORS in dev, and relative in container
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetail>) => {
    if (error.response?.data && typeof error.response.data === 'object' && 'title' in error.response.data) {
      return Promise.reject(new ApiError(error.response.data))
    }
    const fallback: ProblemDetail = {
      title: 'Erro de comunicação',
      status: error.response?.status || 500,
      detail: error.message || 'Falha ao conectar com o servidor.',
    }
    return Promise.reject(new ApiError(fallback))
  }
)
