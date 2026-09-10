import { describe, it, expect } from 'vitest'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { apiClient, ApiError } from '../api/client'
import { problemDetailFactory } from './factories'

describe('ApiError', () => {
  it('uses detail as the Error message when present', () => {
    const problem = problemDetailFactory.buildValidation({ cnpj: 'CNPJ inválido' })
    const error = new ApiError(problem)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.message).toBe('Um ou mais campos são inválidos')
  })

  it('falls back to title when detail is absent', () => {
    const problem = problemDetailFactory.buildServerError()
    const error = new ApiError(problem)

    expect(error.message).toBe('Erro interno do servidor')
  })

  it('exposes the full ProblemDetail on problemDetail property', () => {
    const problem = problemDetailFactory.buildValidation({
      cnpj: 'CNPJ inválido',
      corporateName: 'Razão social é obrigatória',
    })
    const error = new ApiError(problem)

    expect(error.problemDetail.status).toBe(422)
    expect(error.problemDetail.errors?.cnpj).toBe('CNPJ inválido')
    expect(error.problemDetail.errors?.corporateName).toBe('Razão social é obrigatória')
  })

  it('stores a 409 conflict ProblemDetail correctly', () => {
    const problem = problemDetailFactory.buildConflict('CNPJ já cadastrado')
    const error = new ApiError(problem)

    expect(error.problemDetail.status).toBe(409)
    expect(error.problemDetail.detail).toBe('CNPJ já cadastrado')
    expect(error.problemDetail.title).toBe('Regra de negócio violada')
  })
})

describe('apiClient response interceptor', () => {
  async function withAdapter(
    stub: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>,
    fn: () => Promise<void>
  ) {
    const original = apiClient.defaults.adapter
    apiClient.defaults.adapter = stub as unknown as typeof original
    try {
      await fn()
    } finally {
      apiClient.defaults.adapter = original
    }
  }

  it('passes through 2xx responses unchanged', async () => {
    await withAdapter(
      async (config) => ({ data: { id: 1 }, status: 200, statusText: 'OK', headers: {}, config }),
      async () => {
        const response = await apiClient.get('/test')
        expect(response.data).toEqual({ id: 1 })
      }
    )
  })

  it('converts a RFC 7807 409 body into ApiError with the correct status and detail', async () => {
    const problem = problemDetailFactory.buildConflict('CNPJ já cadastrado')

    await withAdapter(
      async (config) => {
        throw Object.assign(new Error('Request failed with status code 409'), {
          response: { data: problem, status: 409, statusText: 'Conflict', headers: {}, config },
        })
      },
      async () => {
        await expect(apiClient.get('/test')).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError)
          const apiErr = err as ApiError
          expect(apiErr.problemDetail.status).toBe(409)
          expect(apiErr.problemDetail.detail).toBe('CNPJ já cadastrado')
          return true
        })
      }
    )
  })

  it('converts a RFC 7807 422 body into ApiError and preserves the errors map', async () => {
    const problem = problemDetailFactory.buildValidation({ chassis: 'Chassi deve ter 17 caracteres válidos' })

    await withAdapter(
      async (config) => {
        throw Object.assign(new Error('Request failed with status code 422'), {
          response: { data: problem, status: 422, statusText: 'Unprocessable Entity', headers: {}, config },
        })
      },
      async () => {
        await expect(apiClient.get('/test')).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError)
          const apiErr = err as ApiError
          expect(apiErr.problemDetail.errors?.chassis).toBe('Chassi deve ter 17 caracteres válidos')
          return true
        })
      }
    )
  })

  it('converts a RFC 7807 404 body into ApiError', async () => {
    const problem = problemDetailFactory.buildNotFound('Veículo 999 não encontrado')

    await withAdapter(
      async (config) => {
        throw Object.assign(new Error('Request failed with status code 404'), {
          response: { data: problem, status: 404, statusText: 'Not Found', headers: {}, config },
        })
      },
      async () => {
        await expect(apiClient.get('/test')).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError)
          const apiErr = err as ApiError
          expect(apiErr.problemDetail.status).toBe(404)
          expect(apiErr.problemDetail.detail).toBe('Veículo 999 não encontrado')
          return true
        })
      }
    )
  })

  it('wraps a network error in a fallback ApiError with status 500', async () => {
    await withAdapter(
      async (config) => {
        throw Object.assign(new Error('Network Error'), { config })
      },
      async () => {
        await expect(apiClient.get('/test')).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError)
          const apiErr = err as ApiError
          expect(apiErr.problemDetail.status).toBe(500)
          expect(apiErr.problemDetail.title).toBe('Erro de comunicação')
          expect(apiErr.problemDetail.detail).toBe('Network Error')
          return true
        })
      }
    )
  })

  it('treats a non-ProblemDetail response body as a fallback error', async () => {
    await withAdapter(
      async (config) => {
        throw Object.assign(new Error('Request failed with status code 503'), {
          response: { data: '<html>Bad Gateway</html>', status: 503, statusText: 'Bad Gateway', headers: {}, config },
        })
      },
      async () => {
        await expect(apiClient.get('/test')).rejects.toSatisfy((err: unknown) => {
          expect(err).toBeInstanceOf(ApiError)
          const apiErr = err as ApiError
          expect(apiErr.problemDetail.status).toBe(503)
          expect(apiErr.problemDetail.title).toBe('Erro de comunicação')
          return true
        })
      }
    )
  })
})
