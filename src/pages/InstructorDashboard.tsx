import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Users, TrendingUp, Plus, Edit, BarChart3 } from "lucide-react";

const InstructorDashboard = () => {
  // Mock data - will be replaced with real data from backend
  const myCourses = [
    {
      id: 1,
      title: "Introduction to Programming",
      students: 1234,
      rating: 4.8,
      published: true,
      modules: 3,
    },
    {
      id: 2,
      title: "Advanced Python Techniques",
      students: 567,
      rating: 4.9,
      published: true,
      modules: 4,
    },
    {
      id: 3,
      title: "Machine Learning Fundamentals",
      students: 0,
      rating: 0,
      published: false,
      modules: 2,
    },
  ];

  return (
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
              <Button variant="secondary" size="lg" className="shadow-card-hover">
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
                  <div className="text-2xl font-bold">{myCourses.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {myCourses.filter((c) => c.published).length} published
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
                    {myCourses.reduce((acc, course) => acc + course.students, 0).toLocaleString()}
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
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{course.title}</h3>
                            <Badge variant={course.published ? "secondary" : "outline"}>
                              {course.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.modules} modules</span>
                            </div>
                            {course.published && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{course.rating} rating</span>
                              </div>
                            )}
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
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Create Course
                  </CardTitle>
                  <CardDescription>Start building a new course</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    View Students
                  </CardTitle>
                  <CardDescription>See who's enrolled in your courses</CardDescription>
                </CardHeader>
              </Card>
              <Card className="shadow-card hover:shadow-card-hover transition-smooth cursor-pointer">
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
  );
};

export default InstructorDashboard;
