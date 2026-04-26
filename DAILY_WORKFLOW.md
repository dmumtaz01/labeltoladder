# Daily Work Flow - How End-of-Day Submission Works

## 📋 Complete Daily Workflow

### Morning: Start Your Day

**1. Sign In**
```
User visits labeltoladder.com/auth
├─ Google Sign-In (Gmail) OR
└─ Email/Password
   └─ Redirects to /assessment
```

**2. Check Profile**
```
/profile page shows:
├─ Current Level (0-6)
├─ Total earnings to date
├─ Quick links:
│  ├─ Daily Summary
│  ├─ Available Jobs
│  └─ Leaderboard
└─ Navigation menu
```

### Work: Complete Annotations

**3. Start Annotation Task**
```
Click "Start Annotation" → /annotation

System assigns task:
├─ Prompt/question
├─ Context/reference
├─ Payout amount ($0.75)
└─ Instructions

User:
├─ Reads carefully
├─ Types response
└─ Clicks "Submit for review"
```

**4. Quality Review Process**
```
Submitted task → /quality-review

AI Agent reviews:
├─ Accuracy check
├─ Completeness assessment
├─ Language quality
└─ Generates SCORE (0.00-1.00)

If SCORE ≥ 0.60:
├─ ✅ APPROVED
├─ Payment recorded (+$0.75)
└─ User redirected to progress view

If SCORE < 0.60:
├─ ❌ REJECTED
├─ No payment
└─ Try next task for improvement
```

**5. Continue Working (Loop)**
```
User can repeat steps 3-4 multiple times:
├─ Task 1 → Submit → Approved ($0.75)
├─ Task 2 → Submit → Approved ($0.75)
├─ Task 3 → Submit → Rejected ($0.00)
├─ Task 4 → Submit → Approved ($0.75)
└─ ... continue as long as desired
```

### Evening: Review Daily Summary

**6. Check Daily Summary**
```
/daily-summary shows:

TODAY'S STATS:
├─ Total earnings today ($2.25)
├─ Tasks completed (4)
│  ├─ Approved: 3
│  ├─ In Review: 0
│  └─ Active: 1
└─ Quality score average: 78%

LEADERBOARD POSITION:
├─ Your points: 2,340
├─ Your level: 3
├─ Global rank: #245
└─ Total earned (all-time): $156.50

TASK HISTORY:
├─ Task 1: Approved 78% ($0.75)
├─ Task 2: Approved 85% ($0.75)
├─ Task 3: Rejected 45% ($0.00)
└─ Task 4: Approved 92% ($0.75)
```

**7. Submit Daily Work (End of Day)**
```
System auto-calculates:
├─ Total tasks completed
├─ Approval rate
├─ Quality average
├─ Earnings for day
└─ Points earned (based on quality)

Options to end session:
├─ Continue working (default)
├─ View leaderboard (see new ranking)
├─ Check payment (verify earnings)
└─ Sign out
```

### End of Day: Automatic Updates

**8. Leaderboard Updates**
```
Overnight processing:
├─ All payments marked as "paid"
├─ Points calculated from quality scores
├─ Leaderboard refreshed
├─ Rankings recalculated
├─ User positions updated

Next morning:
├─ User sees updated rank
├─ New daily summary starts fresh
└─ Ready for next day's work
```

## 💰 Earnings Model

### Per-Task Payment
```
$0.75 per annotation task

Payment conditions:
├─ AI quality score ≥ 60%
├─ Work must be submitted
├─ No appeal process (auto-approved)
└─ No deductions for rejections
```

### Daily Earnings Example
```
Day 1:
├─ Task 1: Approved 85% → +$0.75
├─ Task 2: Approved 90% → +$0.75
├─ Task 3: Approved 78% → +$0.75
├─ Task 4: Rejected 42% → +$0.00
├─ Task 5: Approved 88% → +$0.75
├─ Task 6: Approved 95% → +$0.75
└─ DAILY TOTAL: $4.50

Day 2:
├─ Task 7: Approved 81% → +$0.75
├─ Task 8: Approved 92% → +$0.75
└─ DAILY TOTAL: $1.50

CUMULATIVE:
└─ 2-Day Earnings: $6.00
```

### Weekly & Monthly Summary
```
Weekly (7 days):
├─ Average tasks/day: 5
├─ Average approval rate: 80%
├─ Average earnings/day: $3.75
└─ Weekly total: $26.25

Monthly (30 days):
├─ Total tasks: 150
├─ Total approved: 120
├─ Approval rate: 80%
├─ Total earnings: $90.00
└─ Level progress: Improved from L2 → L3
```

## 📊 Points & Leaderboard

### How Points Are Calculated
```
Points = (Quality_Score × 1000) × Level_Multiplier

Example:
├─ Quality Score: 0.85 (85%)
├─ Level: 3 (multiplier: 1.2x)
└─ Points: (0.85 × 1000) × 1.2 = 1,020 points
```

### Daily Points Example
```
Task 1: 85% × 1000 × 1.2 = 1,020 pts
Task 2: 90% × 1000 × 1.2 = 1,080 pts
Task 3: Rejected (0 pts)
Task 4: 88% × 1000 × 1.2 = 1,056 pts
Task 5: 95% × 1000 × 1.2 = 1,140 pts

Daily Points Total: 4,296 pts
```

### Leaderboard Ranking
```
Global Rankings (updated daily):

#1  🏆 Sarah O.      Level 5   15,420 pts   $450.25
#2  🥈 Ahmed M.      Level 4   14,890 pts   $425.00
#3  🥉 Maria L.      Level 4   14,230 pts   $410.75
#4      James K.     Level 3   12,540 pts   $385.50
#5      Yuki T.      Level 3   11,890 pts   $360.25
...
#245   YOU           Level 3    2,340 pts   $156.50
...
#100   Bonus         Level 2    5,670 pts   $220.00
```

