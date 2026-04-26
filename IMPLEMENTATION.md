# Label-to-Ladder: Complete Authentication & Job Workflow Implementation

## 🎯 Overview

This document describes the complete implementation of a full-stack authentication and work annotation system for **Label-to-Ladder**, a platform connecting workers with AI annotation tasks.

## ✅ What's Been Implemented

### 1. **Complete Authentication System**

#### Email/Password Authentication
- Sign up with full name, email, password
- Sign in with email and password
- Email verification and confirmation
- Profile auto-creation on successful auth

#### Google OAuth (Gmail) Integration
- One-click Google sign-in via `supabase.auth.signInWithOAuth()`
- Automatic redirect to `/assessment` after successful login
- User metadata captured (full_name from Google)
- Profile creation triggered on first login

**Location:** [src/routes/auth.tsx](src/routes/auth.tsx)

### 2. **Candidate Profile Assessment Flow**

The system guides users through a 12-step journey:

1. **Sign-up** → User creates account via email/Google
2. **Consent & Profile** → User agrees to terms
3. **Questionnaire** → Onboarding info (skills, languages, availability)
4. **AI Clarification** → Screener chat to refine profile
5. **Micro Skill Test** → Quick assessment test
6. **Skills Passport** → Verified certification
7. **Job Hub** → Browse matched tasks
8. **Annotation Activity** → Complete work
9. **Quality Review** → AI reviews work
10. **Score Update** → Level increases with quality
11. **Payment** → Earnings dashboard
12. **Leaderboard** → Global rankings

**Key Files:**
- [src/routes/assessment.tsx](src/routes/assessment.tsx) - Routing logic
- [src/routes/onboarding.tsx](src/routes/onboarding.tsx) - Profile questionnaire
- [src/routes/screener.tsx](src/routes/screener.tsx) - AI clarification
- [src/routes/test.tsx](src/routes/test.tsx) - Skill assessment
- [src/routes/passport.tsx](src/routes/passport.tsx) - Skills display

### 3. **Job Matching & Application System**

#### Features:
- Smart job matching based on:
  - Candidate skill level
  - Language preferences
  - Interest categories
  - Level requirements
- One-click job application
- Application withdrawal
- Task eligibility filtering

**Key File:** [src/lib/matching.ts](src/lib/matching.ts)

### 4. **Annotation Job Workflow**

#### Complete Flow:
```
User → Browse Jobs → Apply → Assigned Task → 
Annotate → Submit → AI Review → Approved/Rejected → 
Payment → Leaderboard Update
```

#### Features:
- Auto-assign random annotation tasks
- Multiple annotation types:
  - Fact-checking AI responses
  - Rating helpfulness (1-5)
  - Translation accuracy
  - Content review
  - Data quality assessment
- Real-time annotation editing
- Submission with validation

**Key Files:**
- [src/routes/annotation.tsx](src/routes/annotation.tsx) - Main annotation interface
- [src/lib/db.ts](src/lib/db.ts) - Database functions
- Annotation schema in [supabase/migrations/20260425205437_*.sql](supabase/migrations/20260425205437_1006f0cf-ea6e-49c6-af9f-153de1a806b4.sql)

### 5. **AI Quality Review System**

#### How It Works:
1. Candidate submits annotation
2. AI agent reviews work
3. AI provides feedback and scores (0-1.00)
4. Auto-approval if score ≥ 0.60
5. Rejection if score < 0.60
6. Payment recorded for approved work

#### Score Components:
- Accuracy and completeness
- Language quality
- Reasoning demonstration
- Consistency
- Overall reliability

**Key File:** [src/routes/quality-review.tsx](src/routes/quality-review.tsx)

### 6. **Payment & Earnings Tracking**

#### Features:
- Automatic payment recording on approval
- Payout amount: $0.75 per annotation
- Daily earnings tracking
- Total earnings history
- Payment status (pending/paid)
- Withdrawal management interface

**Key File:** [src/routes/payment.tsx](src/routes/payment.tsx)

### 7. **Leaderboard & Statistics**

#### Calculated Metrics:
- **Points**: Based on quality scores (0-1000 scale)
- **Level**: Determined by skill assessment results
- **Approved Jobs**: Count of successfully completed tasks
- **Total Earnings**: Sum of all payments received

#### Features:
- Global rankings (top 100)
- User's current position
- Real-time statistics
- Trend indicators
- Competitive achievement badges

**Key File:** [src/routes/leaderboard.tsx](src/routes/leaderboard.tsx)

