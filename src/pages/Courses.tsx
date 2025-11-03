import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, Clock, Users, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, [profile]);

  const fetchCourses = async () => {
    try {
      // Fetch all courses with instructor details
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles:instructor_id (
            full_name
          ),
          lessons (
            id
          )
        `);

      if (coursesError) throw coursesError;

      setCourses(coursesData || []);

      // If user is a student, fetch their enrollments
      if (profile?.role === 'student') {
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', profile.id);

        if (enrollError) throw enrollError;

        setEnrolledCourseIds((enrollments || []).map((e: any) => e.course_id));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!profile) {
      toast({
        title: "Authentication Required",
        description: "Please login to enroll in courses",
        variant: "destructive"
      });
      return;
    }

    if (profile.role !== 'student') {
      toast({
        title: "Not Allowed",
        description: "Only students can enroll in courses",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({ student_id: profile.id, course_id: courseId });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been enrolled in the course!",
      });

      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in course",
        variant: "destructive"
      });
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <section className="gradient-hero py-16">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              Explore Our Courses
            </h1>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Discover hundreds of free courses to kickstart your learning journey
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for courses..."
                  className="pl-10 h-12 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {filteredCourses.length} Course{filteredCourses.length !== 1 ? "s" : ""} Available
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  const lessonCount = course.lessons?.length || 0;

                  return (
                    <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-smooth flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{course.category}</Badge>
                          {isEnrolled && <Badge variant="default">Enrolled</Badge>}
                        </div>
                        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div>Instructor: {course.profiles?.full_name || 'Unknown'}</div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{lessonCount} lessons</span>
                          </div>
                          <div className="pt-2">
                            <Badge variant="outline">{course.level}</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Link to={`/course/${course.id}`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {profile?.role === 'student' && !isEnrolled && (
                          <Button 
                            variant="hero" 
                            className="flex-1"
                            onClick={() => handleEnroll(course.id)}
                          >
                            Enroll Now
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No courses found</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
