# Quick Start Guide - Label-to-Ladder

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18+
- Bun (package manager)
- Supabase account

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Variables
Create `.env.local`:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

Get these from Supabase → Settings → API

### 3. Start Development Server
```bash
bun dev
```

Visit: http://localhost:5173

## 🔑 Google OAuth Setup

### Configure Google Provider in Supabase

1. Go to Supabase Dashboard
2. Click "Authentication" → "Providers"
3. Find "Google" and click "Enable"
4. Get credentials from [Google Cloud Console](https://console.cloud.google.com):
   - Create new OAuth 2.0 credential
   - Application type: Web application
   - Add authorized redirect URIs:
     - `https://your-supabase-domain.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
5. Paste into Supabase Google provider settings
6. Click "Save"

### Test Authentication
1. Go to http://localhost:5173/auth
2. Click "Continue with Google"
3. Sign in with your Google account
4. Should redirect to /assessment

## 📊 Database Setup

All tables are automatically created via migrations. They run on first connection.

### Check Database Status
```sql
-- In Supabase SQL Editor
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should see tables:
- `profiles`
- `candidate_profiles`
- `employer_tasks`
- `annotation_jobs`
- `quality_reviews`
- `payments`
- `consents`

## ▶️ Test the Full Flow

### 1. Sign Up
- Visit http://localhost:5173/auth
- Choose: Google, Email, or Demo
- Fill profile info

### 2. Complete Assessment
- Questionnaire → AI Screener → Skill Test
- Get your Level (0-6)

### 3. Browse Jobs
- Visit http://localhost:5173/jobs
- See tasks matched to your level

### 4. Do Annotation Work
- Visit http://localhost:5173/annotation
- Read task prompt
- Write your answer
- Click "Submit for review"

### 5. AI Quality Review
- Automatic AI review runs
- See feedback and score
- If ≥60%: Work approved & payment recorded
- If <60%: Try next task

### 6. Check Leaderboard
- Visit http://localhost:5173/leaderboard
- See your ranking
- View global top performers

### 7. View Daily Summary
- Visit http://localhost:5173/daily-summary
- See today's earnings
- Check task statistics

## 🧪 Test Data

### Create Test Employer & Tasks
```sql
-- Create admin user with employer role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_HERE', 'employer');

-- Add task for demo
INSERT INTO public.employer_tasks (
  employer_id, employer_name, title, category, 
  min_level, languages, hourly, hours_estimate, description
) VALUES (
  'EMPLOYER_USER_ID',
  'Test Company',
  'Fact-check AI responses',
  'annotation',
  1,
  ARRAY['English'],
  '$20/hr',
  10,
  'Review AI-generated content for accuracy'
);
```

## 🔍 Debugging

### Check Authentication State
```javascript
// In browser console
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);
```

### View Supabase Logs
1. Supabase Dashboard → Logs
2. Filter by SQL or Auth
3. Look for errors

### Common Issues

**Issue**: Google sign-in not working
```
Solution: Check redirect URLs in Google Cloud Console match Supabase URL
```

**Issue**: Database operations fail
```
Solution: Check RLS policies in Supabase → Authentication → Policies
Ensure user has proper role assignment
```

**Issue**: Tasks not loading
```
Solution: Verify employer_tasks table has data
Run: SELECT * FROM public.employer_tasks LIMIT 5;
```

## 📱 Test Responsive Design

### Using Chrome DevTools
1. Press F12 (Developer Tools)
2. Click device icon (top left)
3. Select "iPhone 14" or similar
4. Test all pages

### Breakpoints Tested
- 320px (Mobile)
- 768px (Tablet)
- 1024px (Desktop)

## 🧩 Key Routes

### Public Routes
- `/` - Home/landing
- `/auth` - Sign in/up
- `/how-it-works` - Onboarding info

### Protected Routes (require auth)
- `/assessment` - Skill assessment flow
- `/onboarding` - Profile questionnaire
- `/screener` - AI clarification
- `/test` - Skill test
- `/passport` - Skills certification
- `/profile` - User profile
- `/jobs` - Job listing
- `/annotation` - Annotation task
- `/quality-review` - AI review results
- `/payment` - Earnings dashboard
- `/leaderboard` - Rankings
- `/daily-summary` - Today's summary

### Admin Routes
- `/admin` - Admin dashboard
- `/quality-review` (can also see own work reviews)

## 🚢 Deployment

### Deploy to Vercel
```bash
# Push to GitHub first
git add .
git commit -m "Initial commit"
git push origin main

# In Vercel dashboard:
# 1. Import project from GitHub
# 2. Add environment variables
# 3. Deploy
```

### Set Production Environment Variables
In Vercel → Settings → Environment Variables:
```
VITE_SUPABASE_URL=production_url
VITE_SUPABASE_PUBLISHABLE_KEY=production_key
```

## 📚 Documentation Files

- `IMPLEMENTATION.md` - Complete feature documentation
- `MOBILE_BUILD.md` - Mobile app build guide
- `README.md` - Project overview
- `package.json` - Dependencies

## 🐛 Reporting Issues

### If Something Breaks
1. Check browser console (F12) for errors
2. Check Supabase logs (Dashboard → Logs)
3. Verify environment variables
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart dev server (Ctrl+C, then `bun dev`)

### Get Help
- Check [Supabase docs](https://supabase.com/docs)
- Review [React Router docs](https://tanstack.com/router)
- Search GitHub issues

## ✅ Success Checklist

After setup, verify:
- [ ] Dev server running on localhost:5173
- [ ] Can sign up with Google
- [ ] Can complete onboarding flow
- [ ] Can see annotation tasks
- [ ] Can submit work
- [ ] Can see approval/rejection
- [ ] Leaderboard shows rankings
- [ ] Daily summary displays correctly
- [ ] Can navigate all pages
- [ ] No console errors

## 🎉 Ready to Go!

Your Label-to-Ladder platform is ready!

**Next Steps:**
1. Create test employer and tasks
2. Invite team members to test
3. Set up payment processing
4. Configure email notifications
5. Deploy to production

---

Need help? Check `IMPLEMENTATION.md` for detailed documentation.
