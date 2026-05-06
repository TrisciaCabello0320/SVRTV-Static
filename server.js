import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getGoogleSheetsData } from './src/data/googleSheetsLoader.js';
import { DB } from './src/data/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Format database.js data to match Google Sheets structure
function formatDatabaseData() {
  return {
    org: {
      name: DB.general.org_name,
      tagline: DB.general.org_tagline,
      mission: DB.general.mission,
      vision: DB.general.vision,
    },
    contact: {
      email: DB.general.contact_email,
      phone: DB.general.contact_phone,
      address: DB.general.contact_address,
      hours: DB.general.contact_hours,
    },
    social: {
      facebook: DB.general.social_facebook,
      youtube: DB.general.social_youtube,
      instagram: DB.general.social_instagram,
    },
    team: DB.team,
    programs: DB.programs,
    gallery: DB.gallery,
    awards: DB.awards,
  };
}

// API Routes
app.get('/api/content', async (req, res) => {
  try {
    // Try Google Sheets first
    const gsData = await getGoogleSheetsData();

    if (gsData) {
      console.log('📊 Sending Google Sheets data');
      res.json(gsData);
    } else {
      // Fallback to database.js
      console.log('📄 Sending database.js data (fallback)');
      res.json(formatDatabaseData());
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    hasGoogleSheets: !!process.env.GOOGLE_SHEETS_KEY_PATH
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Content endpoint: http://localhost:${PORT}/api/content`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

