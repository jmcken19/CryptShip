'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const PERIODS = [
    { label: '1H', value: '1h' },
    { label: '6H', value: '6h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
];

export default function PriceChart({ coin, color }) {
    const [period, setPeriod] = useState('6h'); // Default to 6H
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/chart-data?coin=${coin}&period=${period}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.prices) {
                    setChartData(data.prices);
                }
            })
            .catch((err) => {
                // Intentionally swallowed: gracefully show "Chart data unavailable" text instead of breaking UI
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [coin, period]);

    // Calculate Y-axis padding for dynamic scaling
    const prices = chartData ? chartData.map(([, p]) => p) : [];
    const minPrice = prices.length ? Math.min(...prices) * 0.995 : 0;
    const maxPrice = prices.length ? Math.max(...prices) * 1.005 : 0;

    const data = chartData
        ? {
            labels: chartData.map(([t]) => {
                const isShortTime = period === '1h' || period === '6h' || period === '24h';
                return new Date(t).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    ...(isShortTime && { hour: '2-digit', minute: '2-digit' }),
                });
            }),
            datasets: [
                {
                    data: prices,
                    borderColor: color,
                    backgroundColor: `${color}15`,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: color,
                    borderWidth: 2,
                },
            ],
        }
        : null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(6, 14, 27, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#b0bec5',
                borderColor: 'rgba(45, 212, 191, 0.2)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (ctx) => `$${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                },
            },
        },
        scales: {
            x: {
                display: true,
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: {
                    color: '#7a8fa3',
                    font: { size: 10 },
                    maxTicksLimit: 8,
                    maxRotation: 0,
                },
                border: { display: false },
            },
            y: {
                display: true,
                position: 'right',
                min: minPrice > 0 ? minPrice : undefined,
                max: maxPrice > 0 ? maxPrice : undefined,
                grid: { color: 'rgba(255,255,255,0.03)' },
                ticks: {
                    color: '#7a8fa3',
                    font: { size: 10 },
                    callback: (val) => '$' + val.toLocaleString(),
                },
                border: { display: false },
            },
        },
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div className="chart-controls" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px', zIndex: 5 }}>
                {PERIODS.map((p) => (
                    <button
                        key={p.value}
                        className={`chart-toggle ${period === p.value ? 'active' : ''}`}
                        onClick={() => setPeriod(p.value)}
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: period === p.value ? 'rgba(255,255,255,0.1)' : 'transparent', color: 'white', cursor: 'pointer' }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="chart-container" style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div className="loading-shimmer" style={{ width: '100%', height: '100%' }} />
                ) : data ? (
                    <Line ref={chartRef} data={data} options={options} />
                ) : (
                    <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>
                        Chart data unavailable
                    </div>
                )}
            </div>
        </div>
    );
}
