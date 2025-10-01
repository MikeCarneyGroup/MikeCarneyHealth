# Analytics Setup Guide

This project includes **Vercel Analytics**, **Vercel Speed Insights**, and **Google Analytics** for comprehensive tracking.

## 📊 What's Included

### 1. Vercel Analytics ✅
**Automatically enabled** when deployed to Vercel.

**Features:**
- Page views tracking
- Visitor analytics
- Traffic sources
- Geographic data
- Real-time dashboard

**Setup:**
- ✅ Already installed (`@vercel/analytics`)
- ✅ Already added to `app/layout.tsx`
- 🚀 **No configuration needed!**

**View Data:**
1. Deploy to Vercel
2. Go to your project dashboard
3. Click **Analytics** tab
4. Data appears automatically after deployment

---

### 2. Vercel Speed Insights ✅
**Automatically enabled** when deployed to Vercel.

**Features:**
- Core Web Vitals tracking
- Performance metrics
- Real User Monitoring (RUM)
- Lighthouse scores
- Performance trends

**Setup:**
- ✅ Already installed (`@vercel/speed-insights`)
- ✅ Already added to `app/layout.tsx`
- 🚀 **No configuration needed!**

**View Data:**
1. Deploy to Vercel
2. Go to your project dashboard
3. Click **Speed Insights** tab
4. See real-time performance data

---

### 3. Google Analytics (Optional) 🔧

**Features:**
- Advanced user behavior tracking
- Custom events
- Conversion tracking
- E-commerce tracking (if needed)
- Custom reports

**Setup Required:**

#### Step 1: Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon)
3. Click **Create Property**
4. Fill in:
   - **Property name**: `Mike Carney Wellbeing Hub`
   - **Reporting time zone**: `Australia/Brisbane`
   - **Currency**: `Australian Dollar (AUD)`
5. Click **Next**
6. Choose **Business size** and **Industry**
7. Click **Create**

#### Step 2: Set Up Data Stream

1. Select **Web** as the platform
2. Enter:
   - **Website URL**: `https://your-app.vercel.app`
   - **Stream name**: `Mike Carney Wellbeing Hub`
3. Click **Create stream**

#### Step 3: Get Your Measurement ID

1. After creating the stream, you'll see **Measurement ID**
2. It looks like: `G-XXXXXXXXXX`
3. **Copy this ID**

#### Step 4: Add to Environment Variables

**Local Development:**
Add to your `.env.local`:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Vercel Production:**
1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-XXXXXXXXXX`
   - Check: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save**
5. **Redeploy** your application

#### Step 5: Verify It's Working

1. Deploy your site
2. Visit your website
3. Go to Google Analytics
4. Click **Reports** → **Realtime**
5. You should see yourself as an active user!

---

## 🔍 Verifying Analytics Are Working

### Local Development

**Vercel Analytics & Speed Insights:**
- Only work in **production** (deployed to Vercel)
- Won't track anything on `localhost`

**Google Analytics:**
- Works on `localhost` if `NEXT_PUBLIC_GA_ID` is set
- Check browser console for GA events (if debug mode enabled)

### Production

**Test Vercel Analytics:**
```bash
# After deployment
1. Visit your site: https://your-app.vercel.app
2. Navigate to a few pages
3. Go to Vercel Dashboard → Analytics
4. Wait 1-2 minutes, then see data appear
```

**Test Speed Insights:**
```bash
1. Visit your site
2. Navigate around
3. Go to Vercel Dashboard → Speed Insights
4. See Core Web Vitals appear within minutes
```

**Test Google Analytics:**
```bash
1. Visit your site
2. Go to Google Analytics → Reports → Realtime
3. You should see active users (yourself)
```

---

## 📈 What Gets Tracked

### Vercel Analytics
- ✅ Page views
- ✅ Unique visitors
- ✅ Traffic sources (referrers)
- ✅ Geographic location
- ✅ Device types
- ✅ Time on site

### Vercel Speed Insights
- ✅ Largest Contentful Paint (LCP)
- ✅ First Input Delay (FID)
- ✅ Cumulative Layout Shift (CLS)
- ✅ First Contentful Paint (FCP)
- ✅ Time to First Byte (TTFB)
- ✅ Performance score

### Google Analytics (when configured)
- ✅ Page views
- ✅ User sessions
- ✅ Bounce rate
- ✅ User demographics
- ✅ Acquisition channels
- ✅ User flow
- ✅ Custom events (can be added)

---

## 🎯 Privacy Compliance

### Vercel Analytics
- GDPR compliant
- No cookies used
- Privacy-friendly
- No personal data collected

### Vercel Speed Insights
- Performance metrics only
- No personal data
- GDPR compliant

### Google Analytics
- Uses cookies
- May require cookie consent banner (depending on region)
- Configure in Google Analytics for GDPR compliance:
  1. Admin → Data Settings → Data Collection
  2. Enable **Google signals data collection** only if needed
  3. Set **Data retention** period

---

## 🔧 Advanced Configuration

### Custom Events (Google Analytics)

To track custom events, add this to any component:

```typescript
'use client';

import { sendGAEvent } from '@next/third-parties/google';

export function MyComponent() {
  const handleClick = () => {
    sendGAEvent('event', 'button_click', {
      category: 'engagement',
      label: 'cta_button',
      value: '1'
    });
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Disable Analytics in Development

Already configured! Analytics only run in production by default.

---

## 📊 Viewing Your Data

### Vercel Dashboard
Access at: `https://vercel.com/[your-team]/[your-project]`

- **Analytics tab**: User data, page views, traffic sources
- **Speed Insights tab**: Performance metrics, Core Web Vitals

### Google Analytics Dashboard
Access at: `https://analytics.google.com/`

- **Reports → Realtime**: Live user activity
- **Reports → Engagement**: Page views, engagement time
- **Reports → Acquisition**: Traffic sources
- **Reports → User**: Demographics, interests

---

## ✅ Quick Setup Checklist

### Vercel Analytics & Speed Insights
- [x] Packages installed
- [x] Components added to layout
- [ ] Deploy to Vercel
- [ ] Verify data in Vercel dashboard

### Google Analytics
- [ ] Create Google Analytics property
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add to Vercel environment variables
- [ ] Redeploy application
- [ ] Verify in Google Analytics Realtime report

---

## 🆘 Troubleshooting

### "No data in Vercel Analytics"
- **Wait**: Data can take 5-10 minutes to appear
- **Check**: You're viewing the correct project
- **Verify**: Site is actually deployed and receiving traffic

### "No data in Google Analytics"
- **Check**: `NEXT_PUBLIC_GA_ID` is set correctly
- **Check**: ID starts with `G-` (not `UA-`)
- **Verify**: Environment variable is in production
- **Wait**: Data can take 24-48 hours for full reports (Realtime is instant)
- **Ad Blockers**: Disable to test (many block GA)

### "Speed Insights not showing"
- **Wait**: Needs real user data, takes time
- **Traffic**: Need actual visitors for data
- **Check**: Viewing correct environment (production)

---

## 📝 Summary

**What you have now:**
- ✅ Vercel Analytics - Tracks user behavior
- ✅ Vercel Speed Insights - Tracks performance
- ✅ Google Analytics - Advanced tracking (when configured)

**What you need to do:**
1. ✅ Already done: Code is ready!
2. 🚀 Deploy to Vercel
3. 📊 Configure Google Analytics (optional)
4. 📈 Start tracking!

---

**Questions?** Check the official docs:
- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Vercel Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Next.js Google Analytics Docs](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)
