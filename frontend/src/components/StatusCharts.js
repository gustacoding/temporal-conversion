import React from 'react';
import { Pie } from 'react-chartjs-2';

function StatusCharts({ statusDataApi, isMobile, darkMode, statusLabels }) {
  const statusCharts = statusDataApi.map(canalData => {
    const colors = { email: '#007bff', MOBILE: '#28a745', wpp: '#dc3545' };
    const canal = canalData.canal;
    const statusCounts = [
      parseInt(canalData.valido) || 0,
      parseInt(canalData.invalido) || 0,
      parseInt(canalData.incompleto) || 0,
      parseInt(canalData.pendente) || 0,
      parseInt(canalData.aberto) || 0,
      parseInt(canalData.visualizou) || 0,
    ];

    const filteredLabels = Object.values(statusLabels).filter((_, i) => statusCounts[i] > 0);
    const filteredData = statusCounts.filter(count => count > 0);
    const filteredColors = [
      colors[canal] + '80',
      colors[canal] + '70',
      colors[canal] + '60',
      colors[canal] + '50',
      colors[canal] + '40',
      colors[canal] + '30',
    ].filter((_, i) => statusCounts[i] > 0);

    const pieData = {
      labels: filteredLabels,
      datasets: [{
        label: canal,
        data: filteredData,
        backgroundColor: filteredColors,
        borderWidth: 1,
        hoverOffset: 10,
      }],
    };

    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '10%',
      animation: {
        duration: 1000,
      },
      plugins: {
        legend: { 
          position: isMobile ? 'bottom' : 'right',
          labels: {
            boxWidth: isMobile ? 10 : 40,
            font: {
              size: isMobile ? 8 : 12
            },
            color: darkMode ? '#e0e0e0' : '#333',
            padding: 10
          }
        },
        title: { 
          display: true, 
          text: `Status - ${canal}`, 
          font: { size: isMobile ? 12 : 16 },
          color: darkMode ? '#e0e0e0' : '#333',
          padding: { bottom: 10 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const statusIndex = context.dataIndex;
              const statusName = filteredLabels[statusIndex];
              return `${statusName}: ${context.raw}`;
            },
          },
          backgroundColor: darkMode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: darkMode ? '#fff' : '#333',
          bodyColor: darkMode ? '#fff' : '#333',
          padding: 8
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      transitions: {
        color: {
          animation: {
            duration: 500
          }
        }
      }
    };

    return (
      <div key={canal} style={{ 
        background: darkMode ? '#1e1e1e' : '#fff', 
        padding: '15px', 
        borderRadius: '10px', 
        boxShadow: darkMode ? '0 4px 10px rgba(0,0,0,0.3)' : '0 4px 10px rgba(0,0,0,0.1)', 
        height: isMobile ? '250px' : '300px', 
        width: isMobile ? '100%' : '300px',
        minWidth: isMobile ? '250px' : '300px',
        flex: isMobile ? '1 1 100%' : '1 0 300px',
        transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
        className: 'chart-container'
      }}>
        <Pie data={pieData} options={pieOptions} />
      </div>
    );
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: isMobile ? '15px' : '20px', 
      justifyContent: 'center',
      width: '100%'
    }}>
      {statusCharts.length > 0 ? statusCharts : 
        <p style={{ textAlign: 'center', color: '#666', fontSize: isMobile ? '16px' : '18px', width: '100%' }}>
          Nenhum dado de status disponível.
        </p>
      }
    </div>
  );
}

export default StatusCharts;
