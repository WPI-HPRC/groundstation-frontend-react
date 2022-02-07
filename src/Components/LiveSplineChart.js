import Chart from 'react-apexcharts'

export default (props) => {
    const series = [{
        name: "x",
        data: props.data
    }];
    const options = {
        chart: {
            type: "line",
            zoom: {
                enabled: true
            },
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1
                }
            },
            toolbar: {
                show: false
            },
        },
        colors: ['#ED5031'],
        markers: {
            colors: ['#ED5031']
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 4,
            curve: 'smooth'
        },
        xaxis: {
            colors: ['#FEFEFE'],
            range: props.datanum,
            tickAmount: 1,
            labels: {
                show: false
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: ['#F7F7F7'],
                    fontSize: '12px',
                    fontWeight: 400,
                }
            },
            axisTicks: {
                show: false
            }
        }
    }

    return (
        <div id="chart">
            <Chart options={options} series={series} type="line"/>
        </div>
    )
}