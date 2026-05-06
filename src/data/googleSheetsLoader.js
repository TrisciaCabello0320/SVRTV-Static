import Papa from 'papaparse';

// The Google Sheet editor spreadsheet
const SPREADSHEET_ID = '1MXkRmC0OUMmuGVWXj67Y_sCjVSEG-JhmYFBsWU9gufk';

// Removed fetchPublicSheet in favor of fetchWithFallbacks

async function performFetch(name) {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const csvContent = await response.text();
    return Papa.parse(csvContent, { header: false }).data;
  } catch (e) { return null; }
}

function isValidSheet(requestedName, data) {
  if (!data || data.length === 0) return false;
  const firstCell = String(data[0][0] || '').toUpperCase();
  const isHero = firstCell.includes('HERO SECTION') || firstCell.includes('HERO TAB');
  // It's valid if it's the Hero sheet we wanted, OR if it's NOT Hero data (meaning it's likely the right sub-sheet)
  if (requestedName.toLowerCase().includes('hero')) return isHero;
  return !isHero;
}

async function fetchWithFallbacks(primaryName, fallbacks = []) {
  const names = [primaryName, ...fallbacks];
  for (const name of names) {
    const data = await performFetch(name);
    if (data && isValidSheet(name, data)) {
      if (name !== primaryName) {
        console.info(`ℹ Resolved "${primaryName}" using fallback name: "${name}"`);
      }
      return data;
    }
  }
  console.warn(`❌ Could not resolve sheet: "${primaryName}". All fallbacks failed.`);
  return null;
}

/**
 * Fetch all content natively from the public Google Sheet using the CSV export endpoint.
 */
export async function getGoogleSheetsData() {
  const [
    heroRows,
    wwaRows,
    teamRows,
    whatWeDoRows,
    programsRows,
    contactRows,
    generalRows
  ] = await Promise.all([
    fetchWithFallbacks('Hero Tab', ['Hero', '🏠 Hero Tab', 'Hero Section']),
    fetchWithFallbacks('Who We Are tab', ['Who we are', 'Who We Are', 'WhoWeAre', 'About Us', '✝ Who We Are tab']),
    fetchWithFallbacks('Team Leadership tab', ['Team Leadership', 'Team', '👥 Team Leadership tab', 'Leadership']),
    fetchWithFallbacks('What We Do tab', ['What we do', 'What We Do', 'WhatWeDo', '📷 What We Do tab', 'Gallery']),
    fetchWithFallbacks('Programs & Events tab', ['Programs & Events', 'Programs', '📅 Programs & Events tab', 'Events']),
    fetchWithFallbacks('Contact Us tab', ['Contact US', 'Contact Us', 'Contact', '📞 Contact Us tab']),
    fetchWithFallbacks('General tab', ['General', '⚙ General tab', 'Settings'])
  ]);

  const data = {
    hero: {},
    wwa: {},
    team: [],
    whatWeDo: { photos: [], videos: [], platforms: [] },
    programs: { list: [], featured: null },
    contact: {},
    social: {},
    footer: {},
    accred: {},
    general: {},
  };

  if (heroRows) parseKeyValueSheet(heroRows, data.hero);
  if (wwaRows) parseKeyValueSheet(wwaRows, data.wwa);
  if (teamRows) data.team = parseTeamSheet(teamRows);
  if (whatWeDoRows) data.whatWeDo = parseWhatWeDoSheet(whatWeDoRows);
  if (programsRows) data.programs = parseProgramsSheet(programsRows);
  if (contactRows) parseContactSheet(contactRows, data);
  if (generalRows) parseGeneralSheet(generalRows, data.general);

  console.log('✅ Data loaded seamlessly from FULL Google Sheets CMS!');
  return data;
}

// ── Sheet Parsers ─────────────────────────────────────────────────────────────

