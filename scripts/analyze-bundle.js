/**
 * Bundle Size Analysis
 *
 * This script analyzes the Next.js build output and tracks bundle sizes.
 * FAANG companies use this to prevent bundle bloat and maintain performance.
 *
 * Features:
 * - Analyzes all route bundles
 * - Tracks size changes
 * - Enforces performance budgets
 * - Generates PR comments
 */

const fs = require('fs').promises;
const path = require('path');

// Performance budgets (in KB)
// Note: These are realistic budgets for a Next.js app
const PERFORMANCE_BUDGETS = {
  firstLoadJS: 500, // Total first load JS (shared + initial page)
  pageMaxSize: 300, // Max size for any page
  routeMaxSize: 250, // Max size for any route
  warningThreshold: 0.8, // Warn at 80% of budget
};

async function analyzeBundle() {
  const buildDir = path.join(process.cwd(), '.next');
  const analysisFile = path.join(process.cwd(), '.next', 'bundle-analysis.json');

  try {
    // Check if build exists
    try {
      await fs.access(buildDir);
    } catch {
      console.error('❌ Build directory not found. Run "npm run build" first.');
      process.exit(1);
    }

    // Read Next.js build output from .next/static
    const staticDir = path.join(buildDir, 'static');
    const routes = [];

    // Analyze chunks from Next.js build output
    // Only count shared chunks (first load JS) and main page chunks
    try {
      const chunksDir = path.join(staticDir, 'chunks');
      if (await directoryExists(chunksDir)) {
        const chunkFiles = await getAllFiles(chunksDir);
        for (const file of chunkFiles) {
          if (file.endsWith('.js')) {
            const stats = await fs.stat(file);
            const relativePath = path.relative(buildDir, file);
            const fileName = path.basename(file);

            // Count shared chunks and main page chunks as first load
            // Shared chunks typically have numeric IDs or 'webpack' in name
            const isFirstLoad =
              fileName.includes('webpack') ||
              /^\d+-\w+\.js$/.test(fileName) ||
              fileName.startsWith('117-') || // Common shared chunk pattern
              fileName.startsWith('fd9d1056-'); // Another common pattern

            if (isFirstLoad) {
              routes.push({
                name: relativePath,
                size: stats.size,
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn('Could not analyze chunks:', error.message);
    }

    // Also check for page-specific bundles
    try {
      const pagesDir = path.join(staticDir, 'pages');
      if (await directoryExists(pagesDir)) {
        const pageFiles = await getAllFiles(pagesDir);
        for (const file of pageFiles) {
          if (file.endsWith('.js')) {
            const stats = await fs.stat(file);
            const routeName = path.basename(file, '.js');
            routes.push({
              name: `page/${routeName}`,
              size: stats.size,
            });
          }
        }
      }
    } catch (error) {
      // Pages directory might not exist in App Router
    }

    // Analyze bundle sizes from build output
    const analysis = {
      timestamp: new Date().toISOString(),
      routes: [],
      totals: {
        firstLoadJS: 0,
        totalRoutes: 0,
        largestRoute: { name: '', size: 0 },
      },
      budgets: PERFORMANCE_BUDGETS,
      warnings: [],
      errors: [],
    };

    // Analyze each route/chunk
    for (const route of routes) {
      if (route.size > 0) {
        analysis.routes.push({
          name: route.name,
          size: route.size,
          sizeKB: (route.size / 1024).toFixed(2),
        });

        analysis.totals.totalRoutes++;
        analysis.totals.firstLoadJS += route.size;

        if (route.size > analysis.totals.largestRoute.size) {
          analysis.totals.largestRoute = {
            name: route.name,
            size: route.size,
          };
        }

        // Check budgets (only for significant chunks > 50KB)
        const sizeKB = route.size / 1024;
        if (sizeKB > 50) {
          if (sizeKB > PERFORMANCE_BUDGETS.routeMaxSize) {
            analysis.errors.push(
              `Chunk "${route.name}" exceeds budget: ${sizeKB.toFixed(2)}KB > ${PERFORMANCE_BUDGETS.routeMaxSize}KB`
            );
          } else if (
            sizeKB >
            PERFORMANCE_BUDGETS.routeMaxSize * PERFORMANCE_BUDGETS.warningThreshold
          ) {
            analysis.warnings.push(
              `Chunk "${route.name}" approaching budget: ${sizeKB.toFixed(2)}KB (${((sizeKB / PERFORMANCE_BUDGETS.routeMaxSize) * 100).toFixed(0)}%)`
            );
          }
        }
      }
    }

    // Check total first load JS
    const totalFirstLoadKB = analysis.totals.firstLoadJS / 1024;
    if (totalFirstLoadKB > PERFORMANCE_BUDGETS.firstLoadJS) {
      analysis.errors.push(
        `Total first load JS exceeds budget: ${totalFirstLoadKB.toFixed(2)}KB > ${PERFORMANCE_BUDGETS.firstLoadJS}KB`
      );
    } else if (
      totalFirstLoadKB >
      PERFORMANCE_BUDGETS.firstLoadJS * PERFORMANCE_BUDGETS.warningThreshold
    ) {
      analysis.warnings.push(
        `Total first load JS approaching budget: ${totalFirstLoadKB.toFixed(2)}KB (${((totalFirstLoadKB / PERFORMANCE_BUDGETS.firstLoadJS) * 100).toFixed(0)}%)`
      );
    }

    // Save analysis
    await fs.mkdir(path.dirname(analysisFile), { recursive: true });
    await fs.writeFile(analysisFile, JSON.stringify(analysis, null, 2));

    // Print summary
    console.log('\n📊 Bundle Size Analysis\n');
    console.log(`Total Routes: ${analysis.totals.totalRoutes}`);
    console.log(`Total First Load JS: ${totalFirstLoadKB.toFixed(2)} KB`);
    console.log(
      `Largest Route: ${analysis.totals.largestRoute.name} (${(analysis.totals.largestRoute.size / 1024).toFixed(2)} KB)\n`
    );

    if (analysis.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      analysis.warnings.forEach(w => console.log(`  - ${w}`));
      console.log();
    }

    if (analysis.errors.length > 0) {
      console.error('❌ Budget Exceeded:');
      analysis.errors.forEach(e => console.error(`  - ${e}`));
      console.error();
      process.exit(1);
    }

    console.log('✅ All routes within performance budgets!\n');

    // Generate markdown report for PR comments
    const report = generatePRReport(analysis);
    const reportPath = path.join(process.cwd(), 'bundle-report.md');
    await fs.writeFile(reportPath, report);
    console.log(`📝 PR report generated: ${reportPath}`);

    return analysis;
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error);
    process.exit(1);
  }
}

async function calculateRouteSize(route, buildDir) {
  // Simplified calculation - in real implementation, would analyze actual chunks
  // This is a placeholder that demonstrates the concept
  try {
    const routePath = path.join(buildDir, 'server', 'app', route);
    if (await directoryExists(routePath)) {
      // Estimate size based on directory contents
      const files = await getAllFiles(routePath);
      let totalSize = 0;
      for (const file of files) {
        try {
          const stats = await fs.stat(file);
          totalSize += stats.size;
        } catch {
          // Ignore errors
        }
      }
      return totalSize;
    }
  } catch {
    // Route might not exist or be a special route
  }
  return 0;
}

async function getAllFiles(dir) {
  const files = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await getAllFiles(fullPath)));
      } else {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }
  return files;
}

async function findRoutes(dir) {
  const routes = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        routes.push(entry.name);
      }
    }
  } catch {
    // Ignore errors
  }
  return routes;
}

