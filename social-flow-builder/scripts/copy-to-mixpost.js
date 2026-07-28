/**
 * Copies Vite lib output (dist/) into hype-engine so the dashboard
 * design page can load /modules/flow-builder/flow-builder.css and flow-builder.umd.cjs.
 *
 * Run after: npm run build:lib
 * Or use:    npm run build:mixpost
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const distDir = join(repoRoot, 'dist');
const targetDir = join(repoRoot, '..', 'public', 'modules', 'flow-builder');

function assertDistReady() {
    if (!existsSync(distDir)) {
        console.error('Missing dist/. Run: npm run build:lib');
        process.exit(1);
    }
    const entries = readdirSync(distDir);
    if (entries.length === 0) {
        console.error('dist/ is empty. Run: npm run build:lib');
        process.exit(1);
    }
}

function emptyDir(dir) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) {
            rmSync(p, { recursive: true });
        } else {
            rmSync(p);
        }
    }
}

assertDistReady();
mkdirSync(targetDir, { recursive: true });
emptyDir(targetDir);
cpSync(distDir, targetDir, { recursive: true });

console.log('Flow builder assets copied to:', targetDir);
readdirSync(targetDir).forEach((f) => console.log('  ', f));
