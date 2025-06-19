import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Chart color scheme based on CloudFarm primary color
const CHART_COLORS = {
  primary: '#006494',
  secondary: '#0582CA',
  accent: '#00A6FB',
  light: '#B3E5FC',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  gray: '#9E9E9E'
};

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          family: 'Roboto',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: CHART_COLORS.primary,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      font: {
        family: 'Roboto'
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Roboto',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          family: 'Roboto',
          size: 11
        }
      }
    }
  }
};

// Revenue Trend Chart
export function RevenueTrendChart({ data, period = 'month' }) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Receita (R$)',
        data: data.map(item => item.revenue),
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.light,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: `Evolução da Receita - ${period === 'month' ? 'Mensal' : 'Anual'}`,
        font: {
          family: 'Roboto',
          size: 16,
          weight: 'bold'
        },
        color: '#333'
      }
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}

// Service Types Distribution Chart
export function ServiceTypesChart({ data }) {
  const chartData = {
    labels: data.map(item => item.type),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          CHART_COLORS.primary,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
          CHART_COLORS.success,
          CHART_COLORS.warning,
          CHART_COLORS.error,
          CHART_COLORS.gray,
          CHART_COLORS.light
        ],
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            family: 'Roboto',
            size: 11
          }
        }
      },
      title: {
        display: true,
        text: 'Distribuição por Tipo de Serviço',
        font: {
          family: 'Roboto',
          size: 16,
          weight: 'bold'
        },
        color: '#333'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}

// Monthly Performance Chart
export function MonthlyPerformanceChart({ data }) {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Área Aplicada (ha)',
        data: data.map(item => item.area),
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'Horas Voadas',
        data: data.map(item => item.hours),
        backgroundColor: CHART_COLORS.secondary,
        borderColor: CHART_COLORS.secondary,
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            family: 'Roboto',
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Performance Mensal',
        font: {
          family: 'Roboto',
          size: 16,
          weight: 'bold'
        },
        color: '#333'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: CHART_COLORS.primary,
        borderWidth: 1,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          },
          callback: function(value) {
            return value + ' ha';
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          },
          callback: function(value) {
            return value + ' h';
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Client Revenue Chart
export function ClientRevenueChart({ data }) {
  const chartData = {
    labels: data.map(item => item.client),
    datasets: [
      {
        label: 'Receita (R$)',
        data: data.map(item => item.revenue),
        backgroundColor: data.map((_, index) => {
          const colors = [
            CHART_COLORS.primary,
            CHART_COLORS.secondary,
            CHART_COLORS.accent,
            CHART_COLORS.success,
            CHART_COLORS.warning
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    ...commonOptions,
    indexAxis: 'y',
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Receita por Cliente',
        font: {
          family: 'Roboto',
          size: 16,
          weight: 'bold'
        },
        color: '#333'
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          },
          callback: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          }
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Roboto',
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

// Aircraft Usage Chart
export function AircraftUsageChart({ data }) {
  const chartData = {
    labels: data.map(item => item.aircraft),
    datasets: [
      {
        label: 'Horas Voadas',
        data: data.map(item => item.hours),
        backgroundColor: CHART_COLORS.primary,
        borderColor: CHART_COLORS.primary,
        borderWidth: 1
      }
    ]
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: true,
        text: 'Uso de Aeronaves (Horas)',
        font: {
          family: 'Roboto',
          size: 16,
          weight: 'bold'
        },
        color: '#333'
      },
      legend: {
        display: false
      }
    },
    scales: {
      ...commonOptions.scales,
      y: {
        ...commonOptions.scales.y,
        ticks: {
          ...commonOptions.scales.y.ticks,
          callback: function(value) {
            return value + ' h';
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
}

