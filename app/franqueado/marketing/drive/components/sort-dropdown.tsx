"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ArrowUpAZ, ArrowDownAZ, Clock } from "lucide-react"

export type SortOption = "name-asc" | "name-desc" | "date-desc" | "date-asc"

interface SortDropdownProps {
    value: SortOption
    onChange: (option: SortOption) => void
}

const sortOptions = [
    { value: "name-asc" as SortOption, label: "Nome (A-Z)", icon: ArrowUpAZ },
    { value: "name-desc" as SortOption, label: "Nome (Z-A)", icon: ArrowDownAZ },
    { value: "date-desc" as SortOption, label: "Modificação (Recente)", icon: Clock },
    { value: "date-asc" as SortOption, label: "Modificação (Antiga)", icon: Clock },
]

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]
    const CurrentIcon = currentOption.icon

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors font-medium text-sm border border-gray-700"
            >
                <CurrentIcon size={18} className="text-gray-400" />
                <span className="text-white">{currentOption.label.split(" ")[0]}</span>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
                    {sortOptions.map((option) => {
                        const Icon = option.icon
                        const isSelected = option.value === value

                        return (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${isSelected
                                        ? "bg-brand-pink/10 text-brand-pink"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                <Icon size={18} className={isSelected ? "text-brand-pink" : "text-gray-400"} />
                                <span className="text-sm font-medium">{option.label}</span>
                                {isSelected && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-brand-pink" />
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
