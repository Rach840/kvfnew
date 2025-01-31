'use client'
import React from "react";
import { AgGauge } from "ag-charts-react";
import { AgRadialGaugeOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";

export default function RadialChart({ valueNum }) {
	const options: AgRadialGaugeOptions = {
		type: "radial-gauge",

		value: valueNum,
		scale: {
			min: 0,
			max: 100,
			label: {
				enabled: true,
			},
		},
		cornerRadius: 99,
		cornerMode: "item",
		bar: {
			fills: [{ color: '#e84118' }, { color: '#f7b005' }, { color: '#4cd137' }, { color: '#24661a' }],
			fillMode: 'continuous',
		},
		label: {

			formatter({ value }) {
				return `${value.toFixed(0)}%`;
			},
		},
		secondaryLabel: {
			fontSize: 22,
			color: '#000',
			text: `Вы прошли тест на ${valueNum}%`,
		},
	};

	return <AgGauge options={options} />;
};