"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        const isClickable = onStepClick && stepNumber <= currentStep

        return (
          <div key={index} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                isCompleted && "bg-green-500 text-white",
                isCurrent && "bg-blue-500 text-white",
                !isCompleted && !isCurrent && "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
                isClickable && "cursor-pointer hover:bg-blue-600"
              )}
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                stepNumber
              )}
            </div>

            {/* Step Label */}
            <div className="ml-2 min-w-0">
              <div
                className={cn(
                  "text-sm font-medium transition-colors",
                  isCompleted && "text-green-600 dark:text-green-400",
                  isCurrent && "text-blue-600 dark:text-blue-400",
                  !isCompleted && !isCurrent && "text-gray-500 dark:text-gray-400"
                )}
              >
                {step}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  stepNumber < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
