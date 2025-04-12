"use client"

import * as React from "react"
import ReactDatePicker from "react-datepicker"
import { es } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  mode?: "single" | "range" | "multiple"
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, disabled, mode = "single", ...props }, ref) => {
    const handleChange = (date: Date | null) => {
      onSelect?.(date || undefined)
    }

    return (
      <div ref={ref} className={cn("p-3", className)}>
        <ReactDatePicker
          selected={selected}
          onChange={handleChange}
          inline
          locale={es}
          filterDate={disabled ? (date) => !disabled(date) : undefined}
          className="w-full"
          wrapperClassName="w-full"
          calendarClassName="w-full"
        />
      </div>
    )
  },
)

Calendar.displayName = "Calendar"

export { Calendar }
