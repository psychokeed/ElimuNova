import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";
import { ChevronLeft, ChevronRight, MessageCircle, Send, BookOpen } from "lucide-react";

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI tutor. How can I help you with this lesson?" },
  ]);

  // Mock data - will be replaced with real data from backend
  const course = {
    id: courseId,
    title: "Introduction to Programming",
    progress: 65,
  };

  const currentLesson = {
    id: lessonId,
    title: "Control Flow Statements",
    content: `
      <h2>Understanding Control Flow</h2>
      <p>Control flow statements allow you to control the execution of your code based on certain conditions.</p>
      
      <h3>If Statements</h3>
      <p>The if statement is used to execute code only when a condition is true:</p>
      <pre><code>if temperature > 30:
    print("It's hot outside!")
else:
    print("The weather is pleasant.")</code></pre>

      <h3>For Loops</h3>
      <p>For loops allow you to iterate over a sequence:</p>
      <pre><code>for i in range(5):
    print(i)</code></pre>

      <h3>While Loops</h3>
      <p>While loops continue executing as long as a condition is true:</p>
      <pre><code>count = 0
while count < 5:
    print(count)
    count += 1</code></pre>
    `,
    videoUrl: null,
  };

  const courseLessons = [
    { id: 1, title: "Introduction to Programming", completed: true },
    { id: 2, title: "Setting Up Your Environment", completed: true },
    { id: 3, title: "Your First Python Program", completed: true },
    { id: 4, title: "Variables and Data Types", completed: true },
    { id: 5, title: "Operators and Expressions", completed: true },
    { id: 6, title: "Control Flow Statements", completed: false, current: true },
    { id: 7, title: "Functions and Modules", completed: false },
    { id: 8, title: "Working with Lists", completed: false },
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { role: "user", content: chatMessage },
      {
        role: "assistant",
        content: "I understand you're asking about control flow. Let me explain further...",
      },
    ]);
    setChatMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Link
                  to={`/course/${courseId}`}
                  className="text-sm text-muted-foreground hover:text-primary mb-1 inline-flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to course
                </Link>
                <h1 className="font-semibold">{course.title}</h1>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-sm text-muted-foreground">Course Progress</div>
                <Progress value={course.progress} className="w-32" />
                <span className="text-sm font-semibold">{course.progress}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar - Lessons List */}
          <div className="w-80 border-r border-border bg-card/50 hidden lg:block">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Course Content
              </h2>
            </div>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-2">
                {courseLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/lesson/${courseId}/${lesson.id}`}
                    className={`block p-3 mb-2 rounded-lg transition-smooth ${
                      lesson.current
                        ? "bg-primary text-primary-foreground"
                        : lesson.completed
                        ? "bg-muted hover:bg-muted/80"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lesson.completed && (
                        <div className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                      )}
                      <span className="text-sm">{lesson.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center - Lesson Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1">
              <div className="container max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{currentLesson.title}</h1>
                
                {/* Video Player (if video exists) */}
                {currentLesson.videoUrl && (
                  <div className="aspect-video bg-muted rounded-lg mb-8 flex items-center justify-center">
                    <p className="text-muted-foreground">Video Player</p>
                  </div>
                )}

                {/* Lesson Content */}
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </div>
            </ScrollArea>

            {/* Navigation Footer */}
            <div className="border-t border-border bg-card/50 p-4">
              <div className="container max-w-4xl mx-auto flex items-center justify-between">
                <Button variant="outline">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button variant="hero">
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Tutor Chat */}
          <div className="w-96 border-l border-border bg-card/50 hidden xl:flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Tutor
              </h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground ml-8"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" variant="hero" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
