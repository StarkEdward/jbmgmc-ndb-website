"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLiveData } from "@/hooks/use-live-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Building2, Facebook, Instagram } from "lucide-react"
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
      details: [{ text: collegeInfo.address }],
      bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverBorder: "hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-blue-500/15",
    },
    {
      icon: Phone,
      title: "Phone",
      details: [{ text: "+91-2564-XXXXXX" }, { text: "+91-2564-YYYYYY" }],
      bgColor: "bg-emerald-50/50 dark:bg-emerald-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-emerald-500/15",
    },
    {
      icon: Mail,
      title: "Email",
      details: [{ text: "dean.gmcnandurbar@gmail.com" }, { text: "info.gmcnandurbar@gmail.com" }],
      bgColor: "bg-rose-50/50 dark:bg-rose-950/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-100 dark:bg-rose-900/50",
      borderColor: "border-rose-200 dark:border-rose-800",
      hoverBorder: "hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-rose-500/15",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [{ text: "Monday - Saturday" }, { text: "9:00 AM - 5:00 PM" }],
      bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      borderColor: "border-amber-200 dark:border-amber-800",
      hoverBorder: "hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-amber-500/15",
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
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="flex-1">
        
        {/* Clean & Professional Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 md:py-24">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn delay={0.1}>
              <span className="text-teal-600 dark:text-teal-400 font-semibold tracking-wider uppercase text-sm mb-4 block">Get In Touch</span>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Contact Us
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                We're here to help. Reach out to us for any inquiries about admissions, hospital services, or general information regarding the college.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Structured Contact Info Cards */}
        <section className="pt-16 pb-8 -mt-8 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((info, index) => (
                <StaggerItem
                  key={index}
                  className={`group ${info.bgColor} rounded-xl p-8 border ${info.borderColor} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center ${info.hoverBorder}`}
                >
                  <div className={`h-14 w-14 rounded-full ${info.iconBg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <info.icon className={`h-7 w-7 ${info.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {detail.text}
                      </p>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Dedicated Social Media Section */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 relative z-30">
              <SlideIn direction="up" delay={0.2} className="group relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:-translate-y-2 transition-all duration-500 flex items-center justify-between">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-20 z-0" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[15deg] shadow-inner">
                    <Facebook className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1 transition-colors duration-300">Connect With Us</p>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">Facebook</h3>
                  </div>
                </div>
                <a 
                  href="https://www.facebook.com/gmcnandurbar" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-10 px-6 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-indigo-500/25 hover:scale-105 active:scale-95"
                >
                  Visit Page
                </a>
              </SlideIn>

              <SlideIn direction="up" delay={0.3} className="group relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-fuchsia-100 dark:border-fuchsia-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(217,70,239,0.15)] hover:-translate-y-2 transition-all duration-500 flex items-center justify-between">
                <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-20 z-0" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-fuchsia-100 to-fuchsia-50 dark:from-fuchsia-900/50 dark:to-fuchsia-800/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-[15deg] shadow-inner">
                    <Instagram className="h-7 w-7 text-fuchsia-600 dark:text-fuchsia-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-fuchsia-500 dark:text-fuchsia-400 uppercase tracking-widest mb-1 transition-colors duration-300">Follow Our Journey</p>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">Instagram</h3>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/gmc.nandurbar/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-10 px-6 py-3 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-300 font-bold hover:bg-fuchsia-600 hover:text-white dark:hover:bg-fuchsia-500 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-fuchsia-500/25 hover:scale-105 active:scale-95"
                >
                  Visit Profile
                </a>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Form and Map Section */}
        <section className="py-12 pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              
              {/* Form Column */}
              <SlideIn direction="left" className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
                <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Please fill out the form below and we will get back to you promptly.</p>
                </div>

                {submitted ? (
                  <FadeIn className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-teal-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Thank you for contacting us. We will respond to your inquiry as soon as possible.
                    </p>
                  </FadeIn>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-semibold">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address <span className="text-red-500">*</span></Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email"
                          required
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-semibold">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91"
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-slate-700 dark:text-slate-300 font-semibold">Subject <span className="text-red-500">*</span></Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="Subject of your message"
                          required
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-slate-700 dark:text-slate-300 font-semibold">Message <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your detailed message here..."
                        rows={6}
                        required
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-teal-500 focus:ring-teal-500 resize-none"
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-2.5 h-auto transition-colors w-full sm:w-auto">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </form>
                )}
              </SlideIn>

              {/* Map Column */}
              <SlideIn direction="right" className="lg:col-span-5 h-[400px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3716.1762768957387!2d74.24064!3d21.3713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDIyJzE2LjciTiA3NMKwMTQnMjYuMyJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JBMGMC Nandurbar Location"
                  className="absolute inset-0"
                />
              </SlideIn>

            </div>
          </div>
        </section>

        {/* Clean Department Directory */}
        <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Department Directory</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Direct contact information for our key administrative and medical departments.
              </p>
            </FadeIn>
            
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments_contact.map((dept, index) => (
                <StaggerItem
                  key={index}
                  className="group bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md hover:border-teal-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 mb-5 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {dept.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                        <a href={`tel:${dept.phone.replace(/[^0-9+]/g, '')}`} className="text-slate-700 dark:text-slate-300 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                        <a href={`mailto:${dept.email}`} className="text-slate-700 dark:text-slate-300 font-medium hover:text-teal-600 dark:hover:text-teal-400 transition-colors break-all">
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
