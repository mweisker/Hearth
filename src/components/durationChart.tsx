import * as React from 'react';
import { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Duration = (props) => {
  const options = { 
    type: 'line',
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: true,
        text: 'Duration',
        font: {
          size: 25
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Invocations (most recent)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Milliseconds (ms)'
        }
      }
    }
  };
  
  // dynamic depending on invocation times
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const invocationDuration = [];

  if (props.logData.length > 10) {
    for(let i = 10; i >= 0; i--) {
      invocationDuration.push(props.logData[i].Duration);
    }
  } else {
    for(let i = props.logData.length - 1; i >= 0; i--) {
      invocationDuration.push(props.logData[i].Duration);
    }
  }

  console.log(props.logData)
  
  const data = {
    labels,
    datasets: [
      {
        // label: 'none',
        // get data from cloudwatch logs
        data: invocationDuration,
        borderColor: '#90e0ef',
        backgroundColor: '#caf0f8',
        // hidden: true
      },
    ],
  };

  return( 
  <div>
    <Line options={options} data={data} style={{width: '700px', height: '700px'}}/>
  </div>
  );
}

export default Duration;
  
