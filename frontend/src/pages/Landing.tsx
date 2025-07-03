import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Target, Users, Zap, Shield } from "lucide-react"

interface LandingProps {
  onNavigateToSignup: () => void
  onNavigateToLogin: () => void
}

export function Landing({ onNavigateToSignup, onNavigateToLogin }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Listly</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onNavigateToLogin}>
              Sign In
            </Button>
            <Button onClick={onNavigateToSignup}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Quick & Simple Task Management
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Organize Tasks
            <span className="text-primary block">Without the Overwhelm</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Built for busy professionals who need to quickly add, organize, and complete tasks. 
            Simple, motivational, and designed to help you stay on top of your responsibilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onNavigateToSignup} className="text-lg px-8 py-3">
              Start Organizing Today
            </Button>
            <Button size="lg" variant="outline" onClick={onNavigateToLogin} className="text-lg px-8 py-3">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Listly?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed specifically for people who struggle to keep up with their tasks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Add tasks in under 10 seconds. No complex setup, just quick task creation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Stay Motivated</CardTitle>
              <CardDescription>
                Get positive feedback and gentle reminders to keep you on track.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Simple & Secure</CardTitle>
              <CardDescription>
                Clean interface with secure authentication. No third-party logins required.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* User Personas Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Real People
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed with feedback from professionals who need better task management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Jamal, 30</CardTitle>
                  <CardDescription>Freelancer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Manages multiple clients and projects. Needs flexible task categorization 
                and quick prioritization without the complexity of other tools."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Maya, 24</CardTitle>
                  <CardDescription>First-Year Teacher</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Juggles lesson planning, grading, and school duties. Gets overwhelmed 
                by many small tasks and needs to feel in control."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Lisa, 45</CardTitle>
                  <CardDescription>Busy Parent & Office Worker</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                "Balances work and family responsibilities. Needs reminders and 
                encouragement to keep up with daily chores and errands."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl">
              Ready to Get Organized?
            </CardTitle>
            <CardDescription className="text-xl">
              Join thousands of professionals who have simplified their task management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onNavigateToSignup} className="text-lg px-8 py-3">
                Create Free Account
              </Button>
              <Button size="lg" variant="outline" onClick={onNavigateToLogin} className="text-lg px-8 py-3">
                Sign In to Existing Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Listly. Built with ❤️ for busy professionals.</p>
        </div>
      </footer>
    </div>
  )
} 