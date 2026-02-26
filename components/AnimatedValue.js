'use client';

import { useState, useEffect } from 'react';

export default function AnimatedValue({ value, formatter, className = '' }) {
    const [prevValue, setPrevValue] = useState(value);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (value != null && prevValue != null && value !== prevValue) {
            setIsUpdating(true);
            setPrevValue(value);
            const timer = setTimeout(() => setIsUpdating(false), 400);
            return () => clearTimeout(timer);
        } else if (value !== prevValue) {
            setPrevValue(value);
        }
    }, [value, prevValue]);

    const displayValue = formatter ? formatter(value) : value;

    return (
        <span className={`${className} ${isUpdating ? 'price-updated' : ''}`}>
            {displayValue}
        </span>
    );
}
