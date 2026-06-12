import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { db } from "@/lib/db"
import { DepartmentDetailTabs } from "./department-detail-tabs"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  const departments = db.getDepartments()
  return departments.map((dept) => ({
    slug: dept.id,
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const departments = db.getDepartments()
  const department = departments.find((d) => d.id === resolvedParams.slug)
  
  if (!department) {
    return { title: "Department Not Found" }
  }
  
  return {
    title: `${department.name} - JBMGMC Nandurbar`,
    description: department.description,
  }
}

export default async function DepartmentPage({ params }: PageProps) {
  const resolvedParams = await params
  const departments = db.getDepartments()
  const department = departments.find((d) => d.id === resolvedParams.slug)
  
  if (!department) {
    console.error("404 Debug: slug was", resolvedParams.slug, "but not found in DB. Total depts:", departments.length)
    notFound()
  }

  const currentIndex = departments.findIndex((d) => d.id === resolvedParams.slug)
  const prevDept = currentIndex > 0 ? departments[currentIndex - 1] : null
  const nextDept = currentIndex < departments.length - 1 ? departments[currentIndex + 1] : null

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-indigo-500/30">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="relative pt-8 pb-10 md:pt-12 md:pb-12 overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 dark:from-indigo-950/20 dark:via-slate-950 dark:to-sky-950/20" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 dark:bg-sky-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors">
                <Home className="w-4 h-4" /> Home
              </Link>
              <span>/</span>
              <Link href="/departments" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Departments
              </Link>
              <span>/</span>
              <span className="text-indigo-600 dark:text-indigo-400">{department.name}</span>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 text-sm font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                {department.category || "Department"}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {department.name}
              </h1>
              {department.description && (
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
                  {department.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 py-10 md:py-12 relative z-20">
        <div className="mx-auto max-w-7xl px-4">
          <DepartmentDetailTabs department={department} />
        </div>
      </main>
      
      {/* Navigation Footer */}
      <section className="py-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            {prevDept ? (
              <Link href={`/departments/${prevDept.id}`} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{prevDept.name}</p>
                </div>
              </Link>
            ) : <div />}
            
            {nextDept ? (
              <Link href={`/departments/${nextDept.id}`} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Next</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{nextDept.name}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
