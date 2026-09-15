const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PASS = process.env.FTP_PASS;
const FTP_DIR = process.env.FTP_DIR;

const LOCAL_DIR = path.join(__dirname, "out");

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    if (!fs.existsSync(LOCAL_DIR)) {
      console.error(
        '❌ "out" directory not found. Run "npm run build" first (with static export enabled).'
      );
      process.exit(1);
    }

    console.log(`🔌 Connecting to ${FTP_HOST}...`);
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false,
    });

    console.log(`📂 Navigating to ${FTP_DIR}...`);
    await client.ensureDir(FTP_DIR);

    console.log("🚀 Uploading files...");
    await client.uploadFromDir(LOCAL_DIR, FTP_DIR);

    console.log("✅ Deployment complete!");
  } catch (err) {
    console.error("❌ FTP deployment failed:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
