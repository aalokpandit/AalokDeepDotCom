#!/usr/bin/env node

const { execSync } = require('child_process');

function run(command) {
  console.log(`\n▶ ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function hasPrefix(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

function main() {
  const diffOutput = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const files = diffOutput
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  if (files.length === 0) {
    console.log('No staged files; skipping Husky checks.');
    return;
  }

  const sharedTouched = files.some((file) =>
    ['packages/ui', 'packages/types', 'packages/assets'].some((prefix) => hasPrefix(file, prefix))
  );

  const mainTouched =
    sharedTouched || files.some((file) => hasPrefix(file, 'apps/main-site'));
  const workbenchTouched =
    sharedTouched || files.some((file) => hasPrefix(file, 'apps/workbench'));
  const journalTouched =
    sharedTouched || files.some((file) => hasPrefix(file, 'apps/journal'));

  if (!mainTouched && !workbenchTouched && !journalTouched) {
    console.log('No app-impacting changes detected; skipping app builds.');
    return;
  }

  try {
    if (mainTouched) {
      run('npm run lint');
      run('npm run build');
    }

    if (workbenchTouched) {
      run('npm run lint:workbench');
      run('npx cross-env NEXT_PUBLIC_API_BASE=https://aalokdeep.com npm run build:workbench');
    }

    if (journalTouched) {
      run('npm run lint:journal');
      run('npx cross-env NEXT_PUBLIC_API_BASE=https://aalokdeep.com npm run build:journal');
    }
  } catch (error) {
    console.error('\nHusky checks failed.');
    process.exit(1);
  }
}

main();
