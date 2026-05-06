# Shepherd's Voice - Content Management Guide

## Overview

This guide explains how to manage all website content (text, images, links, events, awards) without writing code.

---

## Quick Start

### File: `EDIT_CONTENT_SPREADSHEET.csv`

This file contains all editable content for the website. It can be opened and edited in:

- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any spreadsheet application

### Step-by-Step Process

#### 1. **Open the Spreadsheet**

```
1. Navigate to project folder
2. Open "EDIT_CONTENT_SPREADSHEET.csv"
3. Choose to open with Excel (recommended) or Google Sheets
```

#### 2. **Edit Content**

- Find the section you want to edit (GENERAL INFO, HERO SECTION, etc.)
- Update the value in the `NEW_VALUE` column
- Or modify `CURRENT_VALUE` directly
- Example:
  ```
  SECTION: General Info
  FIELD: Organization Name
  CURRENT_VALUE: Shepherd's Voice Radio and Television Foundation Inc.
  NEW_VALUE: [Type your new organization name here]
  ```

#### 3. **Add New Items**

To add a new program, team member, or award:

- Scroll to that section
- Add a new row following the same format
- Fill in all required fields

Example - Adding a new program:

```
SECTION: PROGRAMS SECTION
FIELD: Program 3 Title
NEW_VALUE: Evening Worship Service

SECTION: PROGRAMS SECTION
FIELD: Program 3 Type
NEW_VALUE: Weekly Event

SECTION: PROGRAMS SECTION
FIELD: Program 3 Date
NEW_VALUE: Every Sunday 7PM

SECTION: PROGRAMS SECTION
FIELD: Program 3 Status
NEW_VALUE: Active

SECTION: PROGRAMS SECTION
FIELD: Program 3 Description
NEW_VALUE: Join us for evening worship and fellowship
```

#### 4. **Update Images/Videos**

**For Images:**

- Get the public image URL (must support HTTPS)
- Paste into the `IMAGE URL` or `Photo URL` field
- Recommended sources: Unsplash, Pexels, Pixabay, or your own hosted images
- Keep URLs without special characters in the URL itself

**For Videos (YouTube):**

1. Find video on YouTube
2. Click "Share" → Get the video ID from URL
3. Convert to embed format:
   ```
   Original: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
   ```
4. Paste the embed URL into the VIDEO URL field

#### 5. **Update Links**

**Internal Links (within website):**

- Use `#` followed by section ID
- Examples:
  - `#home` → Home section
  - `#who` → What We Are section
  - `#gallery` → Gallery section
  - `#programs` → Programs section
  - `#awards` → Awards section

**External Links:**

- Use full URL with `https://`
- Example: `https://facebook.com/yourpage`

#### 6. **Submit Changes**

**Excel Format – Developer's Standard**

The Excel spreadsheet (`.xlsx`) is the **standard developer format** for easy content management:

✅ **What can be edited via Excel:**

- Logo and branding images
- All text content (headings, descriptions, body text)
- Photo and video links (URLs)
- Team member information
- Awards and program data
- Social media links
- Contact information

✅ **How it works:**

1. Edit content in the Excel file
2. Save the file as `.xlsx`
3. Send to developer
4. Developer updates `src/data/database.js` with new values
5. Deploy changes – **site automatically updates**

**No admin panel required.** The Excel file is the direct source of truth for all editable content. The programmer simply maintains the backend data structure, not a separate admin interface.

---

## Field Reference

### Color Codes (Hex Format)

```
Brand Red:     #ff474f
Gold Accent:   #c9932e
Violet:        #7c3aed
Teal:          #0d9488
Sky Blue:      #2563eb
Coral:         #e05c3a
Rose:          #e11d48
```

### Status Values (Must be exact)

```
Upcoming → Shows with violet indicator
Open     → Shows with teal indicator
Active   → Shows with teal indicator
Ended    → Shows with gray indicator (dimmed)
```

### Component Names (for page link references)

```
Home:        #home
What We Are: #who
Gallery:     #gallery
Programs:    #programs
Awards:      #awards
```

---

## Section Guide

### GENERAL INFO

**Updates:** Organization name, contact details, social media links
**Location on Site:** Footer, navigation
**How Often to Update:** Rarely (only when moving offices or changing contact)

### HERO SECTION

**Updates:** Main heading, subheading, description, buttons
**Location on Site:** Top of homepage (hero banner)
**How Often to Update:** Seasonally or for campaigns
**Note:** "Radio and [break] Television" uses word break for responsive design

### WHAT WE ARE SECTION

**Updates:** About text, mission statement, vision statement, team info, statistics
**Location on Site:** Second section on homepage
**How Often to Update:** Annually or when policies change
**Image Specs:** Main 900x900px, Sub 900x600px

