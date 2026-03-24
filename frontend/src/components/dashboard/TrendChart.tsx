import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface TrendDataPoint {
  label: string
  value: number
  color?: string
}

interface TrendChartProps {
  data: TrendDataPoint[]
  title: string
  subtitle?: string
  height?: number
  showGrid?: boolean
}

export function TrendChart({
  data,
  title,
  subtitle,
  height = 200,
  showGrid = true,
}: TrendChartProps) {
  const { maxValue, points, gridLines } = useMemo(() => {
    if (data.length === 0) {
      return { maxValue: 0, points: '', gridLines: [] }
    }

    const values = data.map((d) => d.value)
    const max = Math.max(...values, 1)
    const padding = 20
    const chartHeight = height - padding * 2
    const chartWidth = 100 // percentage
    const step = chartWidth / Math.max(data.length - 1, 1)

    // Calculate points for the line
    const pointsArray = data.map((point, index) => {
      const x = padding + index * step
      const y = padding + chartHeight - (point.value / max) * chartHeight
      return `${x},${y}`
    })

    const pointsStr = pointsArray.join(' ')

    // Generate grid lines
    const numGridLines = 4
    const lines = Array.from({ length: numGridLines }, (_, i) => {
      const y = padding + (chartHeight / (numGridLines - 1)) * i
      const value = max - (max / (numGridLines - 1)) * i
      return { y, value: Math.round(value) }
    })

    return { maxValue: max, points: pointsStr, gridLines: lines }
  }, [data, height])

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <svg width="100%" height={height} viewBox={`0 0 ${100 + 40} ${height}`}>
          {/* Grid lines */}
          {showGrid &&
            gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1="20"
                  y1={line.y}
                  x2="120"
                  y2={line.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <text
                  x="10"
                  y={line.y + 4}
                  fontSize="10"
                  fill="#6b7280"
                  textAnchor="end"
                >
                  {line.value}
                </text>
              </g>
            ))}

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const padding = 20
            const chartHeight = height - padding * 2
            const step = 100 / Math.max(data.length - 1, 1)
            const x = padding + index * step
            const y =
              padding + chartHeight - (point.value / maxValue) * chartHeight

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={point.color || '#3b82f6'}
                  stroke="white"
                  strokeWidth="2"
                />
                {/* Hover area */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                >
                  <title>{`${point.label}: ${point.value}`}</title>
                </circle>
              </g>
            )
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const padding = 20
            const step = 100 / Math.max(data.length - 1, 1)
            const x = padding + index * step
            const y = height - 5

            // Only show every other label if there are many points
            if (data.length > 6 && index % 2 !== 0) return null

            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {point.label}
              </text>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}
