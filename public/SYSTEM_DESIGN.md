# EduPlatform — System Design & Database Blueprint

> **Purpose**: This document is the single source of truth for the system architecture, database schema, entity relationships, and data flow. Any developer can read this and understand how the entire platform works.

---

## 1. System Overview

EduPlatform is a **multi-tenant SaaS platform** that connects four core entity types:

| Entity | Description |
|--------|-------------|
| **Institute** | Educational organizations offering courses, lectures, tests |
| **Consultancy** | Agencies providing visa, university application, and language services |
| **Company** | Employers posting job vacancies and hiring students |
| **Student** | Learners who register with institutes, consultancies, and apply to companies |

A **Platform Owner** manages all entities. Each entity type has its own **owner role** who manages their organization.

---

## 2. Role Hierarchy

```
platform_owner
├── institute_owner    → manages one institute
│   ├── admin          → full institute access
│   ├── instructor     → assigned courses, lectures, tests
│   └── staff          → limited access
├── consultancy_owner  → manages one consultancy
│   ├── counselor      → assigned students, visa/university cases
│   └── staff
├── company            → manages one company, posts vacancies
└── student            → registered with multiple institutes/consultancies, applies to companies
    └── guest          → browse-only, no enrollments
```

---

## 3. Database Schema

### 3.1 Core Identity Tables

```sql
-- Users (managed by auth provider, e.g., Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Roles (separate table — NEVER on users table)
CREATE TYPE app_role AS ENUM (
  'platform_owner', 'institute_owner', 'consultancy_owner',
  'company', 'admin', 'instructor', 'staff',
  'counselor', 'student', 'guest'
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  entity_id UUID,          -- FK to institute/consultancy/company (NULL for platform_owner/student)
  entity_type TEXT,        -- 'institute' | 'consultancy' | 'company'
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role, entity_id)
);

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
```

### 3.2 Organization Tables

```sql
-- Institutes
CREATE TABLE institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  city TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  type TEXT DEFAULT 'education',  -- 'education' | 'consultancy' | 'hybrid'
  status TEXT DEFAULT 'pending',  -- 'active' | 'suspended' | 'pending'
  plan TEXT DEFAULT 'free',       -- 'free' | 'basic' | 'premium'
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Consultancies
CREATE TABLE consultancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  city TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  specializations TEXT[],
  countries TEXT[],
  status TEXT DEFAULT 'pending',
  plan TEXT DEFAULT 'free',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Companies
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  city TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  status TEXT DEFAULT 'pending',
  plan TEXT DEFAULT 'free',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 Student Registrations (Many-to-Many)

```sql
-- A student can register with multiple institutes
CREATE TABLE student_institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  batch TEXT,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',   -- 'active' | 'completed' | 'dropped'
  UNIQUE (student_id, institute_id)
);

-- A student can register with multiple consultancies
CREATE TABLE student_consultancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultancy_id UUID REFERENCES consultancies(id) ON DELETE CASCADE,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active',
  UNIQUE (student_id, consultancy_id)
);
```

### 3.4 Academic Tables (Institute-scoped)

```sql
-- Courses belong to an institute
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  modules INTEGER DEFAULT 0,
  topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student ↔ Course enrollment
CREATE TABLE student_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress NUMERIC(5,2) DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (student_id, course_id)
);

-- Lectures belong to a course
CREATE TABLE lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  instructor_id UUID REFERENCES users(id),
  duration TEXT,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',  -- 'scheduled' | 'live' | 'recorded'
  video_url TEXT,
  module TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tests belong to a course
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Quiz',       -- 'Quiz' | 'Exam' | 'Assignment'
  date TIMESTAMPTZ,
  duration TEXT,
  questions INTEGER,
  max_marks INTEGER,
  status TEXT DEFAULT 'draft',    -- 'draft' | 'upcoming' | 'in_progress' | 'completed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Test submissions
CREATE TABLE test_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score NUMERIC(5,2),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (test_id, student_id)
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  date DATE NOT NULL,
  status TEXT DEFAULT 'present',  -- 'present' | 'absent' | 'late' | 'excused'
  UNIQUE (student_id, course_id, date)
);

-- Library resources
CREATE TABLE library_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT,
  type TEXT DEFAULT 'book',       -- 'book' | 'pdf' | 'video' | 'link'
  category TEXT,
  file_url TEXT,
  available BOOLEAN DEFAULT true,
  rating NUMERIC(3,2),
  borrow_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fees