### GALLERY SECTION

**Updates:** Photo URLs, photo captions, YouTube video embed URLs
**Location on Site:** Gallery page
**How Often to Update:** Monthly (add new events/videos)
**Image Specs:** 900x900px (1:1 ratio)
**Videos:** YouTube embed URLs only

### PROGRAMS SECTION

**Updates:** Program titles, dates, descriptions, status, type
**Location on Site:** Programs page
**How Often to Update:** Weekly (as events approach/conclude)
**Search Feature:** Search bar toggles with icon button, auto-closes after inactivity
**Status Management:** Mark as "Upcoming" → "Open" → "Active" → "Ended"

### TEAM SECTION

**Updates:** Team member names, roles, photos, biographies
**Location on Site:** What We Are section (scrollable grid)
**How Often to Update:** When team changes
**Image Specs:** 400x500px (portrait orientation)
**Photo Effect:** Black vignette overlay applied automatically

### AWARDS SECTION

**Updates:** Year, award name, awarding organization, award category
**Location on Site:** Awards page
**How Often to Update:** When new awards received
**Award Categories Affect Styling:**

- Gold Award → Gold color
- Silver Award → Teal color
- Platinum → Yellow color
- Other → Default gray

### FOOTER SECTION

**Updates:** Copyright info, quick links, contact info, social media links
**Location on Site:** Bottom of every page
**How Often to Update:** Annually (copyright year) or when contact changes

---

## How to Upload/Deploy

### Method 1: Email to Developer

1. Save spreadsheet as `EDIT_CONTENT_SPREADSHEET.xlsx`
2. Email with subject: "Website Content Update - [Date]"
3. Developer will:
   - Extract your changes
   - Update `src/data/database.js`
   - Rebuild and deploy app
   - Notify you when live

### Method 2: Admin Panel (If Available)

1. Navigate to `/admin` (if enabled)
2. Click "Upload Content CSV"
3. Select `EDIT_CONTENT_SPREADSHEET.csv`
4. Click "Update"
5. Wait for "Success" message
6. Changes live within 1-2 minutes

### Method 3: GitHub (For Developers Only)

1. Modify `src/data/database.js` directly with new values
2. Commit and push changes
3. Deploy to production

---

## File Format Compatibility

| Format  | Recommended   | Notes                                         |
| ------- | ------------- | --------------------------------------------- |
| `.xlsx` | ✅ Yes        | Best for email sharing                        |
| `.csv`  | ✅ Yes        | Best for auto-import to app                   |
| `.ods`  | ✅ Compatible | LibreOffice format                            |
| `.xls`  | ⚠️ Legacy     | Old Excel format, recommend updating to .xlsx |

---

## Troubleshooting

### "Image not showing after upload"

- **Cause:** URL is HTTP (not HTTPS) or image is not publicly accessible
- **Fix:** Convert URL to HTTPS or upload image to public cloud service

### "Video not playing"

- **Cause:** Using YouTube share URL instead of embed URL
- **Fix:** Convert to embed format: `youtube.com/embed/VIDEO_ID`

### "Changes not appearing on website"

- **Cause:** Changes not deployed or cached browser data
- **Fix:**
  1. Hard refresh browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
  2. Clear browser cache
  3. Contact developer to confirm deployment

### "Text looks cut off or weird"

- **Cause:** Text too long for element
- **Fix:** Shorten text or contact developer for layout adjustment

### "Special characters showing as ?"

- **Cause:** Encoding issue
- **Fix:**
  1. Save spreadsheet as UTF-8 encoding
  2. In Excel: File → Save As → CSV UTF-8 (.csv)

---

## Don't-Do List

❌ **Do NOT:**

- Delete any rows in status column (will break links)
- Change section names (will break page structure)
- Use characters like `<`, `>`, `{`, `}` in regular content
- Use more than 500 characters for descriptions
- Upload images over 5MB (will slow down website)
- Add HTML code or JavaScript directly
- Change the "FIELD" column values

✅ **DO:**

- Use plain text only
- Keep descriptions concise
- Test image URLs before submitting
- Create backups before major updates
- Ask developer if unsure

---

## Contact & Support

**For questions about:**

- **Content updates:** Ask the communications team lead
- **Technical issues:** Contact development team
- **New features/sections:** Submit request to project manager
- **Password/access:** Contact IT administrator

---

## Version History

| Date       | Version | Changes                  | Updated By       |
| ---------- | ------- | ------------------------ | ---------------- |
| 2026-04-08 | 1.0     | Initial template created | Development Team |
|            |         |                          |                  |

---

**Last Updated:** April 8, 2026  
**Maintained By:** Shepherd's Voice Development Team  
**Questions?** Contact info@shepherdsvoice.org or your project manager
