/**
 * Removes `.next`. Unlinks a Windows junction/symlink without following it.
 * If OneDrive causes EINVAL readlink on `.next`, run: npm run clean && npm run dev
 * Long-term: clone outside OneDrive, or set the `.next` folder to “Always keep on this device”.
 */
const fs = require("node:fs");
const path = require("node:path");

const nextPath = path.join(__dirname, "..", ".next");

function rmDir(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

if (fs.existsSync(nextPath)) {
  try {
    const st = fs.lstatSync(nextPath);
    if (st.isSymbolicLink()) {
      fs.unlinkSync(nextPath);
    } else {
      rmDir(nextPath);
    }
  } catch {
    rmDir(nextPath);
  }
}
