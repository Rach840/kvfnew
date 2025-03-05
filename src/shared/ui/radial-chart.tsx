'use client'
import React from "react";
import GaugeComponent from 'react-gauge-component';
export default function RadialChart({ valueNum }) {

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
