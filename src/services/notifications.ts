import { mockApiCall } from "./api";
import type { Notification, ApiResponse } from "@/types";

const mockNotifications: Notification[] = [
  { id: "N1", title: "New Student Enrolled", message: "Alice Johnson has enrolled in Web Development course", type: "success", read: false, createdAt: "2026-03-04T10:30:00Z", userId: "U001", link: "/students" },
  { id: "N2", title: "Test Submission Due", message: "JavaScript Fundamentals quiz deadline is tomorrow", type: "warning", read: false, createdAt: "2026-03-04T09:15:00Z", userId: "U001", link: "/tests" },
  { id: "N3", title: "Visa Application Update", message: "Student Raj Patel's UK visa has been approved", type: "info", read: false, createdAt: "2026-03-04T08:00:00Z", userId: "U001", link: "/consultancy/visa" },
  { id: "N4", title: "New Announcement Posted", message: "Institute owner posted: Semester break schedule", type: "info", read: true, createdAt: "2026-03-03T16:45:00Z", userId: "U001", link: "/announcements" },
  { id: "N5", title: "Placement Drive", message: "Google campus recruitment drive starts next week", type: "success", read: true, createdAt: "2026-03-03T14:20:00Z", userId: "U001", link: "/placements" },
  { id: "N6", title: "System Maintenance", message: "Platform will be under maintenance on March 10th", type: "warning", read: true, createdAt: "2026-03-02T11:00:00Z", userId: "U001" },
  { id: "N7", title: "University Offer Received", message: "Student Priya got offer from University of Melbourne", type: "success", read: false, createdAt: "2026-03-04T07:30:00Z", userId: "U001", link: "/consultancy/university" },
  { id: "N8", title: "Course Completion", message: "15 students completed Python Advanced course", type: "info", read: true, createdAt: "2026-03-01T13:00:00Z", userId: "U001", link: "/courses" },
];

export async function fetchNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
  const filtered = mockNotifications.filter((n) => n.userId === userId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function markNotificationRead(id: string): Promise<ApiResponse<Notification>> {
  const idx = mockNotifications.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Notification not found");
  mockNotifications[idx] = { ...mockNotifications[idx], read: true };
  return mockApiCall({ data: mockNotifications[idx] });
}

export async function markAllNotificationsRead(userId: string): Promise<ApiResponse<null>> {
  mockNotifications.forEach((n, i) => {
    if (n.userId === userId) mockNotifications[i] = { ...n, read: true };
  });
  return mockApiCall({ data: null, message: "All notifications marked as read" });
}

export async function deleteNotification(id: string): Promise<ApiResponse<null>> {
  const idx = mockNotifications.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Notification not found");
  mockNotifications.splice(idx, 1);
  return mockApiCall({ data: null, message: "Notification deleted" });
}
