import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, Clock, Award, TrendingUp, Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    learningHours: 0,
    certificates: 0,
    avgProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch enrolled courses with progress
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          courses (
            id,
            title,
            description,
            category,
            lessons (
              id,
              title,
              order_index,
              duration_minutes
            )
          )
        `)
        .eq('student_id', profile!.id);

      if (enrollError) throw enrollError;

      // Calculate progress for each course
      const coursesWithProgress = await Promise.all(
        (enrollments || []).map(async (enrollment: any) => {
          const course = enrollment.courses;
          const totalLessons = course.lessons?.length || 0;
          
          const { data: progress, error: progressError } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('student_id', profile!.id)
            .in('lesson_id', course.lessons?.map((l: any) => l.id) || []);

          if (progressError) throw progressError;

          const completedLessons = progress?.filter((p: any) => p.completed).length || 0;
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

          return {
            id: course.id,
            title: course.title,
            progress: progressPercentage,
            totalLessons,
            completedLessons,
            category: course.category
          };
        })
      );

      setEnrolledCourses(coursesWithProgress);

      // Calculate stats
      const avgProgress = coursesWithProgress.length > 0
        ? coursesWithProgress.reduce((sum, c) => sum + c.progress, 0) / coursesWithProgress.length
        : 0;

      setStats({
        totalCourses: coursesWithProgress.length,
        learningHours: 0, // Can be calculated from lesson durations
        certificates: coursesWithProgress.filter(c => c.progress === 100).length,
        avgProgress: Math.round(avgProgress)
      });

      // Fetch recommended courses (not enrolled)
      const { data: allCourses, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, category')
        .limit(3);

      if (coursesError) throw coursesError;

      const enrolledIds = coursesWithProgress.map(c => c.id);
      const recommended = (allCourses || []).filter(c => !enrolledIds.includes(c.id));
      setRecommendedCourses(recommended);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen flex flex-col">
        <Navigation />

      <div className="flex-1">
        {/* Header */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Welcome back, Student!
            </h1>
            <p className="text-lg text-primary-foreground/90">
              Continue your learning journey
            </p>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCourses}</div>
              </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.learningHours}</div>
              </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.certificates}</div>
              </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your courses...</p>
                </div>
              ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                    <Link to="/courses">
                      <Button variant="hero">Browse Courses</Button>
                    </Link>
                  </div>
                ) : (
                  enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <Badge variant="secondary" className="mt-1">{course.category}</Badge>
                        </div>
                        <Link to={`/course/${course.id}`}>
                          <Button size="sm" variant="hero">
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recommended Courses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your learning interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth"
                    >
                      <Badge variant="secondary" className="mb-2">
                        {course.category}
                      </Badge>
                      <h3 className="font-semibold mb-3">{course.title}</h3>
                      <Link to={`/course/${course.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Course
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;
