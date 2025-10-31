import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Clock, Users, Star, BookOpen, Award, CheckCircle } from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();

  // Mock data - will be replaced with real data from backend
  const course = {
    id: id,
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with Python. This comprehensive course covers everything from basic syntax to advanced concepts, preparing you for a career in software development.",
    instructor: "Dr. Sarah Johnson",
    duration: "8 weeks",
    students: 1234,
    rating: 4.8,
    level: "Beginner",
    category: "Technology",
    modules: [
      {
        id: 1,
        title: "Getting Started with Python",
        lessons: [
          { id: 1, title: "Introduction to Programming", duration: "15 min" },
          { id: 2, title: "Setting Up Your Environment", duration: "20 min" },
          { id: 3, title: "Your First Python Program", duration: "25 min" },
        ],
      },
      {
        id: 2,
        title: "Python Basics",
        lessons: [
          { id: 4, title: "Variables and Data Types", duration: "30 min" },
          { id: 5, title: "Operators and Expressions", duration: "25 min" },
          { id: 6, title: "Control Flow Statements", duration: "35 min" },
        ],
      },
      {
        id: 3,
        title: "Functions and Modules",
        lessons: [
          { id: 7, title: "Creating Functions", duration: "30 min" },
          { id: 8, title: "Working with Modules", duration: "25 min" },
          { id: 9, title: "Best Practices", duration: "20 min" },
        ],
      },
    ],
    learningOutcomes: [
      "Understand fundamental programming concepts",
      "Write clean and efficient Python code",
      "Build real-world projects from scratch",
      "Debug and troubleshoot code effectively",
      "Apply best practices in software development",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-4">
                {course.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-6">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-6 text-primary-foreground/90">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <Badge variant="outline" className="border-primary-foreground text-primary-foreground">
                  {course.level}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* What You'll Learn */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Content */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Course Content
                    </CardTitle>
                    <CardDescription>
                      {course.modules.length} modules •{" "}
                      {course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {course.modules.map((module) => (
                        <AccordionItem key={module.id} value={`module-${module.id}`}>
                          <AccordionTrigger className="text-left">
                            <div>
                              <div className="font-semibold">{module.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {module.lessons.length} lessons
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pt-2">
                              {module.lessons.map((lesson) => (
                                <li
                                  key={lesson.id}
                                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-smooth"
                                >
                                  <span className="text-sm">{lesson.title}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Enroll Card */}
              <div className="lg:col-span-1">
                <Card className="shadow-card sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-2xl">Enroll Now</CardTitle>
                    <CardDescription>
                      Start learning today - completely free!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="hero" size="lg" className="w-full">
                      Enroll for Free
                    </Button>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span>Lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span>AI tutor support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span>Downloadable resources</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-semibold mb-2">Instructor</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