CREATE TABLE fee_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  type TEXT,                      -- 'tuition' | 'exam' | 'lab' | 'library'
  status TEXT DEFAULT 'pending',  -- 'paid' | 'pending' | 'overdue' | 'waived'
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.5 Consultancy Tables

```sql
-- Visa Applications
CREATE TABLE visa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultancy_id UUID REFERENCES consultancies(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES users(id),
  country TEXT NOT NULL,
  visa_type TEXT,
  status TEXT DEFAULT 'pending',
  applied_date DATE,
  interview_date DATE,
  documents TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- University Applications
CREATE TABLE university_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultancy_id UUID REFERENCES consultancies(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES users(id),
  university_name TEXT NOT NULL,
  country TEXT,
  program TEXT,
  intake TEXT,
  status TEXT DEFAULT 'shortlisted',
  applied_date DATE,
  deadline DATE,
  scholarship_applied BOOLEAN DEFAULT false,
  scholarship_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Language Courses (offered by consultancies)
CREATE TABLE language_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultancy_id UUID REFERENCES consultancies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT,                     -- 'beginner' | 'intermediate' | 'advanced'
  instructor_id UUID REFERENCES users(id),
  schedule TEXT,
  start_date DATE,
  end_date DATE,
  test_type TEXT,                 -- 'IELTS' | 'TOEFL' | 'PTE' | etc.
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Student ↔ Language Course enrollment
CREATE TABLE student_language_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_course_id UUID REFERENCES language_courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, language_course_id)
);

-- Counselors (extend user_roles, but with specialization metadata)
CREATE TABLE counselor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  consultancy_id UUID REFERENCES consultancies(id) ON DELETE CASCADE,
  specializations TEXT[],
  countries TEXT[],
  rating NUMERIC(3,2) DEFAULT 0,
  total_placements INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.6 Company & Recruitment Tables

```sql
-- Job Vacancies
CREATE TABLE vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  positions INTEGER DEFAULT 1,
  location TEXT,
  location_type TEXT DEFAULT 'onsite',  -- 'onsite' | 'remote' | 'hybrid'
  salary TEXT,
  skills TEXT[],
  experience TEXT,
  type TEXT DEFAULT 'full-time',        -- 'full-time' | 'part-time' | 'internship' | 'contract'
  deadline DATE,
  status TEXT DEFAULT 'draft',          -- 'draft' | 'active' | 'closed'
  is_featured BOOLEAN DEFAULT false,
  posted_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job Applications (THE KEY TABLE for grouping)
-- Grouped queries: GROUP BY company_id → vacancy_id → applicant rows
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id UUID REFERENCES vacancies(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'applied',
  -- Status flow: applied → shortlisted → interviewing → selected/rejected → offer_sent → offer_accepted/offer_declined
  applied_date DATE DEFAULT CURRENT_DATE,
  resume_url TEXT,
  match_score NUMERIC(5,2),
  interview_date DATE,
  interview_notes TEXT,
  offer_salary TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (vacancy_id, student_id)
);

-- Placements (finalized hires)
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_application_id UUID REFERENCES job_applications(id),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  vacancy_id UUID REFERENCES vacancies(id),
  position TEXT,
  salary TEXT,
  start_date DATE,
  status TEXT DEFAULT 'placed',    -- 'placed' | 'offered' | 'joined' | 'cancelled'
  institute_id UUID REFERENCES institutes(id),  -- which institute the student came from
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Placement Drives (institute ↔ company partnership events)
CREATE TABLE placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  institute_id UUID REFERENCES institutes(id),
  positions TEXT[],
  date DATE,
  registered_students INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  package_range TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.7 Platform-wide Tables

