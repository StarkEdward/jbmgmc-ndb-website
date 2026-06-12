"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion"



const departments_contact = [
  { name: "Dean Office", phone: "+91-2564-XXXXXX", email: "dean.gmcnandurbar@gmail.com" },
  { name: "Academic Section", phone: "+91-2564-XXXXXX", email: "academic.gmcnandurbar@gmail.com" },
  { name: "Hospital Administration", phone: "+91-2564-XXXXXX", email: "hospital.gmcnandurbar@gmail.com" },
  { name: "Admission Cell", phone: "+91-2564-XXXXXX", email: "admission.gmcnandurbar@gmail.com" },
  { name: "Emergency", phone: "102 / +91-2564-XXXXXX", email: "emergency.gmcnandurbar@gmail.com" },
]

export default function ContactPage() {
  const { collegeInfo } = useLiveData()
  
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: [collegeInfo.address],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+91-2564-XXXXXX", "+91-2564-YYYYYY"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["dean.gmcnandurbar@gmail.com", "info.gmcnandurbar@gmail.com"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Saturday", "9:00 AM - 5:00 PM"],
    },
  ]

  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to a server
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <FadeIn delay={0.1} className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Get In Touch</p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                We&apos;re here to help. Reach out to us for any inquiries about admissions, hospital services, or general information.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => (
                <StaggerItem
                  key={index}
                  className="rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <info.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                  ))}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-secondary">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <SlideIn direction="left" className="rounded-xl bg-card p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                
                {submitted ? (
                  <FadeIn className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We will get back to you soon.
                    </p>
                  </FadeIn>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your message here..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto transition-transform hover:scale-105">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </SlideIn>

              {/* Map Placeholder */}
              <SlideIn direction="right" className="rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-square lg:aspect-auto lg:h-full bg-muted flex items-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.1762768957387!2d74.24064!3d21.3713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDIyJzE2LjciTiA3NMKwMTQnMjYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="JBMGMC Nandurbar Location"
                    className="grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Department Contacts */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-7xl px-4">
            <FadeIn className="text-center mb-10">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                Direct Contact
              </p>
              <h2 className="text-3xl font-bold text-foreground">Department Contacts</h2>
            </FadeIn>
            <FadeIn delay={0.2} className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-6 py-3 text-left font-semibold">Department</th>
                    <th className="px-6 py-3 text-left font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {departments_contact.map((dept, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0 ? 'bg-card' : 'bg-secondary'} border-b border-border transition-colors hover:bg-primary/5`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{dept.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <a href={`tel:${dept.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">
                          {dept.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <a href={`mailto:${dept.email}`} className="hover:text-primary transition-colors">
                          {dept.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
