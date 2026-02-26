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
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '1Y', days: 365 },
];

export default function PriceChart({ coin, color }) {
    const [period, setPeriod] = useState(7);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/chart-data?coin=${coin}&days=${period}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.prices) {
                    setChartData(data.prices);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [coin, period]);

    const data = chartData
        ? {
            labels: chartData.map(([t]) =>
                new Date(t).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    ...(period <= 1 && { hour: '2-digit', minute: '2-digit' }),
                })
            ),
            datasets: [
                {
                    data: chartData.map(([, p]) => p),
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
        <div>
            <div className="chart-controls">
                {PERIODS.map((p) => (
                    <button
                        key={p.days}
                        className={`chart-toggle ${period === p.days ? 'active' : ''}`}
                        onClick={() => setPeriod(p.days)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>
            <div className="chart-container">
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
