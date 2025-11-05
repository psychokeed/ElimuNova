import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BookOpen, Users, TrendingUp, Plus, Edit, BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  thumbnail_url?: string;
  students: number;
  lessons: number;
}

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInstructorCourses();
    }
  }, [user]);

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch courses created by this instructor
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user!.id);

      if (coursesError) throw coursesError;

      // Fetch enrollment counts and lesson counts for each course
      const coursesWithStats = await Promise.all(
        (coursesData || []).map(async (course) => {
          const [enrollmentsResult, lessonsResult] = await Promise.all([
            supabase
              .from('enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('course_id', course.id),
            supabase
              .from('lessons')
              .select('id', { count: 'exact', head: true })
              .eq('course_id', course.id)
          ]);

          return {
            ...course,
            students: enrollmentsResult.count || 0,
            lessons: lessonsResult.count || 0,
          } as Course;
        })
      );

      setCourses(coursesWithStats);
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = courses.reduce((acc, course) => acc + course.students, 0);
  const publishedCourses = courses.length; // All fetched courses are considered published

  return (
    <ProtectedRoute requiredRole="instructor">
      <div className="min-h-screen flex flex-col">
        <Navigation />

      <div className="flex-1">
        {/* Header */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  Instructor Dashboard
                </h1>
                <p className="text-lg text-primary-foreground/90">
                  Manage your courses and reach more students
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="shadow-card-hover"
                onClick={() => window.location.href = '/create-course'}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Course
              </Button>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 space-y-8">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '-' : courses.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {loading ? '-' : publishedCourses} published
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '-' : totalStudents.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.85</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+234</div>
                  <p className="text-xs text-muted-foreground mt-1">new enrollments</p>
                </CardContent>
              </Card>
            </div>

            {/* My Courses */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Manage and monitor your courses</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No courses yet. Create your first course to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              <Badge variant="secondary">Published</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{course.students.toLocaleString()} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{course.lessons} lessons</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{course.level}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analytics
                            </Button>
                            <Button variant="default" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card
                className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
                onClick={() => window.location.href = '/create-course'}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Create Course
                  </CardTitle>
                  <CardDescription>Start building a new course</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
                onClick={() => window.location.href = '/students'}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    View Students
                  </CardTitle>
                  <CardDescription>See who's enrolled in your courses</CardDescription>
                </CardHeader>
              </Card>
              <Card
                className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer"
                onClick={() => window.location.href = '/analytics'}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Analytics
                  </CardTitle>
                  <CardDescription>Track your teaching performance</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default InstructorDashboard;
