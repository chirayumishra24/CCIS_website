import fs from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'alumni-cache.json');
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAlumniCache(school: string | null): any[] | null {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const stats = fs.statSync(CACHE_FILE_PATH);
      if (Date.now() - stats.mtimeMs < CACHE_TTL) {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        const cacheData = JSON.parse(fileContent);
        const key = school || 'all';
        if (cacheData[key]) {
          console.log(`[Cache Hit] Serving alumni list for school: ${key} from persistent file cache.`);
          return cacheData[key];
        }
      }
    }
  } catch (error) {
    console.error('Failed to read alumni cache file:', error);
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setAlumniCache(school: string | null, data: any[]) {
  try {
    const key = school || 'all';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cacheData: { [key: string]: any[] } = {};
    
    if (fs.existsSync(CACHE_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
        cacheData = JSON.parse(fileContent);
      } catch {
        // file empty or invalid, overwrite
      }
    }
    
    cacheData[key] = data;
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData), 'utf8');
    console.log(`[Cache Write] Saved alumni list for school: ${key} to persistent file cache.`);
  } catch (error) {
    console.error('Failed to write alumni cache file:', error);
  }
}

export function invalidateAlumniCache() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
      console.log('[Cache Invalidation] Deleted alumni cache file.');
    }
  } catch (error) {
    console.error('Failed to delete alumni cache file:', error);
  }
}
