import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, BookOpen, Users, Award, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-education.jpg";
import featureOnline from "@/assets/feature-online.png";
import featurePersonalized from "@/assets/feature-personalized.png";
import featureSkills from "@/assets/feature-skills.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  UN SDG 4: Quality Education
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Empowering Minds Through{" "}
                <span className="text-primary">
                  Quality Education
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Join thousands of learners worldwide accessing affordable, personalized education.
                Start your learning journey today with ElimuNova.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    Start Learning Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-2xl font-bold text-primary">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">500+</div>
                  <div className="text-sm text-muted-foreground">Free Courses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 gradient-hero opacity-20 blur-3xl rounded-full"></div>
              <img
                src={heroImage}
                alt="Diverse students learning together"
                className="relative rounded-2xl shadow-card-hover w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose ElimuNova?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to making quality education accessible to everyone, everywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardHeader>
                <div className="w-16 h-16 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <img src={featureOnline} alt="Online Learning" className="w-12 h-12" />
                </div>
                <CardTitle>Flexible Learning</CardTitle>
                <CardDescription>
                  Learn at your own pace, anytime, anywhere. Access courses on any device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardHeader>
                <div className="w-16 h-16 mb-4 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <img src={featurePersonalized} alt="Personalized Learning" className="w-12 h-12" />
                </div>
                <CardTitle>Personalized Path</CardTitle>
                <CardDescription>
                  AI-powered recommendations tailored to your learning style and goals.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-card-hover transition-smooth">
              <CardHeader>
                <div className="w-16 h-16 mb-4 rounded-lg bg-accent/10 flex items-center justify-center">
                  <img src={featureSkills} alt="Skill Development" className="w-12 h-12" />
                </div>
                <CardTitle>Practical Skills</CardTitle>
                <CardDescription>
                  Build real-world skills with hands-on projects and expert instructors.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <BookOpen className="h-12 w-12 mx-auto text-primary" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-muted-foreground">Courses Available</div>
            </div>
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 mx-auto text-secondary" />
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center space-y-2">
              <Award className="h-12 w-12 mx-auto text-accent" />
              <div className="text-3xl font-bold">100+</div>
              <div className="text-muted-foreground">Expert Instructors</div>
            </div>
            <div className="text-center space-y-2">
              <Sparkles className="h-12 w-12 mx-auto text-primary" />
              <div className="text-3xl font-bold">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Join our community of learners and unlock your potential with free, quality education.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="shadow-card-hover">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