### 8. **Daily Work Summary**

#### Dashboard Shows:
- Today's earnings
- Tasks completed (approved, in review, active)
- Current leaderboard position
- Personal statistics (points, level, total earnings)
- Quick links to annotation work

**Key File:** [src/routes/daily-summary.tsx](src/routes/daily-summary.tsx)

## 🗄️ Database Schema

### Core Tables:

#### `profiles`
```sql
id (uuid) - Supabase auth user ID
full_name (text)
created_at, updated_at (timestamptz)
```

#### `candidate_profiles`
```sql
user_id (uuid) - Primary key
onboarding (jsonb) - Questionnaire responses
screener (jsonb) - AI clarification results
test_results (jsonb) - Skill assessment scores
level (int) - Calculated skill level
completed_at (timestamptz)
created_at, updated_at
```

#### `employer_tasks`
```sql
id (uuid)
employer_id (uuid) - Task creator
title, description (text)
category (enum: annotation|rating|review|translation|training)
min_level (int) - Minimum required level
languages (text[]) - Required languages
hourly (text) - Display wage
hours_estimate (int) - Time estimate
created_at (timestamptz)
```

#### `annotation_jobs`
```sql
id (uuid)
task_id (uuid) - References employer_tasks
candidate_id (uuid) - Worker
status (text: assigned|submitted|approved|rejected)
payload (jsonb) - Task content/prompt
submission (jsonb) - Worker's answer
payout_cents (int) - Amount to pay if approved
assigned_at, submitted_at, updated_at (timestamptz)
```

#### `quality_reviews`
```sql
id (uuid)
annotation_job_id (uuid)
reviewer (text: ai|employer|admin)
score (numeric 0.00-1.00)
feedback (text)
created_at (timestamptz)
```

#### `payments`
```sql
id (uuid)
candidate_id (uuid)
annotation_job_id (uuid) - Links to work
amount_cents (int)
currency (text: USD)
status (text: pending|paid|failed)
reference (text)
created_at (timestamptz)
```

#### `leaderboard_stats` (View)
```sql
Automatically calculates from:
- candidate_profiles (level, raw score)
- annotation_jobs (approved count)
- payments (total earned)
```

## 🔑 Key Database Functions

### Authentication Functions
```typescript
// Auth context manages:
useAuth() - Get current user, roles, loading state
signOut() - Sign out user
```

### Candidate Profile Functions
```typescript
fetchCandidateProfile(userId) - Get full profile
saveCandidateProfile(userId, profile) - Save onboarding, screener, test results
```

### Annotation Job Functions
```typescript
assignAnnotationJob(taskId, candidateId, payload, payoutCents)
fetchMyAnnotationJobs(candidateId)
fetchAnnotationJobById(jobId)
submitAnnotationJob(jobId, submission)
approveAnnotationJob(jobId)
rejectAnnotationJob(jobId)
```

### Quality Review Functions
```typescript
createQualityReview(jobId, reviewer, score, feedback)
fetchQualityReviewsForJob(jobId)
```

### Payment Functions
```typescript
recordPayment(candidateId, amountCents, jobId)
fetchMyPayments(candidateId)
markPaymentAsPaid(paymentId, reference)
```

### Leaderboard Functions
```typescript
fetchLeaderboardStats() - Top 100 ranked users
fetchUserLeaderboardStats(userId) - Single user stats
```

**Location:** [src/lib/db.ts](src/lib/db.ts)

## 🔐 Security & Row Level Security (RLS)

All tables use Supabase RLS policies:

### Profiles
- Users read/write own profile
- Employers can read profiles of their applicants
- Admins read all

### Candidate Profiles
- Candidates read/write own
- Employers read applicant profiles
- Admins read all

### Annotation Jobs
- Candidates read/update own jobs
- Employers read jobs on their tasks
- Admins manage all

### Payments
- Candidates read own payments
- Admins manage all

### Quality Reviews
- Candidates read reviews of their work
- Employers read reviews of their task workers
- Anyone authenticated can insert AI reviews (scoped properly)

## 🎯 User Journey

### 1. New User
```
Sign up with Google
  ↓
Create profile (auto-filled from Google metadata)
  ↓
Consent page
  ↓
Onboarding questionnaire
  ↓
AI screener chat
  ↓
Skill assessment test
```

### 2. Active Worker
```
View profile
  ↓
Browse jobs (filtered by skill level)
  ↓
Apply to jobs
  ↓
Start annotation task
  ↓
Submit work
  ↓
AI reviews work
  ↓
Work approved/rejected
  ↓
Payment recorded (if approved)
```

