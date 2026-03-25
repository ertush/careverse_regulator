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

const SVG_WIDTH = 800
const PADDING_LEFT = 50
const PADDING_RIGHT = 20
const PADDING_TOP = 20
const PADDING_BOTTOM = 30

export function TrendChart({
  data,
  title,
  subtitle,
  height = 240,
  showGrid = true,
}: TrendChartProps) {
  const chartWidth = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT
  const chartHeight = height - PADDING_TOP - PADDING_BOTTOM

  const { maxValue, pointsStr, gridLines, dataPoints } = useMemo(() => {
    if (data.length === 0) {
      return { maxValue: 0, pointsStr: '', gridLines: [], dataPoints: [] }
    }

    const values = data.map((d) => d.value)
    const max = Math.max(...values, 1)

    const step = chartWidth / Math.max(data.length - 1, 1)

    const pts = data.map((point, index) => {
      const x = PADDING_LEFT + index * step
      const y = PADDING_TOP + chartHeight - (point.value / max) * chartHeight
      return { x, y, ...point }
    })

    const polylinePoints = pts.map((p) => `${p.x},${p.y}`).join(' ')

    const numGridLines = 4
    const lines = Array.from({ length: numGridLines }, (_, i) => {
      const y = PADDING_TOP + (chartHeight / (numGridLines - 1)) * i
      const value = max - (max / (numGridLines - 1)) * i
      return { y, value: Math.round(value) }
    })

    return { maxValue: max, pointsStr: polylinePoints, gridLines: lines, dataPoints: pts }
  }, [data, chartWidth, chartHeight])

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
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${SVG_WIDTH} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {showGrid &&
            gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={PADDING_LEFT}
                  y1={line.y}
                  x2={SVG_WIDTH - PADDING_RIGHT}
                  y2={line.y}
                  className="stroke-border"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x={PADDING_LEFT - 10}
                  y={line.y + 4}
                  fontSize="12"
                  className="fill-muted-foreground"
                  textAnchor="end"
                >
                  {line.value}
                </text>
              </g>
            ))}

          {/* Area fill */}
          {dataPoints.length > 1 && (
            <polygon
              points={`${dataPoints[0].x},${PADDING_TOP + chartHeight} ${pointsStr} ${dataPoints[dataPoints.length - 1].x},${PADDING_TOP + chartHeight}`}
              fill="url(#areaGradient)"
            />
          )}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Line */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {dataPoints.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.color || '#3b82f6'}
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="transparent"
                style={{ cursor: 'pointer' }}
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            </g>
          ))}

          {/* X-axis labels */}
          {dataPoints.map((point, index) => {
            if (data.length > 12 && index % 2 !== 0) return null

            return (
              <text
                key={`label-${index}`}
                x={point.x}
                y={height - 6}
                fontSize="12"
                className="fill-muted-foreground"
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
