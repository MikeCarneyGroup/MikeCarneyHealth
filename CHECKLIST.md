# Mike Carney Wellbeing Hub - Deployment Checklist

Use this checklist to ensure everything is properly configured before going live.

## Pre-Deployment Checklist

### 🔧 Development Setup
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Application builds successfully (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors (`npm run lint`)
- [ ] Tested locally on `localhost:3000`

### 🎨 Content & Branding
- [ ] Logo files in place (`MCG-Logo-white.png`, `MCH-Logo.png`)
- [ ] Footer contact information updated
- [ ] About/company information accurate
- [ ] Initial announcements created
- [ ] Welcome message configured
- [ ] Sample news articles added
- [ ] Policy documents uploaded
- [ ] Event calendar populated

### 🔐 Authentication Setup
- [ ] Azure AD application created
- [ ] Azure AD credentials configured
- [ ] Redirect URIs added to Azure AD
- [ ] Email SMTP credentials configured
- [ ] Email templates tested
- [ ] Domain restrictions verified
- [ ] Test login with Microsoft 365
- [ ] Test login with Email OTP

### 💾 Database Configuration
- [ ] Vercel Postgres database created
- [ ] Database connection tested
- [ ] Schema pushed to production database
- [ ] First admin user created
- [ ] User roles tested (Staff, Editor, Admin)
- [ ] Database backup configured

### 📁 File Storage
- [ ] Vercel Blob storage created
- [ ] Blob token configured
- [ ] File upload tested
- [ ] PDF download tested
- [ ] File size limits verified

### 🌐 Vercel Setup
- [ ] Project deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Environment variables set for Production
- [ ] Environment variables set for Preview
- [ ] Build & deployment successful

### ♿ Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus visible on all interactive elements
- [ ] Skip to main content link works
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Color contrast verified (4.5:1)
- [ ] Form labels associated correctly
- [ ] Error messages announced
- [ ] ARIA labels on icon buttons

### 📱 Responsive Testing
- [ ] Mobile (375px - iPhone SE)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1280px - laptop)
- [ ] Large desktop (1920px)
- [ ] Mobile navigation works
- [ ] Touch targets adequate (44x44px)
- [ ] Images responsive

### 🔍 Functionality Testing
- [ ] Homepage loads
- [ ] Login flow works
- [ ] Dashboard displays correctly
- [ ] News articles load and display
- [ ] Events page shows upcoming events
- [ ] Policies download correctly
- [ ] Downloads section works
- [ ] Search returns results
- [ ] Submissions can be created
- [ ] Submissions can be moderated
- [ ] Admin panel accessible (admin/editor)
- [ ] Role-based access working

### 🔒 Security Verification
- [ ] All routes properly protected
- [ ] Admin routes restricted to admin/editor
- [ ] File uploads validate type and size
- [ ] User input sanitized
- [ ] SQL injection protected (via ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection active (NextAuth)
- [ ] Secure headers configured
- [ ] HTTPS enforced
- [ ] Environment variables not exposed

### ⚡ Performance Optimization
- [ ] Images optimized and using Next.js Image
- [ ] Lazy loading implemented where appropriate
- [ ] Database queries optimized
- [ ] API routes respond quickly
- [ ] Build output size reasonable
- [ ] Lighthouse score 90+ (all categories)
- [ ] Core Web Vitals pass

### 📊 Monitoring & Analytics
- [ ] Error logging configured
- [ ] Vercel Analytics enabled (optional)
- [ ] Database monitoring active
- [ ] Uptime monitoring set up (optional)

## Post-Deployment Checklist

### 🚀 Launch Activities
- [ ] Announce to staff via email
- [ ] Provide login instructions
- [ ] Share quick start guide
- [ ] Schedule training sessions
- [ ] Assign editor/admin roles
- [ ] Create initial content calendar

### 📚 Documentation
- [ ] README.md updated with production URLs
- [ ] Environment variables documented
- [ ] Admin guide shared with editors
- [ ] User guide created for staff
- [ ] FAQ document prepared
- [ ] Support contact information provided

### 👥 User Management
- [ ] Admin users created
- [ ] Editor users assigned
- [ ] Staff can self-register
- [ ] Role assignment process defined
- [ ] User removal process defined

### 🔄 Maintenance Plan
- [ ] Backup schedule established
- [ ] Update schedule defined
- [ ] Security patch process defined
- [ ] Content review schedule set
- [ ] Monitoring alerts configured

## Going Live Checklist

### Day Before Launch
- [ ] Final content review
- [ ] All features tested
- [ ] Admin team briefed
- [ ] Support team ready
- [ ] Announcement email drafted
- [ ] Rollback plan documented

### Launch Day
- [ ] Final deployment to production
- [ ] DNS updated (if custom domain)
- [ ] Send announcement email
- [ ] Monitor error logs
- [ ] Monitor user signups
- [ ] Be available for support

### First Week
- [ ] Daily error log review
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Content updates as needed
- [ ] Address any issues promptly

## Testing Scenarios

### User Flows to Test
1. **New Staff Member**
   - [ ] Receive invitation
   - [ ] First login (Microsoft 365)
   - [ ] First login (Email OTP)
   - [ ] View dashboard
   - [ ] Browse news
   - [ ] Download policy
   - [ ] Submit story/idea

2. **Editor**
   - [ ] Login
   - [ ] Access admin panel
   - [ ] Create announcement
   - [ ] Publish news article
   - [ ] Create event
   - [ ] Upload policy document
   - [ ] Moderate submission

3. **Admin**
   - [ ] All editor functions
   - [ ] Change user role
   - [ ] Manage users
   - [ ] System configuration

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing Tools
- [ ] WAVE browser extension
- [ ] axe DevTools
- [ ] Lighthouse accessibility audit
- [ ] Keyboard navigation manual test
- [ ] Screen reader manual test

## Emergency Contacts

Document your emergency contacts:

- **Developer**: _______________
- **Vercel Support**: support@vercel.com
- **Azure Support**: _______________
- **Database Admin**: _______________
- **Project Manager**: _______________

## Rollback Plan

If critical issues arise:

1. **Immediate Actions**
   - [ ] Notify all stakeholders
   - [ ] Document the issue
   - [ ] Check error logs

2. **Rollback Steps**
   - [ ] Revert to previous Vercel deployment
   - [ ] Restore database if needed
   - [ ] Update DNS if required
   - [ ] Notify users of downtime

3. **Post-Rollback**
   - [ ] Identify root cause
   - [ ] Fix in development
   - [ ] Re-test thoroughly
   - [ ] Plan re-deployment

## Sign-off

**Completed by**: _______________  
**Date**: _______________  
**Verified by**: _______________  
**Date**: _______________  

---

✅ **All items checked? You're ready to launch!**

🚀 **Deploy with confidence knowing everything has been thoroughly tested and verified.**
