'use client'
import React from "react";
import GaugeComponent from 'react-gauge-component';
export default function RadialChart({ valueNum }) {
	// const options: AgRadialGaugeOptions = {
	// 	type: "radial-gauge",

	// 	value: valueNum,
	// 	scale: {
	// 		min: 0,
	// 		max: 100,
	// 		label: {
	// 			enabled: true,
	// 		},
	// 	},
	// 	cornerRadius: 99,
	// 	cornerMode: "item",
	// 	bar: {
	// 		fills: [{ color: '#e84118' }, { color: '#f7b005' }, { color: '#4cd137' }, { color: '#24661a' }],
	// 		fillMode: 'continuous',
	// 	},
	// 	label: {

	// 		formatter({ value }) {
	// 			return `${value.toFixed(0)}%`;
	// 		},
	// 	},
	// 	secondaryLabel: {
	// 		fontSize: 22,
	// 		color: '#000',
	// 		text: `Вы прошли тест на ${valueNum}%`,
	// 	},
	// };

	// return <AgGauge options={options} />;
	return(
	
	<GaugeComponent
	className='lg:w-6/12 mx-auto'
	labels={{
		valueLabel:{
			style:{
				fill:"#000"
			}
		},

}}

	arc={{
subArcs:[
	{showTick:false}
]	,	
		width: 0.15,
		subArcs: [
		  {
			limit: 20,
			color: '#EA4228', 
			showTick: false
		  },
		  {
			limit: 40,
			color: '#F58B19',
			showTick: false
		  },
		  {
			limit: 60,
			color: '#F5CD19',
			showTick: false
		  },
		  {
			limit: 100,
			color: '#5BE12C',
			showTick: false
		  },
		]
	  }}
	  value={valueNum}
	/>
	)
};
