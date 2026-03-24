import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type React from 'react'

export interface MetricCardProps {
  title: string
  value: number | string
  trend?: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  onClick?: () => void
  className?: string
}

const variantStyles = {
  success: 'bg-green-50 border-green-200 hover:bg-green-100',
  warning: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  danger: 'bg-red-50 border-red-200 hover:bg-red-100',
  info: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  neutral: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
}

const variantTextStyles = {
  success: 'text-green-700',
  warning: 'text-yellow-700',
  danger: 'text-red-700',
  info: 'text-blue-700',
  neutral: 'text-gray-700',
}

const variantIconStyles = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  info: 'text-blue-600',
  neutral: 'text-gray-600',
}

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  variant = 'neutral',
  onClick,
  className,
}: MetricCardProps) {
  const isClickable = !!onClick

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        variantStyles[variant],
        isClickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3
                className={cn(
                  'text-3xl font-bold',
                  variantTextStyles[variant]
                )}
              >
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    'text-sm font-medium',
                    trend.startsWith('+')
                      ? 'text-green-600'
                      : trend.startsWith('-')
                        ? 'text-red-600'
                        : 'text-gray-600'
                  )}
                >
                  {trend}
                </span>
              )}
            </div>
          </div>
          {Icon && (
            <div
              className={cn(
                'rounded-lg p-2',
                variantIconStyles[variant]
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
