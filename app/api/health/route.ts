import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    filesystem: {
      status: 'ok' | 'error';
      message?: string;
    };
    piston: {
      status: 'ok' | 'error';
      message?: string;
    };
  };
}

export async function GET() {
  const checks: HealthCheck['checks'] = {
    filesystem: { status: 'ok' },
    piston: { status: 'ok' },
  };

  // Check filesystem access
  try {
    const sourcesPath = join(process.cwd(), 'sources');
    if (!existsSync(sourcesPath)) {
      checks.filesystem = {
        status: 'error',
        message: 'Sources directory not found',
      };
    }
  } catch (error) {
    checks.filesystem = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Check Piston API availability
  try {
    const pistonUrl = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(pistonUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'python',
        version: '*',
        files: [{ content: 'print("health check")' }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      checks.piston = {
        status: 'error',
        message: `Piston API returned ${response.status}`,
      };
    }
  } catch (error) {
    checks.piston = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  const hasErrors = Object.values(checks).some(check => check.status === 'error');
  const status: HealthCheck['status'] = hasErrors ? 'degraded' : 'healthy';

  const healthCheck: HealthCheck = {
    status,
    timestamp: new Date().toISOString(),
    checks,
  };

  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: httpStatus });
}
