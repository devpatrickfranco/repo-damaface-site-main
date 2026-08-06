import Link from "next/link"
import { ChevronRight } from "lucide-react"

export interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Navegação estrutural" className="mb-8 text-sm text-gray-400"><ol className="flex flex-wrap items-center gap-1.5">{items.map((item, index) => <li key={item.label} className="flex items-center gap-1.5">{index > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-600" aria-hidden />}{item.href ? <Link href={item.href} className="transition hover:text-white">{item.label}</Link> : <span className="text-white">{item.label}</span>}</li>)}</ol></nav>
}