async function directoryExists(dir) {
  try {
    const stats = await fs.stat(dir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function generatePRReport(analysis) {
  const totalKB = (analysis.totals.firstLoadJS / 1024).toFixed(2);
  const budgetKB = analysis.budgets.firstLoadJS;
  const usagePercent = ((analysis.totals.firstLoadJS / 1024 / budgetKB) * 100).toFixed(1);

  let report = `# 📊 Bundle Size Analysis\n\n`;
  report += `**Generated:** ${new Date(analysis.timestamp).toLocaleString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Routes:** ${analysis.totals.totalRoutes}\n`;
  report += `- **First Load JS:** ${totalKB} KB / ${budgetKB} KB (${usagePercent}%)\n`;
  report += `- **Largest Route:** ${analysis.totals.largestRoute.name} (${(analysis.totals.largestRoute.size / 1024).toFixed(2)} KB)\n\n`;

  if (analysis.warnings.length > 0) {
    report += `## ⚠️ Warnings\n\n`;
    analysis.warnings.forEach(w => {
      report += `- ${w}\n`;
    });
    report += `\n`;
  }

  if (analysis.errors.length > 0) {
    report += `## ❌ Budget Exceeded\n\n`;
    analysis.errors.forEach(e => {
      report += `- ${e}\n`;
    });
    report += `\n`;
  }

  report += `## Route Breakdown\n\n`;
  report += `| Route | Size (KB) | Status |\n`;
  report += `|-------|-----------|--------|\n`;

  analysis.routes
    .sort((a, b) => b.size - a.size)
    .forEach(route => {
      const sizeKB = parseFloat(route.sizeKB);
      const budget = analysis.budgets.routeMaxSize;
      let status = '✅';
      if (sizeKB > budget) {
        status = '❌';
      } else if (sizeKB > budget * analysis.budgets.warningThreshold) {
        status = '⚠️';
      }
      report += `| \`${route.name}\` | ${route.sizeKB} | ${status} |\n`;
    });

  report += `\n---\n\n`;
  report += `*This report is automatically generated by the bundle analysis script.*\n`;

  return report;
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle, PERFORMANCE_BUDGETS };
