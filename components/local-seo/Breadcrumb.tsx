import Link from "next/link"

export interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return <nav aria-label="Navegação estrutural" className="mb-8 text-sm text-gray-400"><ol className="flex flex-wrap gap-2">{items.map((item, index) => <li key={item.label} className="flex items-center gap-2">{index > 0 && <span aria-hidden>/</span>}{item.href ? <Link href={item.href} className="hover:text-white">{item.label}</Link> : <span className="text-white">{item.label}</span>}</li>)}</ol></nav>
}
