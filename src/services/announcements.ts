import { mockApiCall } from "./api";
import type { Announcement, ApiResponse } from "@/types";

const mockAnnouncements: Announcement[] = [
  {
    id: "A1", title: "Semester Break Schedule", content: "The institute will be closed from March 15-25 for the spring break. All pending assignments must be submitted before March 14.",
    author: "Jane Smith", authorRole: "Institute Owner", instituteId: "1", targetRoles: ["instructor", "student", "admin"],
    priority: "high", status: "published", createdAt: "2026-03-01T10:00:00Z", pinned: true,
  },
  {
    id: "A2", title: "New Library Resources Available", content: "We've added 50+ new e-books and research papers to the digital library. Check out the latest additions in the Library section.",
    author: "Mike Johnson", authorRole: "Admin", instituteId: "1", targetRoles: ["instructor", "student"],
    priority: "medium", status: "published", createdAt: "2026-02-28T14:30:00Z", pinned: false,
  },
  {
    id: "A3", title: "Google Campus Recruitment Drive", content: "Google will be visiting our campus on March 20 for recruitment. Eligible students must register by March 12. Minimum 75% attendance required.",
    author: "Sarah Wilson", authorRole: "Instructor", instituteId: "1", targetRoles: ["student"],
    priority: "urgent", status: "published", createdAt: "2026-03-02T09:00:00Z", expiresAt: "2026-03-20T23:59:00Z", pinned: true,
  },
  {
    id: "A4", title: "Platform Maintenance Notice", content: "Scheduled maintenance on March 10, 2-4 AM IST. Services may be briefly unavailable.",
    author: "John Doe", authorRole: "Platform Owner", instituteId: "1", targetRoles: ["institute_owner", "admin", "instructor", "student"],
    priority: "medium", status: "published", createdAt: "2026-03-03T11:00:00Z", pinned: false,
  },
  {
    id: "A5", title: "IELTS Batch Starting Soon", content: "New IELTS preparation batch starting from March 18. Limited seats available. Contact your counselor for enrollment.",
    author: "Jane Smith", authorRole: "Institute Owner", instituteId: "1", targetRoles: ["student"],
    priority: "medium", status: "published", createdAt: "2026-03-04T08:00:00Z", pinned: false,
  },
  {
    id: "A6", title: "Fee Payment Reminder", content: "Last date for Q2 fee payment is March 31. Late payments will incur a 5% surcharge.",
    author: "Mike Johnson", authorRole: "Admin", instituteId: "1", targetRoles: ["student"],
    priority: "high", status: "draft", createdAt: "2026-03-04T10:00:00Z", pinned: false,
  },
];

export async function fetchAnnouncements(instituteId?: string): Promise<ApiResponse<Announcement[]>> {
  const filtered = instituteId ? mockAnnouncements.filter((a) => a.instituteId === instituteId) : mockAnnouncements;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchAnnouncementById(id: string): Promise<ApiResponse<Announcement>> {
  const announcement = mockAnnouncements.find((a) => a.id === id);
  if (!announcement) throw new Error("Announcement not found");
  return mockApiCall({ data: announcement });
}

export async function createAnnouncement(announcement: Omit<Announcement, "id">): Promise<ApiResponse<Announcement>> {
  const newAnnouncement: Announcement = { ...announcement, id: `A${mockAnnouncements.length + 1}` };
  mockAnnouncements.push(newAnnouncement);
  return mockApiCall({ data: newAnnouncement, message: "Announcement created successfully" });
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<ApiResponse<Announcement>> {
  const idx = mockAnnouncements.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Announcement not found");
  mockAnnouncements[idx] = { ...mockAnnouncements[idx], ...data };
  return mockApiCall({ data: mockAnnouncements[idx], message: "Announcement updated successfully" });
}

export async function deleteAnnouncement(id: string): Promise<ApiResponse<null>> {
  const idx = mockAnnouncements.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Announcement not found");
  mockAnnouncements.splice(idx, 1);
  return mockApiCall({ data: null, message: "Announcement deleted successfully" });
}
