import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, Clock, Users, Star } from "lucide-react";

// Mock data - will be replaced with real data from backend
const courses = [
  {
    id: 1,
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with Python",
    instructor: "Dr. Sarah Johnson",
    duration: "8 weeks",
    students: 1234,
    rating: 4.8,
    level: "Beginner",
    category: "Technology",
  },
  {
    id: 2,
    title: "Web Development Fundamentals",
    description: "Build modern websites with HTML, CSS, and JavaScript",
    instructor: "Michael Chen",
    duration: "10 weeks",
    students: 2341,
    rating: 4.9,
    level: "Beginner",
    category: "Technology",
  },
  {
    id: 3,
    title: "Data Science Basics",
    description: "Introduction to data analysis and visualization",
    instructor: "Dr. Emily Watson",
    duration: "6 weeks",
    students: 892,
    rating: 4.7,
    level: "Intermediate",
    category: "Data Science",
  },
  {
    id: 4,
    title: "Digital Marketing Essentials",
    description: "Master the fundamentals of digital marketing",
    instructor: "James Rodriguez",
    duration: "5 weeks",
    students: 1567,
    rating: 4.6,
    level: "Beginner",
    category: "Business",
  },
  {
    id: 5,
    title: "English Communication Skills",
    description: "Improve your spoken and written English",
    instructor: "Prof. Linda Anderson",
    duration: "12 weeks",
    students: 3421,
    rating: 4.9,
    level: "All Levels",
    category: "Language",
  },
  {
    id: 6,
    title: "Mathematics for Everyone",
    description: "Build confidence in mathematics from basics to advanced",
    instructor: "Dr. Robert Kim",
    duration: "10 weeks",
    students: 2103,
    rating: 4.8,
    level: "All Levels",
    category: "Mathematics",
  },
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              {filteredCourses.map((course) => (
                <Card key={course.id} className="shadow-card hover:shadow-card-hover transition-smooth flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="font-semibold">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                      <div className="pt-2">
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/course/${course.id}`} className="w-full">
                      <Button variant="hero" className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
