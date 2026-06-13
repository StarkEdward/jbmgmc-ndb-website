import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, ArrowRight, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion"


export const metadata: Metadata = {
  title: "Events | JBM Government Medical College Nandurbar",
  description: "Stay updated with the latest events, seminars, workshops, and activities at Jannayak Birsa Munda Government Medical College Nandurbar.",
}

const upcomingEvents = [
  {
    id: 1,
    title: "Annual Medical Conference 2025",
    date: "2025-04-15",
    time: "9:00 AM - 5:00 PM",
    location: "Main Auditorium",
    category: "Conference",
    description: "Join us for the annual medical conference featuring renowned speakers from across India discussing the latest advancements in medical science and healthcare.",
    attendees: 500,
  },
  {
    id: 2,
    title: "Blood Donation Camp",
    date: "2025-04-20",
    time: "10:00 AM - 4:00 PM",
    location: "College Campus",
    category: "Health Camp",
    description: "Participate in our blood donation drive to help save lives. All eligible donors are welcome.",
    attendees: 200,
  },
  {
    id: 3,
    title: "Workshop on Emergency Medicine",
    date: "2025-05-05",
    time: "9:00 AM - 1:00 PM",
    location: "Emergency Department",
    category: "Workshop",
    description: "Hands-on workshop covering advanced emergency medical procedures and protocols.",
    attendees: 50,
  },
  {
    id: 4,
    title: "Guest Lecture: Advances in Cardiology",
    date: "2025-05-12",
    time: "2:00 PM - 4:00 PM",
    location: "Lecture Hall 1",
    category: "Lecture",
    description: "Distinguished lecture by Dr. Ramesh Patel on recent advances in interventional cardiology.",
    attendees: 150,
  },
  {
    id: 5,
    title: "Free Health Checkup Camp",
    date: "2025-05-18",
    time: "8:00 AM - 2:00 PM",
    location: "OPD Block",
    category: "Health Camp",
    description: "Free comprehensive health checkup for local community members including blood pressure, blood sugar, and general health screening.",
    attendees: 300,
  },
]

const pastEvents = [
  {
    id: 6,
    title: "Foundation Day Celebration",
    date: "2025-01-26",
    time: "10:00 AM - 6:00 PM",
    location: "Main Campus",
    category: "Celebration",
    description: "Celebrating the foundation day of our institution with cultural programs and academic achievements.",
    attendees: 1000,
  },
  {
    id: 7,
    title: "CME on Diabetes Management",
    date: "2025-02-10",
    time: "9:00 AM - 4:00 PM",
    location: "Conference Hall",
    category: "CME",
    description: "Continuing Medical Education program focusing on latest diabetes management strategies.",
    attendees: 120,
  },
  {
    id: 8,
    title: "National Science Day",
    date: "2025-02-28",
    time: "9:00 AM - 5:00 PM",
    location: "Research Block",
    category: "Academic",
    description: "Celebrating National Science Day with poster presentations and research exhibitions.",
    attendees: 250,
  },
  {
    id: 9,
    title: "Anti-Tobacco Awareness Rally",
    date: "2025-03-01",
    time: "7:00 AM - 10:00 AM",
    location: "City Center",
    category: "Awareness",
    description: "Community awareness rally highlighting the dangers of tobacco use and promoting healthy lifestyle.",
    attendees: 400,
  },
]

const announcements = [
  {
    id: 1,
    title: "MBBS Admission 2025-26",
    date: "2025-03-15",
    description: "Applications are now open for MBBS admission for the academic year 2025-26. Apply through NEET counselling.",
    isNew: true,
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    date: "2025-03-10",
    description: "The examination schedule for final year MBBS has been released. Students are advised to check the notice board.",
    isNew: true,
  },
  {
    id: 3,
    title: "Library Timing Extended",
    date: "2025-03-05",
    description: "Library timings have been extended till 10:00 PM during examination period for student convenience.",
    isNew: false,
  },
  {
    id: 4,
    title: "Hostel Fee Payment Deadline",
    date: "2025-03-01",
    description: "Last date for hostel fee payment for current semester is March 31, 2025.",
    isNew: false,
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Conference: "bg-blue-100 text-blue-800",
    "Health Camp": "bg-green-100 text-green-800",
    Workshop: "bg-purple-100 text-purple-800",
    Lecture: "bg-amber-100 text-amber-800",
    Celebration: "bg-pink-100 text-pink-800",
    CME: "bg-cyan-100 text-cyan-800",
    Academic: "bg-indigo-100 text-indigo-800",
    Awareness: "bg-orange-100 text-orange-800",
  }
  return colors[category] || "bg-muted text-muted-foreground"
}

