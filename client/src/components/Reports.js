import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
  } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {removeDuplicates} from "../utils/utility"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
);

/**
 * Unique API user over time
 */
export const  Report1 = ({record}) =>  {
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Unique API user by date',
          },
        },
    };

    const getLabels = () => {
        let labels = []
        for (const r of record) {
            labels.push(`${r.date.slice(0, r.date.indexOf('T'))}`)
        }
        labels = labels.filter(removeDuplicates)
        return labels
    }

    const getData = (labels) => {
        let data = []

        // For every date in labels
        //  find all records made on that day
        //  filter the records found by id
        //  add to data array the length of that filtered records

        for (const date of labels) {
            let recordsOnThisDate = record.filter(r => `${r.date.slice(0, r.date.indexOf('T'))}` === date)
            let userIdsOnThisDate = []

            for (const r of recordsOnThisDate) {
                if (!userIdsOnThisDate.includes(r.userId) && r.userId !== 'false') {
                    userIdsOnThisDate.push(r.userId)
                }
            }
            data.push(userIdsOnThisDate.length)
        }

        return data;
    }

    const labels = getLabels()
    const dataset = getData(labels)
    const data = {
        labels,
        datasets: [
            {
            label: '# of unique API users',
            data: dataset,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };


    return (
        <>
            <h3>Unique API user per day</h3>
            <Line options={chartOptions} data={data} />
        </>
    )
}

/**
 * 4xx err count by endpoint
 */
export const Report2 = ({record}) => {
    const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: '4xx error count by Endpoint',
          },
        },
      };

    const getLabels = () => {
        let labels = []
        for (const r of record) {
            labels.push(`${r.method} ${r.endpoint}`)
        }
        labels = labels.filter(removeDuplicates)
        return labels
    }

    const labels = getLabels()
    const data = {
        labels,
        datasets: [
          {
            label: '# of 400 errors',
            data: labels.map((endpoint) => record.filter(r => `${r.method} ${r.endpoint}` === endpoint && r.statusCode === 400).length),
            backgroundColor: 'rgba(240, 192, 55, 0.8)',
          }
        ],
    };


    return (
        <>
            <h3>4xx error count by endpoint</h3>
            <Bar options={chartOptions} data={data} />
        </>
    )
}

/**
 * Recent 4xx and 5xx errors
 */
export const Report3 = ({record}) => {

    function compare( a, b ) {
        if ( a.date < b.date ){
          return 1;
        }
        if ( a.date > b.date ){
          return -1;
        }
        return 0;
    }

    
    const getUsefulRecord = () => {
        let useful = record.filter(r => [400, 500].includes(r.statusCode))
        useful.sort(compare)
        return useful
    }

    return (
        <>
            <h2>Recent 4xx and 5xx errors</h2>
            {getUsefulRecord().map(record => {return <ErrorRecord key={record.date} record={record}/>})}
        </>
    )

    function ErrorRecord({record}) {
        return (
            <div style={{border: "solid red", margin: "10px", padding: "10px"}}>
                <h1>{record.method} {record.endpoint}</h1>
                <p>StatusCode: {record.statusCode}</p>
                <p>{record.date}</p>
            </div>
        )
    }
}