/**
 * Generic parser for Key-Value style sheets (Hero, Who We Are)
 * Expects Row 0-2 as headers, data starts at Row 3
 * Field Key in Col 0, Value in Col 1, Active in Col 4
 */
function parseKeyValueSheet(rows, targetObj) {
  // Key-Value sheets usually have headers in rows 0-2
  rows.slice(2).forEach(row => {
    const field = (row[0] || '').trim();
    const value = (row[1] || '').trim();
    
    // Support both 5-column and 6-column formats by checking index 4 and 5 for 'Yes'
    const active4 = (row[4] || '').trim().toLowerCase();
    const active5 = (row[5] || '').trim().toLowerCase();
    const isActive = active4 === 'yes' || active5 === 'yes';

    if (field && isActive && !field.startsWith('▸')) {
      targetObj[field] = value;
    }
  });
}

function parseTeamSheet(rows) {
  const FALLBACK_PORTRAITS = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop"
  ];

  // Team sheet has headers in rows 0-2
  return rows.slice(2) 
    .filter(row => {
      // Check for 'Yes' in column index 8 (Active) or 7 (Featured as fallback for active)
      const active = (row[8] || '').trim().toLowerCase();
      const name = (row[1] || '').trim();
      return name && active === 'yes';
    })
    .map(row => {
      const name = (row[1] || '').trim();
      const image = (row[3] || '').trim();
      
      // Deterministic fallback based on name to avoid flickering
      const fallbackIdx = Math.abs(name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % FALLBACK_PORTRAITS.length;
      
      return {
        sort:     parseInt(row[0]) || 99,
        name,
        role:     (row[2] || '').trim(),
        image:    image || FALLBACK_PORTRAITS[fallbackIdx],
        badge:    (row[4] || '').trim(),
        dept:     (row[5] || '').trim(),
        quote:    (row[6] || '').trim(),
        featured: (row[7] || '').trim().toLowerCase() === 'yes',
      };
    })
    .sort((a, b) => a.sort - b.sort);
}

function parseWhatWeDoSheet(rows) {
  const result = { photos: [], videos: [], platforms: [] };
  rows.slice(2)
    .filter(row => (row[8] || '').trim().toLowerCase() === 'yes') // Active = Yes
    .forEach(row => {
      const type = (row[2] || '').trim().toLowerCase();
      const item = {
        sort: parseInt(row[0]) || 99,
        title: (row[1] || '').trim(),
        url: (row[3] || '').trim(),
        desc: (row[4] || '').trim(),
        btnLabel: (row[5] || '').trim(),
        btnColor: (row[6] || '').trim(),
        badge: (row[7] || '').trim(),
      };

      if (type === 'photo') result.photos.push(item);
      else if (type === 'video') result.videos.push(item);
      else if (type === 'platform') result.platforms.push(item);
    });

  result.photos.sort((a, b) => a.sort - b.sort);
  result.videos.sort((a, b) => a.sort - b.sort);
  result.platforms.sort((a, b) => a.sort - b.sort);
  return result;
}

