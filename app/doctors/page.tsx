import { db } from "@/lib/db"
import { DoctorsClient } from "./doctors-client"

export default function DoctorsPage() {
  const departments = db.getDepartments()
  return <DoctorsClient departments={departments} />
}
