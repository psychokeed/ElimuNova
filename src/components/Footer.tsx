import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="gradient-hero bg-clip-text text-transparent">ElimuNova</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering learners worldwide with quality, accessible education.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/courses" className="hover:text-primary transition-smooth">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-smooth">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-smooth">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Learners</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/student-dashboard" className="hover:text-primary transition-smooth">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-primary transition-smooth">
                  Find Courses
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Instructors</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/instructor-dashboard" className="hover:text-primary transition-smooth">
                  Instructor Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Teaching Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth">
                  Become an Instructor
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ElimuNova. Empowering learners worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