### 3. Monitoring Progress
```
Daily summary shows:
  - Today's earnings
  - Completed tasks
  - Leaderboard position
  - Quality score trends
```

## 📊 Key Metrics

### Scoring System
- **Quality Score** (0-1.00): AI assessment of work quality
- **Reliability** (0-1.00): Consistency over multiple tasks
- **Speed** (0-1.00): Time to complete vs. average
- **Accuracy** (0-1.00): Correctness of annotations
- **Language** (0-1.00): Writing quality and clarity
- **Reasoning** (0-1.00): Depth of explanation

### Leaderboard Calculation
```
Points = (rawScore * 1000) * level_multiplier
Rank = ORDER BY points DESC
```

### Earnings Model
- **Per Task**: $0.75 (can vary by complexity)
- **Quality Gate**: 60% AI score required for payment
- **Daily**: Automatic payment on approval
- **Weekly**: Aggregate available for withdrawal

## 🚀 Getting Started as a User

### Sign Up Flow
1. Visit [/auth](src/routes/auth.tsx)
2. Click "Continue with Google" or enter email/password
3. Complete onboarding (3-5 minutes)
4. Take skill assessment
5. View profile and skills passport
6. Browse available jobs
7. Start your first annotation

### Starting an Annotation Task
1. Go to [/annotation](src/routes/annotation.tsx)
2. System assigns task automatically
3. Read prompt and context
4. Write your annotation
5. Click "Submit for review"
6. AI reviews your work (1-2 minutes)
7. Get feedback and earnings update

### Checking Progress
1. Visit [/daily-summary](src/routes/daily-summary.tsx) for today's work
2. Check [/leaderboard](src/routes/leaderboard.tsx) for rankings
3. View [/payment](src/routes/payment.tsx) for earnings history
4. Check [/profile](src/routes/profile.tsx) for account settings

## 🔧 Technical Stack

- **Frontend**: React, TypeScript, TanStack Router
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + OAuth)
- **Real-time**: Supabase subscriptions
- **UI**: Radix UI components, Tailwind CSS
- **State Management**: React hooks, Context API
- **Data Layer**: Custom db.ts wrapper around Supabase

## 📱 Responsive Design

All pages are mobile-first and responsive:
- Works on smartphones (primary use case)
- Tablet-optimized layouts
- Desktop full experience
- Touch-friendly buttons and spacing

## 🎨 User Experience

### Key Design Principles
1. **Simplicity**: One-click actions, minimal steps
2. **Feedback**: Real-time score updates
3. **Clarity**: Clear payout amounts and task requirements
4. **Motivation**: Leaderboard and streak tracking
5. **Accessibility**: High contrast, readable fonts

### Loading States
- Skeleton screens while loading data
- Disable buttons during submission
- Show progress indicators
- Toast notifications for feedback

## 🐛 Error Handling

All async operations have try-catch:
- User-friendly error messages
- Toast notifications
- Graceful degradation
- No silent failures

## 📈 Monitoring & Analytics

Track:
- Time spent per task
- Approval rate by user
- Quality score distribution
- Daily active users
- Earnings per user
- Leaderboard churn

**Location**: Can be added via Supabase analytics or custom tracking

## 🔮 Future Enhancements

Suggested features to add:
1. **Batch tasks** - Multiple annotations in one session
2. **Skill leveling** - Progressive difficulty
3. **Badges & achievements** - Visual rewards
4. **Team leaderboards** - Group competition
5. **Custom payments** - By quality/complexity
6. **Review appeals** - Dispute rejected work
7. **Skill growth tracking** - Visualize progress
8. **Peer review** - Community quality assurance
9. **Mobile app** - Dedicated iOS/Android
10. **API integrations** - Export data, webhooks

## 📞 Support

### Common Questions

**Q: How do I fix Google OAuth?**
A: Check Supabase project settings → Authentication → Google Provider. Ensure:
- Google OAuth app is configured
- Redirect URLs are correct
- Client ID and secret are valid

**Q: How do payments work?**
A: Approved annotations → Payment record created → Manual review → Withdrawal to bank

**Q: Can I improve my level?**
A: Yes! Retake the assessment or complete more high-quality tasks

**Q: How is the leaderboard calculated?**
A: Points = (quality_score * 1000). Rankings update daily.

---

**Last Updated**: April 2026
**Version**: 1.0
**Status**: Production Ready ✅
