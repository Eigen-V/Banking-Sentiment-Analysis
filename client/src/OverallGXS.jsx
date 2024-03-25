import { LineChart } from '@mantine/charts';
// import {testData} from './data';
import axios from 'axios';
import React, {useState, useEffect} from 'react';


// need data with percentages for each sentiment, according to date/month

export default function LineData() {
    const [reviewsData, setReviews] = useState([]);

    useEffect(() => {
      // fetch data from API endpoint
      axios.get('http://127.0.0.1:5001/api/reviews')
        .then(response => {
          console.log('Retrieved data:', response.data);
          setReviews(response.data); // Update reviewsData state
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
          // Handle error, e.g., display error message to user
        });
    }, []);

    function calcSentimentPercentage(data){
        // filter data for GXS bank
        const gxsData = data.filter(entry => entry.bank === 'GXS');
    
        // group data by moth and sentiment
        const groupedData ={};
        gxsData.forEach(({month, sentiment}) => {
            if (!groupedData[month]) groupedData[month] = { pos: 0, neu: 0, neg: 0 };
            groupedData[month][sentiment] ++;
        });
    
        // calculate average percentage for each month
        const result =[];
        for (const month in groupedData){
            const total = Object.values(groupedData[month]).reduce((acc,val) => acc+val,0);
            const percentages ={}
            for (const sentiment in groupedData[month]) {
                const sentimentKey = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
                percentages[sentimentKey] = ((groupedData[month][sentiment]/total) * 100).toFixed(0);
            }
            result.push({month: parseInt(month), ...percentages});
        }
        return result;
    };
    
    const data = calcSentimentPercentage(reviewsData);
    const mappedData = data.map(item => ({
        month: item.month,
        Positive: item.Pos,
        Neutral: item.Neu,
        Negative: item.Neg
    }));
    //console.log(mappedData) // correct output

    return (
        <LineChart
            h={100}
            w={300}
            data={mappedData}
            dataKey='month'
            series={[
                {name: 'Positive', color: 'green'},
                {name: 'Neutral', color: 'grey'},
                {name: 'Negative', color: 'red'},
            ]} 
        />
    );
}