```sql
-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id),
  entity_id UUID,          -- institute/consultancy/company id (NULL = platform-wide)
  entity_type TEXT,
  target_roles app_role[],
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'draft',
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Featured entities (for landing page / explore)
CREATE TABLE featured_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,    -- 'institute' | 'consultancy' | 'company' | 'vacancy'
  position INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (per-entity configuration)
CREATE TABLE entity_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB,
  UNIQUE (entity_id, entity_type, key)
);

-- Custom Roles (institute-scoped permission bundles)
CREATE TABLE custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL,   -- {"students": true, "courses": true, "tests": false, ...}
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Per-user permission overrides
CREATE TABLE user_permission_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES users(id),
  permissions TEXT[],
  entity_id UUID,
  entity_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Entity Relationship Diagram (Text)

```
users ──────┬──── user_roles ────── institutes
            │                  ├── consultancies
            │                  └── companies
            │
            ├── student_institutes ──── institutes
            ├── student_consultancies ── consultancies
            │
            ├── student_courses ──── courses ──── institutes
            │                        ├── lectures
            │                        └── tests ──── test_submissions
            │
            ├── attendance
            ├── fee_records
            │
            ├── visa_applications ──── consultancies
            ├── university_applications ── consultancies
            ├── student_language_courses ── language_courses ── consultancies
            │
            ├── job_applications ──── vacancies ──── companies
            └── placements ──── companies + institutes
```

---

## 5. Key Query Patterns

### 5.1 Company Applications Grouped View (Platform Owner)

```sql
-- Get all applications grouped by company → vacancy
SELECT
  c.id AS company_id, c.name AS company_name, c.industry,
  v.id AS vacancy_id, v.title AS vacancy_title, v.positions, v.salary, v.status,
  ja.id AS application_id, ja.status AS app_status, ja.applied_date, ja.match_score,
  u.full_name AS student_name, u.email AS student_email
FROM companies c
JOIN vacancies v ON v.company_id = c.id
JOIN job_applications ja ON ja.vacancy_id = v.id
JOIN users u ON u.id = ja.student_id
ORDER BY c.name, v.title, ja.applied_date DESC;
```

### 5.2 Student Dashboard (aggregate across entities)

```sql
-- All institutes a student is registered with
SELECT i.* FROM institutes i
JOIN student_institutes si ON si.institute_id = i.id
WHERE si.student_id = :user_id AND si.status = 'active';

-- All courses across all institutes
SELECT c.*, sc.progress FROM courses c
JOIN student_courses sc ON sc.course_id = c.id
WHERE sc.student_id = :user_id;

-- All job applications
SELECT ja.*, v.title, co.name AS company_name
FROM job_applications ja
JOIN vacancies v ON v.id = ja.vacancy_id
JOIN companies co ON co.id = v.company_id
WHERE ja.student_id = :user_id;
```

### 5.3 Institute Dashboard

```sql
-- Stats in a single query
SELECT
  COUNT(DISTINCT si.student_id) AS total_students,
  COUNT(DISTINCT c.id) AS active_courses,
  COUNT(DISTINCT t.id) AS tests_conducted,
  AVG(ts.score) AS avg_performance