function parseProgramsSheet(rows) {
  if (!rows || rows.length < 2) return { list: [], featured: null };

  let dataStart = 1;
  if (rows[0].length > 10 && (rows[0][14] || rows[0][12] || '').trim().toLowerCase() === 'yes') {
    dataStart = 0;
  } else if (rows[0].length < 5) {
    dataStart = 2;
  }

  const activeRows = rows.slice(dataStart)
    .filter(row => {
      // Robust header detection: skip row if it looks like a header (Title, Sort, etc)
      const col1 = (row[1] || '').toLowerCase();
      if (col1.includes('title') || col1.includes('name')) return false;

      // User structure: ACTIVE is usually at Index 14 (15th column)
      // Fallback: Check index 14, then 12, then search all columns for "yes"
      const v14 = (row[14] || '').trim().toLowerCase();
      const v12 = (row[12] || '').trim().toLowerCase();
      let activeVal = (v14 === 'yes' || v14 === 'no') ? v14 : (v12 === 'yes' || v12 === 'no' ? v12 : '');
      
      let isYes = activeVal === 'yes' || activeVal === 'true';
      
      // Extensive fallback: Search for "Yes" in ANY column from 10 onwards
      if (!isYes && row.length > 5) {
        isYes = row.some((val, idx) => idx >= 10 && (String(val).trim().toLowerCase() === 'yes' || String(val).trim().toLowerCase() === 'true'));
      }

      return row.length > 5 && isYes;
    });

  if (activeRows.length === 0 && rows.length > 1) {
    console.warn(`Programs Tab (${rows.length} rows) found but no active rows where column 10+ contains "Yes".`);
    console.log('Row 0:', rows[0]);
    console.log('Row 1:', rows[1]);
  }

  const limitVal = activeRows[0]?.[13] || activeRows[0]?.[11];
  const limit = (limitVal && !isNaN(parseInt(limitVal))) ? parseInt(limitVal) : 15;

  const programs = activeRows
    .map(row => ({
      sort:      parseInt(row[0]) || 99,
      title:     (row[1] || '').trim(),
      type:      (row[2] || '').trim(),
      start:     (row[3] || '').trim(),
      end:       (row[4] || '').trim(),
      desc:      (row[5] || '').trim(),
      badge:     (row[6] || '').trim(),
      status:    (row[7] || '').trim().toLowerCase(),
      badgeBg:   (row[8] || '').trim(),
      badgeText: (row[9] || '').trim(),
      featured:  (row[10] || '').trim().toLowerCase() === 'yes' || (row[10] || '').trim().toLowerCase() === 'true',
      image:     (row[11] || '').trim(),
      order:     parseInt(row[12]) || 99,
    }))
    .filter(p => p.title)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);

  return {
    featured: programs.find(p => p.featured) || programs[0] || null,
    list: programs
  };
}

function parseContactSheet(rows, data) {
  // Contact Us sheet has headers in rows 0-2
  rows.slice(2).forEach(row => {
    const field = (row[0] || '').trim();
    const value = (row[1] || '').trim();
    
    // Support flexible column structure (Active in Col 4 or 5)
    const active4 = (row[4] || '').trim().toLowerCase();
    const active5 = (row[5] || '').trim().toLowerCase();
    const isActive = active4 === 'yes' || active5 === 'yes';

    if (!field || !isActive || field.startsWith('▸')) return;

    if (field.startsWith('contact_')) {
      data.contact[field.replace('contact_', '')] = ensureHttps(value);
    } else if (field.startsWith('social_')) {
      data.social[field.replace('social_', '')] = ensureHttps(value);
    } else if (field.startsWith('footer_')) {
      data.footer[field.replace('footer_', '')] = value;
    } else if (field.startsWith('accred_')) {
      const parts = field.split('_'); // accred_pcnc_label
      if (parts.length >= 3) {
        const accredKey = parts[1]; // pcnc
        const subKey = parts.slice(2).join('_'); // label
        if (!data.accred[accredKey]) data.accred[accredKey] = {};
        data.accred[accredKey][subKey] = ensureHttps(value);
      }
    }
  });
}

function parseGeneralSheet(rows, targetObj) {
  if (!rows || rows.length < 2) return;
  
  // Data usually starts at Row 2 or 3. Filter out labels starting with ▸
  rows.slice(2).forEach(row => {
    const key = (row[0] || '').trim();
    let val = (row[1] || '').trim();
    const active = (row[4] || '').trim().toLowerCase();
    
    if (key && !key.startsWith('▸') && active !== 'no') {
      // Normalize hex colors: If it's a 6-digit hex without #, add it
      if (/^[0-9A-Fa-f]{6}$/.test(val)) {
        val = '#' + val;
      }
      targetObj[key] = val;
    }
  });
}
/**
 * Simple helper to ensure external links have a protocol.
 */
function ensureHttps(url) {
  if (!url || url === '#' || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}
