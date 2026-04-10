const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateKeys() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  const encryptionKey = crypto.randomBytes(32).toString('hex');
  const nextAuthSecret = crypto.randomBytes(32).toString('base64');

  const envPath = path.join(process.cwd(), '.env');
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

  const secrets = `
# Security Keys
ENCRYPTION_KEY="${encryptionKey}"
NEXTAUTH_SECRET="${nextAuthSecret}"
NEXTAUTH_URL="http://localhost:3000"

# JWT RS256 Keys (JSON escaped)
JWT_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"
JWT_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexus?schema=public"

# AI Backend
AGENT_BACKEND_URL="http://127.0.0.1:8000/process_step"
`;

  fs.writeFileSync(envPath, envContent + secrets);
  console.log('Successfully generated keys and updated .env');
}

generateKeys();