export default function EventsPage() {
  const dbNews = db.getNews()
  const dbEvents = db.getEvents()

  const announcements = dbNews.map((n, idx) => ({
    id: idx + 1,
    title: n.title,
    date: n.date,
    description: n.description,
    isNew: idx < 2
  }))

  const upcomingEvents = dbEvents.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: "9:00 AM - 5:00 PM",
    location: "College Campus",
    category: "Academic",
    description: e.description,
    attendees: 300,
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary py-8 md:py-12">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <FadeIn delay={0.1} className="container mx-auto px-4 relative">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-4">
              <Link href="/" className="hover:text-primary-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Events</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Events & Announcements
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl">
              Stay updated with the latest events, seminars, workshops, and important announcements from the college.
            </p>
          </FadeIn>
        </section>

        {/* Announcements Banner */}
        <section className="bg-accent border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <FadeIn className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-xl font-semibold text-foreground">Latest Announcements</h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {announcements.map((announcement) => (
                <StaggerItem key={announcement.id}>
                  <Card className="bg-card hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-foreground line-clamp-2">{announcement.title}</h3>
                        {announcement.isNew && (
                          <Badge className="bg-destructive text-destructive-foreground shrink-0">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 flex-1">{announcement.description}</p>
                      <p className="text-xs text-muted-foreground mt-auto">{formatDate(announcement.date)}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">College Events</h2>
                  <p className="text-muted-foreground">Browse through our upcoming and past events</p>
                </div>
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="mt-0">
                <StaggerContainer className="grid gap-6">
                  {upcomingEvents.map((event) => (
                    <StaggerItem key={event.id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-primary p-6 text-primary-foreground md:w-48 flex flex-col items-center justify-center text-center shrink-0">
                            <span className="text-4xl font-bold">{new Date(event.date).getDate()}</span>
                            <span className="text-sm uppercase tracking-wide">
                              {new Date(event.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <CardContent className="p-6 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees} Expected</span>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                <div className="grid gap-6">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow opacity-90">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-muted p-6 text-muted-foreground md:w-48 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-4xl font-bold">{new Date(event.date).getDate()}</span>
                          <span className="text-sm uppercase tracking-wide">
                            {new Date(event.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <CardContent className="p-6 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="secondary">{event.category}</Badge>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>{event.attendees} Attended</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-12 md:py-16 bg-accent">
          <div className="container mx-auto px-4">
            <FadeIn className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Academic Calendar</h2>
              <p className="text-muted-foreground">
                Important dates and academic schedule for the current academic year
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StaggerItem>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      First Semester
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Commencement</span>
                      <span className="font-medium">August 1, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mid-Term Exams</span>
                      <span className="font-medium">October 15-25, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Final Exams</span>
                      <span className="font-medium">December 1-15, 2025</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Winter Break</span>
                      <span className="font-medium">Dec 20 - Jan 5</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      Second Semester
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Commencement</span>
                      <span className="font-medium">January 6, 2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mid-Term Exams</span>
                      <span className="font-medium">March 10-20, 2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Final Exams</span>
                      <span className="font-medium">May 1-15, 2026</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Summer Break</span>
                      <span className="font-medium">May 20 - July 31</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>

              <StaggerItem>
                <Card className="md:col-span-2 lg:col-span-1 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      Important Holidays
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Republic Day</span>
                      <span className="font-medium">January 26</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Holi</span>
                      <span className="font-medium">March 14</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Independence Day</span>
                      <span className="font-medium">August 15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Diwali</span>
                      <span className="font-medium">October 20-24</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <SlideIn direction="up">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">Want to Stay Updated?</h2>
                      <p className="text-primary-foreground/80">
                        Contact our office to receive notifications about upcoming events and announcements.
                      </p>
                    </div>
                    <Button asChild size="lg" variant="secondary" className="shrink-0 transition-transform hover:scale-105">
                      <Link href="/contact" className="flex items-center gap-2">
                        Contact Us
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SlideIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
