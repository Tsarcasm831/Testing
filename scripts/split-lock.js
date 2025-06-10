const fs = require('fs');
const path = require('path');

/**
 * Split package-lock.json into individual package files for easier inspection.
 * Files are written to the package-lock-split directory.
 */
function splitLock() {
  const lockPath = path.join(process.cwd(), 'package-lock.json');
  const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));


  const outDir = path.join(process.cwd(), 'package-lock-split');
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });


  const outDir = path.join(process.cwd(), 'package-lock-split');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const packages = lockData.packages || {};
  for (const [pkgPath, pkgInfo] of Object.entries(packages)) {
    const fileName = pkgPath === '' ? 'root.json' : `${pkgPath.replace(/[\\/]/g, '_')}.json`;
    fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(pkgInfo, null, 2));
  }


  // remove detailed package data from the lock file and keep only root info
  lockData.packages = {};
  if (packages['']) {
    lockData.packages[''] = packages[''];
  }
  fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));

}

splitLock();
