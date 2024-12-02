export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleError = (error: unknown): { message: string; status: number } => {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.statusCode
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    }
  }

  return {
    message: 'An unknown error occurred',
    status: 500
  }
}