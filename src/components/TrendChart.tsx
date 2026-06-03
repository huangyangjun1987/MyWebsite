import { useMemo } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'

interface TrendPoint {
  label: string
  value: number
}

interface TrendApiResponse {
  type: string
  data: TrendPoint[]
}

interface TrendChartProps {
  title: string
  trendType: 'weekly' | 'monthly'
  height?: number
}

const CHART_PADDING_LEFT = 32
const CHART_PADDING_RIGHT = 8
const CHART_PADDING_TOP = 8
const CHART_PADDING_BOTTOM = 20

export function TrendChart({ title, trendType, height = 200 }: TrendChartProps) {
  const { data, loading, error, refetch } = useAnalytics<TrendApiResponse>(
    `/api/analytics/trends?type=${trendType}`
  )
  const chartData = data?.data ?? []
  const variant = trendType === 'weekly' ? 'bar' : 'line'

  const svgHeight = height
  const plotWidth = 600 - CHART_PADDING_LEFT - CHART_PADDING_RIGHT
  const plotHeight = svgHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 5
    const max = Math.max(...chartData.map((d) => d.value))
    return max === 0 ? 5 : max * 1.2
  }, [chartData])

  const wrapperClasses =
    'bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 dark:border-gray-700'

  // Loading state
  if (loading) {
    return (
      <div className={`${wrapperClasses} animate-pulse`}>
        <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={`${wrapperClasses} text-center`}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="flex flex-col items-center justify-center" style={{ height }}>
          <p className="text-gray-400 dark:text-gray-600 text-sm mb-3">数据加载失败</p>
          <button
            onClick={refetch}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-cyan-400
              bg-indigo-50 dark:bg-cyan-950 rounded-lg
              hover:bg-indigo-100 dark:hover:bg-cyan-900 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  // Empty data state
  if (chartData.length === 0) {
    return (
      <div className={wrapperClasses}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center" style={{ height }}>
          <p className="text-gray-400 dark:text-gray-600 text-sm">暂无趋势数据</p>
        </div>
      </div>
    )
  }

  const getX = (index: number) => {
    if (chartData.length <= 1) return CHART_PADDING_LEFT + plotWidth / 2
    return CHART_PADDING_LEFT + (index / (chartData.length - 1)) * plotWidth
  }

  const getY = (value: number) => {
    return CHART_PADDING_TOP + plotHeight - (value / maxValue) * plotHeight
  }

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const ticks: number[] = []
    const step = maxValue / 4
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round(step * i * 10) / 10)
    }
    return ticks
  }, [maxValue])

  const barWidth = Math.max(8, (plotWidth / chartData.length) * 0.6)
  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ')

  return (
    <div className={wrapperClasses}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <svg
        viewBox={`0 0 600 ${svgHeight}`}
        className="w-full"
        style={{ height: `${svgHeight}px` }}
        role="img"
        aria-label={title}
      >
        {/* Y-axis grid lines */}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={CHART_PADDING_LEFT}
              y1={getY(tick)}
              x2={600 - CHART_PADDING_RIGHT}
              y2={getY(tick)}
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              strokeDasharray="4 4"
            />
            <text
              x={CHART_PADDING_LEFT - 4}
              y={getY(tick) + 4}
              textAnchor="end"
              className="text-xs fill-gray-400 dark:fill-gray-500"
            >
              {tick}h
            </text>
          </g>
        ))}

        {variant === 'bar' ? (
          /* Bar chart */
          chartData.map((d, i) => (
            <g key={`bar-${i}`}>
              <rect
                x={getX(i) - barWidth / 2}
                y={getY(d.value)}
                width={barWidth}
                height={CHART_PADDING_TOP + plotHeight - getY(d.value)}
                rx={2}
                className="fill-indigo-400 dark:fill-cyan-500
                  hover:fill-indigo-500 dark:hover:fill-cyan-400
                  transition-colors duration-200"
              />
              <text
                x={getX(i)}
                y={svgHeight - 4}
                textAnchor="middle"
                className="text-[10px] sm:text-xs fill-gray-400 dark:fill-gray-500"
              >
                {chartData.length <= 7 ? d.label : (i % 5 === 0 ? d.label : '')}
              </text>
            </g>
          ))
        ) : (
          /* Line chart */
          <>
            <defs>
              <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" className="text-indigo-500 dark:text-cyan-500" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-indigo-500 dark:text-cyan-500" />
              </linearGradient>
            </defs>
            <path
              d={`${linePath} L ${getX(chartData.length - 1)} ${CHART_PADDING_TOP + plotHeight} L ${getX(0)} ${CHART_PADDING_TOP + plotHeight} Z`}
              fill="url(#line-fill)"
            />
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              className="text-indigo-500 dark:text-cyan-400"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chartData.map((d, i) => (
              <circle
                key={`dot-${i}`}
                cx={getX(i)}
                cy={getY(d.value)}
                r="3"
                className="fill-white dark:fill-gray-800 stroke-indigo-500 dark:stroke-cyan-400"
                strokeWidth="2"
              />
            ))}
            {chartData.map((d, i) => (
              <text
                key={`x-${i}`}
                x={getX(i)}
                y={svgHeight - 4}
                textAnchor="middle"
                className="text-[10px] sm:text-xs fill-gray-400 dark:fill-gray-500"
              >
                {i % 5 === 0 ? d.label : ''}
              </text>
            ))}
          </>
        )}
      </svg>
    </div>
  )
}
