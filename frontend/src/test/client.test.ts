import { describe, it, expect } from 'vitest'
import { apiClient, ApiError } from '../api/client'
import { problemDetailFactory } from './factories'

describe('apiClient and ApiError', () => {
  it('instantiates ApiError with ProblemDetail attributes', () => {
    const problem = problemDetailFactory.buildValidation({
      cnpj: 'CNPJ inválido',
    })
    const error = new ApiError(problem)

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('ApiError')
    expect(error.message).toBe('Um ou mais campos são inválidos')
    expect(error.problemDetail.status).toBe(422)
    expect(error.problemDetail.errors?.cnpj).toBe('CNPJ inválido')
  })

  it('falls back to problem title when detail is missing', () => {
    const error = new ApiError({
      title: 'Erro inesperado',
      status: 500,
    })
    expect(error.message).toBe('Erro inesperado')
  })

  it('passes through successful responses', async () => {
    const originalAdapter = apiClient.defaults.adapter
    apiClient.defaults.adapter = async (config) => ({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })

    const response = await apiClient.get('/test')
    expect(response.data).toEqual({ success: true })

    apiClient.defaults.adapter = originalAdapter
  })

  it('transforms RFC 7807 ProblemDetail response errors into ApiError', async () => {
    const originalAdapter = apiClient.defaults.adapter
    const problem = problemDetailFactory.buildConflict('CNPJ já cadastrado')

    apiClient.defaults.adapter = async (config) => {
      const error = Object.assign(new Error('Request failed with status code 409'), {
        response: {
          data: problem,
          status: 409,
          statusText: 'Conflict',
          headers: {},
          config,
        },
      })
      throw error
    }

    await expect(apiClient.get('/test')).rejects.toThrow(ApiError)

    try {
      await apiClient.get('/test')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.problemDetail.status).toBe(409)
      expect(apiErr.problemDetail.detail).toBe('CNPJ já cadastrado')
    }

    apiClient.defaults.adapter = originalAdapter
  })

  it('transforms unknown network errors into fallback ApiError', async () => {
    const originalAdapter = apiClient.defaults.adapter

    apiClient.defaults.adapter = async (config) => {
      const error = Object.assign(new Error('Network Error'), { config })
      throw error
    }

    try {
      await apiClient.get('/test')
      expect.unreachable('Should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      const apiErr = err as ApiError
      expect(apiErr.problemDetail.status).toBe(500)
      expect(apiErr.problemDetail.detail).toBe('Network Error')
      expect(apiErr.problemDetail.title).toBe('Erro de comunicação')
    }

    apiClient.defaults.adapter = originalAdapter
  })
})
