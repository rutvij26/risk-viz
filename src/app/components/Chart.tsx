import { observer, useLocalObservable } from "mobx-react-lite"
import RiskStore, { IRiskData } from "../store/RiskStore"
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title , CategoryScale, Tooltip, Legend} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

type ChartDataItem = {
  year: number;
  riskRating: number;
  count: number;
};

export default observer(function ChartComponent() {
    const store = useLocalObservable(() => RiskStore)

    const chartData = {
        labels: store.decades,
        datasets: [
            {
                label: "Average of Risk Rating",
                data: Object.values<Record<number, ChartDataItem>>(
                    store.filteredChartData.reduce((acc: any, curr: any) => {
                      if (!acc[curr.year]) {
                        acc[curr.year] = { year: curr.year, riskRating: curr.riskRating, count: 1 };
                      } else {
                        acc[curr.year].riskRating += curr.riskRating;
                        acc[curr.year].count++;
                      }
                      return acc;
                    }, {})
                  ).map(({ year, riskRating, count }: any) => ({ x: year, y: riskRating / count })),
                borderColor: "#b12126",
                fill: false,
                pointRadius: 8,
                showLine: true
              },
                {
                label: "Risk Rating",
                data: store.filteredChartData.map((d) => {
                    return {
                        x: d.year,
                        y: d.riskRating
                    }
                }),
                borderColor: '#4a2eeb',
                fill: false,
                showLine:false
              },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Risk Rating over time (Year)',
          },
          tooltip: {
            callbacks: {
                label: function(tooltipItem: any) {
                    const assetName = store.filteredChartData[tooltipItem.dataIndex]?.assetName;
                    const businessCategory = store.filteredChartData[tooltipItem.dataIndex]?.businessCategory;
                    return `${assetName} (${businessCategory})`;
                },
                afterLabel: function(tooltipItem: any) {
                    const riskRating = tooltipItem.raw['y'];
                    const returnArray = [`Risk Ratings: ${riskRating}`]
                    const riskFactors = store.filteredChartData[tooltipItem.dataIndex].riskFactors;
                    Object.keys(riskFactors).forEach((key) => returnArray.push(
                        `${key} : ${riskFactors[key]}`
                    ))
                    const latLong = store.filteredChartData[tooltipItem.dataIndex].lat.toString()+ ","+ store.filteredChartData[tooltipItem.dataIndex].long.toString()
                    returnArray.push(latLong)
                    return returnArray
                },
                beforeLabel: function(tooltipItem: any) {
                    return tooltipItem.dataset.label
                }
            }
          }
        },
      };

    return <div className="flex  h-[90%] w-[90%] ml-5 mb-5  items-center justify-center">
        <Line data={chartData} options={options}></Line>
    </div>
})