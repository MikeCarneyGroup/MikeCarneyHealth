# Mike Carney Wellbeing Hub - Features Documentation

## Overview

The Mike Carney Wellbeing Hub is a comprehensive staff portal designed to support employee wellbeing, provide easy access to resources, and facilitate communication within the organization.

## Authentication & Security

### Multi-Provider Authentication
- **Microsoft 365 / Azure AD**: Single sign-on for staff with Microsoft accounts
- **Email OTP**: Two-factor authentication via email magic links
- **Domain Restrictions**: Only authorized company email domains can register
  - @lexusoftownsville.com.au
  - @mikecarneytoyota.com.au
  - @inghamtoyota.com.au
  - @charterstowerstoyota.com.au
  - @mikecarneymahindra.com.au
  - @4wdc.com.au

### Role-Based Access Control (RBAC)
Three user roles with distinct permissions:

| Feature | Staff | Editor | Admin |
|---------|-------|--------|-------|
| View public content | ✅ | ✅ | ✅ |
| View protected content | ✅ | ✅ | ✅ |
| Submit stories/ideas | ✅ | ✅ | ✅ |
| Create/edit content | ❌ | ✅ | ✅ |
| Moderate submissions | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Access admin panel | ❌ | ✅ | ✅ |

## Public Features

### Home Page
- Hero section with call-to-action
- Feature cards highlighting main sections
- Public announcements display
- Career opportunities section

### Health Initiatives
- Overview of wellness programs
- Mental health support information
- Physical fitness opportunities
- Nutrition and wellness resources
- Team wellbeing activities

### Careers
- Company culture overview
- Benefits and perks
- Brand information
- Contact for recruitment team

## Protected Features (Login Required)

### Dashboard
- Personalized welcome message
- Quick links to key sections
- Recent announcements
- Upcoming events preview
- Latest news articles

### News & Updates
- Company news articles
- Individual article pages
- Publication dates
- Excerpt and full content views

### Mike Carney Health (MCH)
- Gym facilities information
- Membership benefits
- Staff and family membership details
- Contact information for MCH team
- Class schedules

### Policies
- Categorized policy documents
- Policy descriptions
- PDF downloads
- Last updated dates
- Easy search and filtering

### Events
- Upcoming events calendar
- Event details (date, time, location)
- Past events archive
- RSVP information (future enhancement)

### Downloads
- Categorized documents
- PDF forms and resources
- File size information
- Easy download access
- Quick search functionality

### Staff Submissions
- Share personal stories
- Submit improvement ideas
- View submission status
- Receive feedback from moderators
- Track submission history

### Search
- Global content search
- Search across news, policies, and events
- Relevance-based results
- Category filtering

## Admin Features

### Admin Dashboard
- Overview statistics
- Pending submission count
- Quick action links
- Recent activity (future enhancement)

### Content Management

#### Announcements
- Create public or private announcements
- Rich text content
- Publication control
- Edit and delete capabilities

#### News Management
- Create and edit articles
- Set publication status
- Add excerpts for previews
- Generate URL-friendly slugs
- Schedule publishing (future enhancement)

#### Event Management
- Create events with details
- Set date, time, and location
- Publish/unpublish control
- Manage past and upcoming events

#### Policy Management
- Upload policy documents
- Categorize policies
- Add descriptions
- Update and version control

#### Downloads Management
- Upload documents and forms
- Organize by category
- Track file sizes
- Update or replace files

### Submission Moderation
- View all submissions
- Pending submissions highlighted
- Approve or reject with feedback
- Author notification
- Submission history

### User Management (Admin Only)
- View all users
- Change user roles
- Manage access permissions
- User activity tracking (future enhancement)

## Accessibility Features (WCAG 2.2 AA)

### Semantic HTML
- Proper heading hierarchy
- Semantic elements (`<nav>`, `<main>`, `<article>`, etc.)
- Structured content

### Keyboard Navigation
- All interactive elements keyboard accessible
- Skip to main content link
- Visible focus indicators
- Logical tab order

### Screen Reader Support
- ARIA labels for all interactive elements
- ARIA hidden for decorative icons
- Descriptive link text
- Form labels and error messages

### Visual Accessibility
- High contrast color scheme (4.5:1 minimum)
- Responsive text sizing
- Clear visual hierarchy
- Focus visible states

### Forms
- Associated labels
- Error messages with role="alert"
- Required field indicators
- Clear instructions

## Technical Features

### Performance
- Server-side rendering (SSR)
- Optimized images with Next.js Image
- Code splitting
- Cached database queries
- Vercel Edge Network CDN

### SEO
- Dynamic meta tags
- Semantic HTML structure
- Sitemap generation (future enhancement)
- Open Graph tags (future enhancement)

### Mobile Responsive
- Mobile-first design
- Responsive navigation
- Touch-friendly interfaces
- Optimized for all screen sizes

### File Management
- Vercel Blob storage
- Secure file uploads
- File type validation
- Size limit enforcement
- CDN-served files

### Database
- Vercel Postgres
- Drizzle ORM
- Type-safe queries
- Relationship management
- Migration support

## Future Enhancements

### Planned Features
- [ ] Event RSVP system
- [ ] Email notifications
- [ ] Document versioning
- [ ] Advanced search filters
- [ ] User profiles
- [ ] Comments on news articles
- [ ] Activity feed
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Calendar integration
- [ ] File upload in submissions
- [ ] Analytics dashboard
- [ ] Newsletter subscription
- [ ] Social sharing

### Integration Opportunities
- Microsoft Teams integration
- Calendar sync (Outlook, Google)
- Single sign-on (SSO) expansion
- Document management system
- HR system integration
- Survey and feedback tools

## Browser Support

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Mobile Browsers
- iOS Safari
- Chrome Mobile
- Samsung Internet

## Data Privacy

### Information Collected
- Authentication data (email, name)
- User role and permissions
- Content created by users
- Submission data
- Usage analytics (if enabled)

### Data Protection
- Encrypted connections (HTTPS)
- Secure authentication
- Role-based access
- Regular security updates
- GDPR-compliant (with proper configuration)

## Support & Training

### User Resources
- Comprehensive README
- Deployment guide
- Feature documentation
- Accessibility guidelines
- Code quality rules

### Admin Training Topics
- Content management
- Submission moderation
- User role management
- File uploads
- Security best practices

---

This feature set provides a solid foundation for staff wellbeing and communication, with room for growth based on user feedback and organizational needs.
