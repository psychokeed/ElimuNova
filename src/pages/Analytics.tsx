import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, Users, BookOpen, Award, Loader2 } from "lucide-react";

interface AnalyticsData {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageProgress: number;
  courseStats: {
    title: string;
    enrollments: number;
    completionRate: number;
  }[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    averageProgress: 0,
    courseStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get all courses by this instructor
      const { data: courses, error: coursesError } = await supabase
        .from("courses")
        .select("id, title")
        .eq("instructor_id", user.id);

      if (coursesError) throw coursesError;

      const courseIds = courses?.map((c) => c.id) || [];
      const totalCourses = courses?.length || 0;

      if (courseIds.length === 0) {
        setAnalytics({
          totalCourses: 0,
          totalStudents: 0,
          totalEnrollments: 0,
          averageProgress: 0,
          courseStats: [],
        });
        setLoading(false);
        return;
      }

      // Get all enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("student_id, course_id")
        .in("course_id", courseIds);

      if (enrollmentsError) throw enrollmentsError;

      const totalEnrollments = enrollments?.length || 0;
      const uniqueStudents = new Set(enrollments?.map((e) => e.student_id) || []);
      const totalStudents = uniqueStudents.size;

      // Calculate course stats
      const courseStats = await Promise.all(
        (courses || []).map(async (course) => {
          const courseEnrollments = enrollments?.filter((e) => e.course_id === course.id) || [];
          
          // Get lessons for this course
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id")
            .eq("course_id", course.id);

          const totalLessons = lessons?.length || 0;

          if (totalLessons === 0 || courseEnrollments.length === 0) {
            return {
              title: course.title,
              enrollments: courseEnrollments.length,
              completionRate: 0,
            };
          }

          // Calculate completion rate
          let totalCompletionRate = 0;
          for (const enrollment of courseEnrollments) {
            const { data: progress } = await supabase
              .from("lesson_progress")
              .select("completed")
              .eq("student_id", enrollment.student_id)
              .in(
                "lesson_id",
                lessons?.map((l) => l.id) || []
              );

            const completedLessons = progress?.filter((p) => p.completed).length || 0;
            totalCompletionRate += (completedLessons / totalLessons) * 100;
          }

          const averageCompletionRate = Math.round(totalCompletionRate / courseEnrollments.length);

          return {
            title: course.title,
            enrollments: courseEnrollments.length,
            completionRate: averageCompletionRate,
          };
        })
      );

      // Calculate overall average progress
      const totalProgress = courseStats.reduce((sum, stat) => sum + stat.completionRate, 0);
      const averageProgress = courseStats.length > 0 ? Math.round(totalProgress / courseStats.length) : 0;

      setAnalytics({
        totalCourses,
        totalStudents,
        totalEnrollments,
        averageProgress,
        courseStats,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching analytics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="instructor">
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <div className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/instructor-dashboard")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Track your course performance and student engagement
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Overview Cards */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalCourses}</div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalEnrollments}</div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.averageProgress}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Course Performance */}
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Course Performance</CardTitle>
                      <CardDescription>
                        Enrollment and completion rates for each course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {analytics.courseStats.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No course data available yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {analytics.courseStats.map((course, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-semibold">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {course.enrollments} {course.enrollments === 1 ? "student" : "students"} enrolled
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">{course.completionRate}%</div>
                                <p className="text-xs text-muted-foreground">completion</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;
