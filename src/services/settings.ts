import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface OrganizationSettings {
  id: string;
  name: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string;
  type: "institute" | "consultancy" | "company";
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  status: "active" | "cancelled" | "expired" | "trial";
  startDate: string;
  nextBillingDate: string;
  features: string[];
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: "paid" | "pending" | "failed";
  invoiceUrl: string;
}

const mockOrgSettings: OrganizationSettings = {
  id: "1", name: "TechVerse Academy", logo: "TV", website: "https://techverse.academy",
  email: "admin@techverse.academy", phone: "+1 234-567-8900",
  address: "123 Tech Street, Silicon Valley", city: "San Francisco", state: "CA",
  description: "Premier technology education institute offering comprehensive full-stack development programs.",
  type: "institute",
};

const mockNotificationSettings: NotificationSetting[] = [
  { id: "N1", label: "Student enrollment notifications", description: "Get notified when a new student enrolls", enabled: true, category: "academic" },
  { id: "N2", label: "Test submission alerts", description: "Notify when students submit tests", enabled: true, category: "academic" },
  { id: "N3", label: "Performance alerts", description: "Alert when students fall below threshold", enabled: true, category: "academic" },
  { id: "N4", label: "Weekly reports", description: "Receive weekly summary reports via email", enabled: false, category: "reports" },
  { id: "N5", label: "System updates", description: "Get notified about platform updates", enabled: true, category: "system" },
  { id: "N6", label: "Visa status changes", description: "Notify on visa application status updates", enabled: true, category: "consultancy" },
  { id: "N7", label: "New job applications", description: "Alert when candidates apply to vacancies", enabled: true, category: "recruitment" },
  { id: "N8", label: "Payment reminders", description: "Send payment due date reminders", enabled: false, category: "billing" },
];

const mockSubscription: SubscriptionPlan = {
  id: "SUB1", name: "Institute Pro", price: 49, period: "monthly",
  status: "active", startDate: "2025-06-01", nextBillingDate: "2026-04-01",
  features: ["Unlimited courses", "Student management", "Test & assessment tools", "Attendance tracking", "Progress analytics", "Library management"],
};

const mockBillingHistory: BillingHistory[] = [
  { id: "B1", date: "2026-03-01", amount: 49, description: "Institute Pro - Monthly", status: "paid", invoiceUrl: "#" },
  { id: "B2", date: "2026-02-01", amount: 49, description: "Institute Pro - Monthly", status: "paid", invoiceUrl: "#" },
  { id: "B3", date: "2026-01-01", amount: 49, description: "Institute Pro - Monthly", status: "paid", invoiceUrl: "#" },
  { id: "B4", date: "2025-12-01", amount: 49, description: "Institute Pro - Monthly", status: "paid", invoiceUrl: "#" },
];

export async function fetchOrganizationSettings(): Promise<ApiResponse<OrganizationSettings>> {
  return mockApiCall({ data: mockOrgSettings });
}

export async function updateOrganizationSettings(data: Partial<OrganizationSettings>): Promise<ApiResponse<OrganizationSettings>> {
  Object.assign(mockOrgSettings, data);
  return mockApiCall({ data: mockOrgSettings, message: "Settings updated successfully" });
}

export async function fetchNotificationSettings(): Promise<ApiResponse<NotificationSetting[]>> {
  return mockApiCall({ data: mockNotificationSettings });
}

export async function updateNotificationSetting(id: string, enabled: boolean): Promise<ApiResponse<NotificationSetting>> {
  const setting = mockNotificationSettings.find((s) => s.id === id);
  if (!setting) throw new Error("Not found");
  setting.enabled = enabled;
  return mockApiCall({ data: setting, message: "Updated" });
}

export async function fetchSubscription(): Promise<ApiResponse<SubscriptionPlan>> {
  return mockApiCall({ data: mockSubscription });
}

export async function fetchBillingHistory(): Promise<ApiResponse<BillingHistory[]>> {
  return mockApiCall({ data: mockBillingHistory });
}
