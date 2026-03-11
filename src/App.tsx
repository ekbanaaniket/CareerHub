import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/routes/dashboard/page";
import StudentsPage from "@/routes/students/page";
import TestsPage from "@/routes/tests/page";
import ProgressPage from "@/routes/progress/page";
import LibraryPage from "@/routes/library/page";
import LecturesPage from "@/routes/lectures/page";
import CoursesPage from "@/routes/courses/page";
import RolesPage from "@/routes/roles/page";
import PlacementsPage from "@/routes/placements/page";
import SettingsPage from "@/routes/settings/page";
import AnnouncementsPage from "@/routes/announcements/page";
import VisaPage from "@/routes/consultancy/visa/page";
import UniversityPage from "@/routes/consultancy/university/page";
import LanguagePage from "@/routes/consultancy/language/page";
import CounselorsPage from "@/routes/consultancy/counselors/page";
import Attendance from "@/pages/Attendance";
import Fees from "@/pages/Fees";
import Vacancies from "@/pages/Vacancies";
import PublicInstitutes from "@/pages/PublicInstitutes";
import ManageInstitutes from "@/pages/ManageInstitutes";
import ManageConsultancies from "@/pages/ManageConsultancies";
import ManageCompanies from "@/pages/ManageCompanies";
import BrowseConsultanciesInternal from "@/pages/BrowseConsultanciesInternal";
import BrowseCompaniesInternal from "@/pages/BrowseCompaniesInternal";
import PublicInstituteProfile from "@/pages/PublicInstituteProfile";
import ExplorePage from "@/pages/ExplorePage";
import EnrollmentPage from "@/pages/Enrollment";
import BrowseInstitutes from "@/pages/BrowseInstitutes";
import BrowseConsultancies from "@/pages/BrowseConsultancies";
import BrowseJobs from "@/pages/BrowseJobs";
import PricingPage from "@/pages/PricingPage";
import ConsultancyProfile from "@/pages/ConsultancyProfile";
import FeaturedManagement from "@/pages/FeaturedManagement";
import ProfilePage from "@/pages/Profile";
import HelpSupport from "@/pages/HelpSupport";
import LoginPage from "@/pages/LoginPage";
import PermissionsPage from "@/pages/Permissions";
import InstituteAnalytics from "@/pages/analytics/InstituteAnalytics";
import ConsultancyAnalytics from "@/pages/analytics/ConsultancyAnalytics";
import CompanyAnalytics from "@/pages/analytics/CompanyAnalytics";
import CompanyApplications from "@/pages/CompanyApplications";
import RegisterPage from "@/pages/RegisterPage";
import RegistrationApprovals from "@/pages/RegistrationApprovals";
import TestDetail from "@/pages/TestDetail";
import StudentDetail from "@/pages/StudentDetail";
import CourseDetail from "@/pages/CourseDetail";
import NotFound from "./pages/NotFound";

// Student-specific pages
import MyInstitutes from "@/pages/student/MyInstitutes";
import MyCourses from "@/pages/student/MyCourses";
import MyLectures from "@/pages/student/MyLectures";
import MyTests from "@/pages/student/MyTests";
import MyProgress from "@/pages/student/MyProgress";
import MyAttendance from "@/pages/student/MyAttendance";
import MyLibrary from "@/pages/student/MyLibrary";
import MyFees from "@/pages/student/MyFees";
import MyConsultancies from "@/pages/student/MyConsultancies";
import MyVisaStatus from "@/pages/student/MyVisaStatus";
import MyUniversityApps from "@/pages/student/MyUniversityApps";
import MyLanguageCourses from "@/pages/student/MyLanguageCourses";
import MyCompanies from "@/pages/student/MyCompanies";
import MyPlacements from "@/pages/student/MyPlacements";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

function LayoutWrapper() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppProvider>
              <Routes>
                {/* Public pages — no sidebar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/browse/institutes" element={<BrowseInstitutes />} />
                <Route path="/browse/consultancies" element={<BrowseConsultancies />} />
                <Route path="/browse/jobs" element={<BrowseJobs />} />
                <Route path="/institutes/:id" element={<PublicInstituteProfile />} />
                <Route path="/consultancies/:id" element={<ConsultancyProfile />} />

                {/* App routes with sidebar layout — protected */}
                <Route element={<LayoutWrapper />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/enrollment" element={<EnrollmentPage />} />
                  <Route path="/tests" element={<TestsPage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/lectures" element={<LecturesPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/permissions" element={<PermissionsPage />} />
                  <Route path="/placements" element={<PlacementsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/vacancies" element={<Vacancies />} />
                  <Route path="/institutes" element={<PublicInstitutes />} />
                  <Route path="/institutes/manage" element={<ManageInstitutes />} />
                  <Route path="/companies" element={<BrowseCompaniesInternal />} />
                  <Route path="/companies/manage" element={<ManageCompanies />} />
                  <Route path="/consultancies/browse" element={<BrowseConsultanciesInternal />} />
                  <Route path="/consultancies/manage" element={<ManageConsultancies />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/consultancy/visa" element={<VisaPage />} />
                  <Route path="/consultancy/university" element={<UniversityPage />} />
                  <Route path="/consultancy/language" element={<LanguagePage />} />
                  <Route path="/consultancy/counselors" element={<CounselorsPage />} />
                  <Route path="/featured" element={<FeaturedManagement />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/help" element={<HelpSupport />} />
                  <Route path="/analytics/institutes" element={<InstituteAnalytics />} />
                  <Route path="/analytics/consultancies" element={<ConsultancyAnalytics />} />
                  <Route path="/analytics/companies" element={<CompanyAnalytics />} />
                  <Route path="/companies/applications" element={<CompanyApplications />} />
                  <Route path="/registrations" element={<RegistrationApprovals />} />
                  <Route path="/tests/:testId" element={<TestDetail />} />
                  <Route path="/students/:studentId" element={<StudentDetail />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />

                  {/* Student-specific routes */}
                  <Route path="/my/institutes" element={<MyInstitutes />} />
                  <Route path="/my/institutes/courses" element={<MyCourses />} />
                  <Route path="/my/institutes/lectures" element={<MyLectures />} />
                  <Route path="/my/institutes/tests" element={<MyTests />} />
                  <Route path="/my/institutes/progress" element={<MyProgress />} />
                  <Route path="/my/institutes/attendance" element={<MyAttendance />} />
                  <Route path="/my/institutes/library" element={<MyLibrary />} />
                  <Route path="/my/institutes/fees" element={<MyFees />} />
                  <Route path="/my/consultancies" element={<MyConsultancies />} />
                  <Route path="/my/consultancies/visa" element={<MyVisaStatus />} />
                  <Route path="/my/consultancies/university" element={<MyUniversityApps />} />
                  <Route path="/my/consultancies/language" element={<MyLanguageCourses />} />
                  <Route path="/my/companies" element={<MyCompanies />} />
                  <Route path="/my/companies/placements" element={<MyPlacements />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