## 🎯 Quality Scoring Breakdown

### AI Reviewer Evaluates:

**1. Accuracy (40 points max)**
```
Does the annotation correctly identify the issue?
├─ Perfectly accurate: 40 pts
├─ Minor error: 30 pts
├─ Some issues: 20 pts
└─ Mostly wrong: 0 pts
```

**2. Completeness (25 points max)**
```
Did the user address all requirements?
├─ All aspects covered: 25 pts
├─ 75% coverage: 18 pts
├─ 50% coverage: 12 pts
└─ Incomplete: 0 pts
```

**3. Clarity (20 points max)**
```
Is the response well-written and clear?
├─ Excellent: 20 pts
├─ Good: 15 pts
├─ Acceptable: 10 pts
└─ Confusing: 0 pts
```

**4. Consistency (15 points max)**
```
Does answer align with task requirements?
├─ Perfectly aligned: 15 pts
├─ Mostly aligned: 10 pts
├─ Somewhat aligned: 5 pts
└─ Misaligned: 0 pts
```

### Score Conversion
```
Total Points → Quality Score
├─ 100 pts = 1.00 (Perfect)
├─ 85 pts = 0.85 (Great)
├─ 70 pts = 0.70 (Good)
├─ 60 pts = 0.60 (Pass/Approved) ✅
├─ 59 pts = 0.59 (Fail/Rejected) ❌
└─ 0 pts = 0.00 (No credit)

Payment Threshold: ≥60 points
```

## 🔄 Continuous Workflow

### Session 1 (Morning)
```
Start → Complete 5 tasks → Earn $3.75 → Gain 5,100 pts
```

### Session 2 (Afternoon)
```
Continue → Complete 4 tasks → Earn $3.00 → Gain 4,080 pts
```

### Session 3 (Evening)
```
Continue → Complete 2 tasks → Earn $1.50 → Gain 2,040 pts
```

### Daily Total
```
Sessions: 3
Tasks completed: 11
Total earnings: $8.25
Total points gained: 11,220 pts
New daily rank: Increased 🎉
```

## 📱 Mobile Experience

### Optimized for Smartphones
```
All workflow steps work seamlessly on mobile:
├─ Responsive buttons
├─ Easy text input (textarea)
├─ Quick navigation
├─ Real-time updates
└─ Battery efficient
```

### Typical Mobile Session
```
1. Open app (2 sec)
2. See annotation task (5 sec)
3. Read prompt/context (10-30 sec)
4. Type response (60-120 sec)
5. Submit (2 sec)
6. See AI review (60 sec)
7. Get result & earnings (3 sec)
─────────────────────────
Total: 2-3 minutes per task
Daily capacity: 10-15 tasks
```

## 🎓 Skill Development

### Improvement Path
```
Week 1:
├─ Level 1 (Beginner)
├─ Quality: 65% average
├─ Earnings: $18.75 (25 tasks)
└─ Points: ~5,000

Week 2:
├─ Level 1 (Still learning)
├─ Quality: 72% average
├─ Earnings: $24.00 (32 tasks)
└─ Points: ~6,912

Week 3:
├─ Level 2 (Proficient)
├─ Quality: 78% average
├─ Earnings: $27.30 (36 tasks)
└─ Points: ~8,748

Week 4:
├─ Level 2 (Expert)
├─ Quality: 85% average
├─ Earnings: $29.75 (40 tasks)
└─ Points: ~10,200
```

## 🔐 Privacy & Security

### Your Data Protection
```
├─ All submissions encrypted
├─ Only AI reviewer sees submissions
├─ No personal data exposed on leaderboard
├─ You control export
└─ GDPR compliant
```

### Submission Privacy
```
├─ UUID-based tracking (not name)
├─ Encrypted storage
├─ Audit logs available
├─ Can request data delete
└─ 90-day retention (then archived)
```

## 🚀 Optimization Tips

### Maximize Earnings
```
1. Quality over speed
   ├─ Spend 2-3 min per task
   ├─ Aim for 85%+ scores
   └─ Earn $0.75 per approval

2. Work during peak hours
   ├─ 9-11 AM (focus time)
   ├─ 2-4 PM (afternoon session)
   └─ 7-9 PM (evening slots)

3. Batch similar tasks
   ├─ 5-10 tasks in sequence
   ├─ Stay in flow state
   └─ Higher approval rate

4. Learn from feedback
   ├─ Read AI feedback carefully
   ├─ Apply lessons next task
   └─ Continuous improvement
```

### Climb the Leaderboard
```
1. Consistency
   ├─ Work 5+ days/week
   ├─ Complete 5+ tasks/day
   └─ Maintain 80%+ quality

2. Quality focus
   ├─ Accuracy is key
   ├─ Read instructions carefully
   └─ Double-check before submit

3. Skill growth
   ├─ Retake assessment
   ├─ Level up = higher payouts
   └─ Advanced tasks available

4. Engage community
   ├─ Share tips
   ├─ Learn from others
   └─ Celebrate milestones
```

## 📞 Support During Work

### Need Help?
```
While working on annotation:
├─ Click "Need a hand?" at bottom
├─ Chat with AI helper
├─ Get clarification instantly
└─ Continue working
```

### Questions?
```
General issues:
├─ Check FAQ on homepage
├─ Email: support@labeltoladder.com
├─ Discord community
└─ Twitter @labeltoladder
```

---

**Last Updated**: April 2026
**Workflow Version**: 1.0
**Status**: Fully Operational ✅

Ready to start earning? [Begin annotation work →](annotation)
