import { useParams, useNavigate } from "react-router-dom";
import { useTestDetail, useTestSubmissions } from "@/hooks/useTestDetail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, CircleHelp as HelpCircle, CircleCheck as CheckCircle2, Circle as XCircle } from "lucide-react";

export default function TestDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: testResponse, isLoading: testLoading, error: testError } = useTestDetail(id!);
  const { data: submissionsResponse } = useTestSubmissions(id!);

  const test = testResponse?.data;
  const submissions = submissionsResponse?.data;

  if (testLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading test details...</p>
        </div>
      </div>
    );
  }

  if (testError || !test) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{testError || "Test not found"}</p>
            <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    upcoming: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };

  const calculateStats = () => {
    if (!submissions || submissions.length === 0) {
      return { avgScore: 0, passCount: 0, passPercentage: 0 };
    }

    const totalScore = submissions.reduce((sum: number, s: any) => sum + (parseFloat(s.score) || 0), 0);
    const avgScore = Math.round(totalScore / submissions.length);
    const passingMarks = test.passing_marks || (test.max_marks ? test.max_marks * 0.6 : 0);
    const passCount = submissions.filter((s: any) => parseFloat(s.score) >= passingMarks).length;
    const passPercentage = Math.round((passCount / submissions.length) * 100);

    return { avgScore, passCount, passPercentage };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4 md:p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/tests")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tests
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{test.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={statusColors[test.status as keyof typeof statusColors] || "bg-gray-100"}>
                        {test.status}
                      </Badge>
                      <Badge variant="secondary">{test.type}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {test.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-600">{test.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Duration</span>
                    <p className="font-semibold text-lg">{test.duration || "N/A"}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Total Questions</span>
                    <p className="font-semibold text-lg">{test.questions || 0}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Max Marks</span>
                    <p className="font-semibold text-lg">{test.max_marks || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <span className="text-sm text-gray-600">Pass Marks</span>
                    <p className="font-semibold text-lg">{test.passing_marks || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Test Date</h4>
                    <p className="text-gray-600">{test.date?.split('T')[0] || "Not scheduled"}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Test Time</h4>
                    <p className="text-gray-600">{test.date?.split('T')[1]?.slice(0, 5) || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                  <p className="text-2xl font-bold">{submissions?.length || 0}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.avgScore}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.passPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Passed</p>
                  <p className="text-2xl font-bold">{stats.passCount} / {submissions?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions && submissions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3">Student Name</th>
                          <th className="text-left py-2 px-3">Score</th>
                          <th className="text-left py-2 px-3">Percentage</th>
                          <th className="text-left py-2 px-3">Status</th>
                          <th className="text-left py-2 px-3">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((submission: any) => {
                          const percentage = test.max_marks
                            ? Math.round((parseFloat(submission.score) / test.max_marks) * 100)
                            : 0;
                          const passed = parseFloat(submission.score) >= (test.passing_marks || test.max_marks * 0.6);

                          return (
                            <tr key={submission.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-3 font-medium">{submission.users?.full_name}</td>
                              <td className="py-3 px-3">
                                <span className="font-semibold">{submission.score || 0}</span> / {test.max_marks || 0}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${passed ? 'bg-green-600' : 'bg-red-600'}`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm">{percentage}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {passed ? (
                                  <Badge className="bg-green-100 text-green-800 gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Passed
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800 gap-1">
                                    <XCircle className="w-3 h-3" />
                                    Failed
                                  </Badge>
                                )}
                              </td>
                              <td className="py-3 px-3 text-sm text-gray-600">
                                {submission.submitted_at?.split('T')[0]}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Questions ({test.test_questions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {test.test_questions && test.test_questions.length > 0 ? (
                  <div className="space-y-4">
                    {test.test_questions.map((question: any, idx: number) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{idx + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">{question.question_text}</h4>
                            <div className="bg-gray-50 p-3 rounded mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Question Type: {question.question_type}</p>
                              <p className="text-sm text-gray-600">Marks: {question.marks || 0}</p>
                            </div>
                            {question.options && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Options:</p>
                                {Object.entries(question.options).map(([key, value]: [string, any]) => (
                                  <div key={key} className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">{key}:</span>
                                    <span>{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {question.correct_answer && (
                              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-sm font-medium text-green-800">Correct Answer: {question.correct_answer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No questions added yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgScore}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.passPercentage}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">{stats.passCount}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {(submissions?.length || 0) - stats.passCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
