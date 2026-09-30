// Preserve the installed runtime dependency notices in the deployed static site.
import fs from 'node:fs';
import path from 'node:path';
const seen = new Set();
const notices = [];
function visit(name) {
  if (seen.has(name)) return;
  seen.add(name);
  const directory = path.resolve('node_modules', name);
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  const licenseFiles = fs
    .readdirSync(directory)
    .filter((file) => /^licen[cs]e(?:\.|$)/i.test(file));
  const notice = licenseFiles
    .map((file) => fs.readFileSync(path.join(directory, file), 'utf8'))
    .join('\n');
  notices.push(
    `${name}@${manifest.version}\nLicense: ${manifest.license || 'See package documentation'}\n${notice || 'See original package repository for license terms.'}`,
  );
  for (const dependency of Object.keys(manifest.dependencies || {})) visit(dependency);
}
const project = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const dependency of Object.keys(project.dependencies)) visit(dependency);
fs.mkdirSync('public/licenses', { recursive: true });
fs.writeFileSync('public/licenses/THIRD-PARTY.txt', notices.join('\n\n' + '='.repeat(72) + '\n\n'));
console.log(`Preserved notices for ${seen.size} runtime packages.`);
