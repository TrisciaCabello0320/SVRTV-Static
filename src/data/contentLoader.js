import { DB } from './database';

export async function loadContent() {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('❌ API fetch failed:', err.message);
    console.log('📌 Falling back to database.js local sync.');
    return {
      org: {
        name:    DB.general.org_name,
        tagline: DB.general.org_tagline,
        mission: DB.general.mission,
        vision:  DB.general.vision,
      },
      contact: {
        email:   DB.general.contact_email,
        phone:   DB.general.contact_phone,
        address: DB.general.contact_address,
        hours:   DB.general.contact_hours,
      },
      social: {
        facebook:  DB.general.social_facebook,
        youtube:   DB.general.social_youtube,
        instagram: DB.general.social_instagram,
        pcnc:      DB.general.pcnc_url,
      },
      team:     DB.team,
      programs: DB.programs,
      gallery:  DB.gallery,
      awards:   DB.awards,
    };
  }
}
