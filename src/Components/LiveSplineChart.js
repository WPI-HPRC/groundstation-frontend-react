import Chart from 'react-apexcharts'

export default (props) => {
    const series = [{
        name: props.name0,
        data: props.data0
    },
    {
        name: props.name1,
        data: props.data1
    },
    {
        name: props.name2,
        data: props.data2
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
        colors: ['#ED5031', '#00f700', '#1aa3e8'],
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
        legend: {
            showForNullSeries: false,
            showForZeroSeries: false,
            position: 'top',
            horizontalAlign: 'left',
            floating: false,
            labels: {
                colors: ['#FEFEFE'],
                useSeriesColors: false
            }
        },
        xaxis: {
            type: 'numeric',
            colors: ['#FEFEFE'],
            range: props.datanum * 100,
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
            },
            floating: false,
            decimalsInFloat: 2
        }
    }

    return (
        <div id="chart">
            <Chart options={options} series={series} type="line"/>
        </div>
    )
}