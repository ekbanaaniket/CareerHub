import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizationSettings, updateOrganizationSettings,
  fetchNotificationSettings, updateNotificationSetting,
  fetchSubscription, fetchBillingHistory,
} from "@/services/settings";

export function useOrgSettings() {
  return useQuery({ queryKey: ["orgSettings"], queryFn: fetchOrganizationSettings, select: (r) => r.data });
}

export function useUpdateOrgSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateOrganizationSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orgSettings"] }),
  });
}

export function useNotificationSettings() {
  return useQuery({ queryKey: ["notifSettings"], queryFn: fetchNotificationSettings, select: (r) => r.data });
}

export function useUpdateNotificationSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => updateNotificationSetting(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifSettings"] }),
  });
}

export function useSubscription() {
  return useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription, select: (r) => r.data });
}

export function useBillingHistory() {
  return useQuery({ queryKey: ["billingHistory"], queryFn: fetchBillingHistory, select: (r) => r.data });
}
