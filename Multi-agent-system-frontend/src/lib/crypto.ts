import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Robust key handling: sanitize environment variable
const getEncryptionKey = () => {
  let keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables');
  }
  
  // Sanitize: remove quotes and whitespace
  keyHex = keyHex.replace(/['"]/g, '').trim();
  
  if (keyHex.length !== 64) {
    console.error('Current ENCRYPTION_KEY length:', keyHex.length);
    throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)');
  }
  
  return Buffer.from(keyHex, 'hex');
};

export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Output: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Could not encrypt data');
  }
}

export function decrypt(data: string): string {
  try {
    const key = getEncryptionKey();
    const [ivHex, authTagHex, encryptedText] = data.split(':');
    
    if (!ivHex || !authTagHex || !encryptedText) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed. Data received was likely encrypted with a different key.');
    throw new Error('Could not decrypt data');
  }
}
