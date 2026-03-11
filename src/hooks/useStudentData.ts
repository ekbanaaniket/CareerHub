// ============= Student Data Hooks =============
import { useQuery } from "@tanstack/react-query";
import {
  fetchStudentInstitutes,
  fetchStudentCourses,
  fetchStudentLectures,
  fetchStudentTests,
  fetchStudentConsultancies,
  fetchStudentCompanyGroups,
  fetchStudentPlacements,
} from "@/services/studentData";
import { useMemo } from "react";

export function useStudentInstitutes() {
  return useQuery({
    queryKey: ["studentInstitutes"],
    queryFn: fetchStudentInstitutes,
    select: (res) => res.data,
  });
}

export function useStudentCourses() {
  const query = useQuery({
    queryKey: ["studentCourses"],
    queryFn: fetchStudentCourses,
    select: (res) => res.data,
  });

  const grouped = useMemo(() => {
    if (!query.data) return {};
    return query.data.reduce((acc, course) => {
      if (!acc[course.instituteId]) acc[course.instituteId] = { instituteName: course.instituteName, courses: [] };
      acc[course.instituteId].courses.push(course);
      return acc;
    }, {} as Record<string, { instituteName: string; courses: typeof query.data }>);
  }, [query.data]);

  return { ...query, grouped };
}

export function useStudentLectures() {
  const query = useQuery({
    queryKey: ["studentLectures"],
    queryFn: fetchStudentLectures,
    select: (res) => res.data,
  });

  const grouped = useMemo(() => {
    if (!query.data) return {};
    return query.data.reduce((acc, lec) => {
      if (!acc[lec.instituteId]) acc[lec.instituteId] = { instituteName: lec.instituteName, lectures: [] };
      acc[lec.instituteId].lectures.push(lec);
      return acc;
    }, {} as Record<string, { instituteName: string; lectures: typeof query.data }>);
  }, [query.data]);

  return { ...query, grouped };
}

export function useStudentTests() {
  const query = useQuery({
    queryKey: ["studentTests"],
    queryFn: fetchStudentTests,
    select: (res) => res.data,
  });

  const grouped = useMemo(() => {
    if (!query.data) return {};
    return query.data.reduce((acc, test) => {
      if (!acc[test.instituteId]) acc[test.instituteId] = { instituteName: test.instituteName, tests: [] };
      acc[test.instituteId].tests.push(test);
      return acc;
    }, {} as Record<string, { instituteName: string; tests: typeof query.data }>);
  }, [query.data]);

  return { ...query, grouped };
}

export function useStudentConsultancies() {
  return useQuery({
    queryKey: ["studentConsultancies"],
    queryFn: fetchStudentConsultancies,
    select: (res) => res.data,
  });
}

export function useStudentCompanyGroups() {
  return useQuery({
    queryKey: ["studentCompanyGroups"],
    queryFn: fetchStudentCompanyGroups,
    select: (res) => res.data,
  });
}

export function useStudentPlacements() {
  const query = useQuery({
    queryKey: ["studentPlacements"],
    queryFn: fetchStudentPlacements,
    select: (res) => res.data,
  });

  const grouped = useMemo(() => {
    if (!query.data) return {};
    return query.data.reduce((acc, p) => {
      if (!acc[p.instituteId]) acc[p.instituteId] = { instituteName: p.instituteName, placements: [] };
      acc[p.instituteId].placements.push(p);
      return acc;
    }, {} as Record<string, { instituteName: string; placements: typeof query.data }>);
  }, [query.data]);

  return { ...query, grouped };
}
