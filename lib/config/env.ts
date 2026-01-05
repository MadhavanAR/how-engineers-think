/**
 * Environment variable configuration and validation
 */

const requiredEnvVars = [] as const;
const optionalEnvVars = ['PISTON_API_URL'] as const;

export const env = {
  pistonApiUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;

/**
 * Validates that all required environment variables are set
 */
export function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Validate on module load in production
if (env.isProduction) {
  validateEnv();
}

