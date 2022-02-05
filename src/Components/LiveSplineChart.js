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
                    speed: 400
                }
            },
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 2,
            curve: 'smooth'
        },
        xaxis: {
            colors: ['#FEFEFE'],
            range: 10
        },
    }

    return (
        <div id="chart">
            <Chart options={options} series={series} type="line"/>
        </div>
    )
}