FROM institutes i
LEFT JOIN student_institutes si ON si.institute_id = i.id
LEFT JOIN courses c ON c.institute_id = i.id AND c.status = 'active'
LEFT JOIN tests t ON t.institute_id = i.id AND t.status = 'completed'
LEFT JOIN test_submissions ts ON ts.test_id = t.id
WHERE i.id = :institute_id;
```

---

## 6. Data Flow & Grouping Strategy

### Why group data hierarchically?

1. **Faster queries**: Fetching by parent entity (company → vacancies → applications) reduces JOINs
2. **Better UX**: Users see data organized by context, not flat lists
3. **Efficient inserts**: Each table has a clear parent FK, so insert operations are simple
4. **Scalability**: Indexes on `company_id`, `institute_id`, `student_id` make lookups O(log n)

### Recommended indexes:

```sql
CREATE INDEX idx_vacancies_company ON vacancies(company_id);
CREATE INDEX idx_job_apps_vacancy ON job_applications(vacancy_id);
CREATE INDEX idx_job_apps_student ON job_applications(student_id);
CREATE INDEX idx_student_institutes ON student_institutes(student_id);
CREATE INDEX idx_student_consultancies ON student_consultancies(student_id);
CREATE INDEX idx_courses_institute ON courses(institute_id);
CREATE INDEX idx_lectures_course ON lectures(course_id);
CREATE INDEX idx_tests_course ON tests(course_id);
CREATE INDEX idx_attendance_student ON attendance(student_id, date);
CREATE INDEX idx_visa_apps_student ON visa_applications(student_id);
CREATE INDEX idx_uni_apps_student ON university_applications(student_id);
CREATE INDEX idx_placements_company ON placements(company_id);
CREATE INDEX idx_placements_student ON placements(student_id);
```

---

## 7. API Structure (Service Layer)

Each service file maps to a domain:

| Service File | Domain | Key Operations |
|---|---|---|
| `navigation.ts` | Sidebar config | `fetchNavigation(role)` |
| `breadcrumbs.ts` | Breadcrumb labels | `fetchBreadcrumbConfig()` |
| `dashboard.ts` | Institute dashboard | `fetchDashboardStats()`, `fetchActivities()` |
| `platformDashboard.ts` | Platform overview | `fetchPlatformDashboard()` |
| `studentDashboard.ts` | Student overview | `fetchStudentDashboard()` |
| `companyDashboard.ts` | Company overview | `fetchCompanyDashboard()` |
| `companyApplications.ts` | Grouped applications | `fetchCompanyApplications()` |
| `students.ts` | Student CRUD | `fetchStudents()`, `createStudent()`, etc. |
| `courses.ts` | Course CRUD | `fetchCourses()`, `createCourse()`, etc. |
| `lectures.ts` | Lecture CRUD | `fetchLectures()`, etc. |
| `tests.ts` | Test CRUD | `fetchTests()`, etc. |
| `library.ts` | Library CRUD | `fetchBooks()`, `fetchMaterials()` |
| `vacancies.ts` | Job CRUD | `fetchVacancies()`, `applyToVacancy()` |
| `placements.ts` | Placement records | `fetchPlacements()`, `fetchDrives()` |
| `consultancy.ts` | Visa/Uni/Language | `fetchVisaApps()`, `fetchUniApps()` |
| `managedInstitutes.ts` | Platform admin | `fetchManagedInstitutes()`, CRUD |
| `managedConsultancies.ts` | Platform admin | `fetchManagedConsultancies()`, CRUD |
| `managedCompanies.ts` | Platform admin | `fetchManagedCompanies()`, CRUD |
| `instituteAnalytics.ts` | Analytics | `fetchInstituteAnalytics()` |
| `consultancyAnalytics.ts` | Analytics | `fetchConsultancyAnalytics()` |
| `companyAnalytics.ts` | Analytics | `fetchCompanyAnalytics()` |
| `announcements.ts` | Announcements | `fetchAnnouncements()`, CRUD |
| `notifications.ts` | Notifications | `fetchNotifications()`, `markRead()` |
| `roles.ts` | Role management | `fetchRoles()`, CRUD |
| `permissions.ts` | Permission grants | `fetchPermissions()`, CRUD |
| `settings.ts` | Entity settings | `fetchSettings()`, `updateSettings()` |
| `featured.ts` | Featured content | `fetchFeatured()`, `updateFeatured()` |

---

## 8. RLS (Row-Level Security) Strategy

```sql
-- Students can only see their own data
CREATE POLICY "Students see own data" ON student_institutes
  FOR SELECT TO authenticated
  USING (student_id = auth.uid());

-- Institute owners see their institute's data
CREATE POLICY "Institute owner sees institute data" ON courses
  FOR ALL TO authenticated
  USING (institute_id IN (
    SELECT entity_id FROM user_roles
    WHERE user_id = auth.uid() AND role IN ('institute_owner', 'admin')
  ));

-- Platform owners see everything
CREATE POLICY "Platform owner sees all" ON institutes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'platform_owner'));
```

---

## 9. Migration Path

Currently all data lives in service files with mock data. To migrate to a real backend:

1. **Create tables** using the SQL above via Supabase migrations
2. **Seed data** from the mock arrays in service files
3. **Replace `mockApiCall()`** with actual Supabase client calls:
   ```ts
   // Before (mock)
   return mockApiCall({ data: mockData });

   // After (real)
   const { data, error } = await supabase
     .from('companies')
     .select('*, vacancies(*, job_applications(*, users(*)))')
     .order('name');
   return { data };
   ```
4. **Enable RLS** on all tables
5. **Add indexes** for performance

---

## 10. Summary

- **4 core entities**: Institute, Consultancy, Company, Student
- **Many-to-many** relationships via junction tables (`student_institutes`, `student_consultancies`, etc.)
- **Hierarchical grouping**: Company → Vacancy → Application (not flat)
- **Role-based access** via separate `user_roles` table with `has_role()` security definer
- **Service layer** abstracts all data access — swap mock for real DB with minimal changes
