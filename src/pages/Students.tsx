import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

interface StudentEnrollment {
  id: string;
  student_name: string;
  student_email: string;
  course_title: string;
  enrolled_at: string;
  progress: number;
}

const Students = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(
        (s) =>
          s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.student_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.course_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
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

      if (courseIds.length === 0) {
        setStudents([]);
        setFilteredStudents([]);
        setLoading(false);
        return;
      }

      // Get all enrollments for these courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("id, student_id, course_id, enrolled_at")
        .in("course_id", courseIds);

      if (enrollmentsError) throw enrollmentsError;

      // Get student profiles
      const studentIds = [...new Set(enrollments?.map((e) => e.student_id) || [])];
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      if (profilesError) throw profilesError;

      // Calculate progress for each enrollment
      const studentsData: StudentEnrollment[] = await Promise.all(
        (enrollments || []).map(async (enrollment) => {
          const profile = profiles?.find((p) => p.id === enrollment.student_id);
          const course = courses?.find((c) => c.id === enrollment.course_id);

          // Get lesson progress
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id")
            .eq("course_id", enrollment.course_id);

          const { data: progress } = await supabase
            .from("lesson_progress")
            .select("completed")
            .eq("student_id", enrollment.student_id)
            .in(
              "lesson_id",
              lessons?.map((l) => l.id) || []
            );

          const totalLessons = lessons?.length || 0;
          const completedLessons = progress?.filter((p) => p.completed).length || 0;
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return {
            id: enrollment.id,
            student_name: profile?.full_name || "Unknown",
            student_email: enrollment.student_id,
            course_title: course?.title || "Unknown",
            enrolled_at: new Date(enrollment.enrolled_at).toLocaleDateString(),
            progress: progressPercentage,
          };
        })
      );

      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error: any) {
      toast({
        title: "Error fetching students",
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

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>
                  View and manage students enrolled in your courses
                </CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, email, or course..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "No students found matching your search."
                      : "No students enrolled yet."}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Enrolled Date</TableHead>
                        <TableHead>Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.student_name}
                          </TableCell>
                          <TableCell>{student.course_title}</TableCell>
                          <TableCell>{student.enrolled_at}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.progress === 100
                                  ? "default"
                                  : student.progress > 0
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {student.progress}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Students;
