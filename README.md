# Subscription Cancellation Flow Implementation

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup and seed database
npm run db:setup

# 3. Start development server
npm run dev
```

The application will be available at `http://localhost:3000` (or next available port). Click "Manage Subscription" → "Cancel Migrate Mate" to test the cancellation flow.

## What's Built

### Complete Cancellation Flow

- **Multi-Step Modal Interface**: Dynamic step progression with A/B testing support and responsive mobile design
- **Advanced Reason Collection**: Structured cancellation reasons with follow-up explanations
- **Interactive Reason Selection**: Dynamic UI that shows/hides options based on selection
- **Follow-up Validation**: Minimum character requirements and price validation for detailed feedback
- **Job Status Questionnaire**: Comprehensive 4-question survey for users who found jobs
- **Visa Consultation System**: Immigration lawyer availability assessment and visa type collection
- **Smart Downsell System**: $10 discount offers with double-dip prevention and automatic variant switching
- **Responsive Navigation**: Conditional back button visibility and mobile-optimized step progression
- **Mobile-First Design**: Swipe-to-close modal, responsive image handling, and mobile-optimized layouts

### Advanced Backend Infrastructure

- **Simplified Database Schema**: Optimized `reason` + `explanation` structure for cancel reasons
- **API Routes**: Full RESTful endpoints for all cancellation operations
- **Enhanced Validation Layer**: Zod-based validation with enum constraints for cancel reasons
- **Migration System**: Incremental database migrations with schema simplification
- **Mock User System**: Development-friendly user simulation with pre-seeded test data

### Job Questionnaire & Visa System

- **Database Fields**: 6 new columns for comprehensive data collection (4 job-related + 2 visa-related)
- **Form Validation**: Client and server-side validation for all questionnaire and visa fields
- **API Integration**: PATCH endpoint updates for questionnaire and visa consultation responses
- **Progress Tracking**: Seamless integration with step-based flow
- **Shared Logic**: Custom useVisaForm hook for code reuse between visa components

## Technical Stack

- **Framework**: Next.js 15.3.5 with App Router and Turbopack
- **Language**: TypeScript with strict type checking
- **Database**: Supabase (PostgreSQL) with local development setup
- **HTTP Client**: Axios 1.11.0 with interceptors
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: React Context + Custom Hooks

## Database Seeding and Supabase Usage

### Automatic Setup Process

The `npm run db:setup` command performs the following:

1. **Start Supabase**: Launches local Supabase instance with PostgreSQL, API server, and Studio dashboard
2. **Run Migrations**: Applies all database migrations in order:
   - Initial schema (users, subscriptions, cancellations tables)
   - Row Level Security policies
   - Additional fields for job questionnaire and visa consultation
   - Subscription cancellation fields
   - RLS policy fixes for service role access
3. **Seed Data**: Automatically seeds the database with test users and subscriptions:
   - **3 Test Users**: user1@example.com, user2@example.com, user3@example.com with fixed UUIDs
   - **3 Subscriptions**: $25/month and $29/month plans in active status
   - **Pricing Format**: All prices stored in cents (2500 = $25.00)

### Supabase Services

The local Supabase instance provides:

- **Database**: PostgreSQL on port 54322
- **API**: RESTful API on port 54321
- **Studio**: Database management UI on port 54323
- **Auth**: Authentication service (configured but not used in this demo)
- **Storage**: File storage service
- **Functions**: Edge functions support

### Database Configuration

- **Row Level Security**: Enabled on all tables with policies that allow service role access
- **Service Role Access**: App uses `supabaseAdmin` client with service role key to bypass RLS for demo purposes
- **Data Persistence**: All user interactions and cancellation data are stored in PostgreSQL
- **Validation**: Server-side validation ensures data integrity with Zod schemas

## Environment Configuration

## Feature Breakdown

### A/B Testing Implementation

- **Variant A**: Initial Reason → Advanced Reason Collection/Job Questionnaire → Job Feedback → Visa Consultation → Final
- **Variant B**: Initial Reason → Advanced Reason Collection/Job Questionnaire → Job Feedback → Visa Consultation → Downsell → Final
- **Smart Variant Switching**: Users who accept downsell offers are automatically switched to Variant A for future cancellation attempts
- Secure random assignment using `crypto.getRandomValues()`
- Dynamic step calculation based on user path and variant assignment
- Downsell usage tracking prevents users from seeing offers multiple times

## Database Schema

### Core Tables

```sql
-- Users table with basic authentication
users (id, email, created_at)

-- Subscriptions with pricing and status
subscriptions (
  id, user_id, monthly_price, status,
  has_cancelled, cancelled_at, expires_at,
  created_at, updated_at
)

-- Cancellations with comprehensive tracking
cancellations (
  id, user_id, subscription_id, downsell_variant,
  reason, explanation, accepted_downsell, has_job, created_at,
  -- Job questionnaire fields
  found_job_with_migratemate,
  roles_applied_count,
  companies_emailed_count,
  companies_interviewed_count,
  -- Visa consultation fields
  has_immigration_lawyer,
  visa_type
)
```

## Testing the Application

### Cancellation Flow Compliance

**Mobile + Desktop Design**: Responsive design matches Figma specifications
**State Transitions**: All step progressions work correctly with proper validation
**A/B Testing**: Deterministic variant assignment with secure randomization
**Supabase Persistence**: All fields properly stored with required field validation
**Security Enforced**: RLS enabled, input validation, no data leaks

### Manual Testing Flow

1. Navigate to `http://localhost:3000`
2. Click "Manage Subscription" to expand
3. Click "Cancel Migrate Mate" (red button)
4. Complete the cancellation flow:
   - **Job Found Path**: Select "Found a job" → Fill job questionnaire → Provide feedback on how MM helped → Visa consultation → Final step
   - **No Job Path**: Select other reason → Choose specific reason + provide explanation → Final step
   - **Visa Paths**:
     - If found job with MM: CancellationVisa component
     - If found job without MM: CancellationVisaNoJob component
   - Test different reasons to see dynamic follow-up questions
   - Verify validation requirements (25+ chars, valid price inputs, visa type required)
   - Observe step progression, data persistence, and reset functionality

### API Testing

- All endpoints available at `/api/cancellations` and `/api/subscriptions`
- Database operations can be verified via Supabase dashboard
- Console logs show request/response details during development

#### Supabase Connection Issues

```bash
# Check if Supabase is running
npx supabase status

# If not running, restart setup
npm run db:setup
```

#### Permission Issues with .next/trace

This is a Windows-specific issue that doesn't affect functionality. The app will still work correctly despite the permission warning.

#### Database Reset

If you need to reset the database completely:

```bash
npx supabase db reset
```

#### Missing Dependencies

If you encounter missing dependency errors:

```bash
# Clean install
rm -rf node_modules
npm install
```

### Environment Verification

To verify your setup is working correctly:

1. **Database Connection**: Check `http://localhost:54323` for Supabase Studio
2. **API Endpoints**: Test `http://localhost:3000/api/users` should return seeded users
3. **Cancellation API**: Test `http://localhost:3000/api/cancellations` should return empty array initially
