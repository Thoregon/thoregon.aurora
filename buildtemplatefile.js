/*
 * Copyright (c) 2026.
 */

// scripts/build-templates.js

import { scanDirectory }          from '../../upayme-k8s/packagehelper/file-scanner.js';
import { generateTemplateModule } from '../../upayme-k8s/packagehelper/resource-builder.js';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '.');

// Configuration
const config = {
    scanDir: join(rootDir, ''),     // Directory to scan
    patterns: ['*.jst', '*.css'],   // File patterns
    outputDir: rootDir,             // Where to save templates.mjs
    outputFile: 'templates.mjs',    // Output filename
    routePrefix: '',                // Route prefix (empty = start from root)
    ignoreDirs: ['node_modules', 'dist', 'build', '.git']
};

// Main process
async function main() {
    console.log(`🔍 Scanning ${config.scanDir} for patterns: ${config.patterns.join(', ')}`);

    // 1. Scan files and get FileInfo objects
    const files = scanDirectory(config.scanDir, config.patterns, {
        ignoreDirs: config.ignoreDirs,
        recursive: true
    });

    console.log(`📁 Found ${files.length} files`);

    if (files.length === 0) {
        console.warn('⚠️ No files found!');
        return;
    }

    // 2. Generate templates.mjs from FileInfo objects
    generateTemplateModule(files, {
        outputDir: config.outputDir,
        outputFile: config.outputFile,
        importSuffix: '?raw',
        routePrefix: config.routePrefix
    });

    // Optional: Print preview
    console.log('\n📝 Preview:');
    files.slice(0, 3).forEach(file => {
        console.log(`   ${file.relativePath} -> /${file.relativePath}`);
    });
    if (files.length > 3) {
        console.log(`   ... and ${files.length - 3} more`);
    }
}
main().catch(console.error);
