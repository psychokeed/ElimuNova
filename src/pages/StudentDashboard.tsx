import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Clock, Award, TrendingUp, Play } from "lucide-react";

const StudentDashboard = () => {
  // Mock data - will be replaced with real data from backend
  const enrolledCourses: Array<{
    id: number;
    title: string;
    progress: number;
    lastLesson: string;
    nextLesson: string;
    totalLessons: number;
    completedLessons: number;
  }> = [];

  const recommendedCourses = [
    { id: 4, title: "Advanced Python Programming", category: "Technology" },
    { id: 5, title: "JavaScript Fundamentals", category: "Technology" },
    { id: 6, title: "Database Design", category: "Data Science" },
  ];

  return (
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
                  <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0%</div>
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
                {enrolledCourses.length === 0 ? (
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
                          <p className="text-sm text-muted-foreground">
                            Last watched: {course.lastLesson}
                          </p>
                        </div>
                        <Link to={`/lesson/${course.id}/next`}>
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
  );
};

export default StudentDashboard;
