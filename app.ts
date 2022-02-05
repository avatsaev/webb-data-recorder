import axios from 'axios';
import {InfluxDB, Point} from "@influxdata/influxdb-client";
import {TrackingPayload} from "./models";

const WEBB_TRACKER_API_ENDPOINT = process.env.WEBB_TRACKER_API_ENDPOINT ?? "https://api.jwst-hub.com";
const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN ?? "";
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET ?? "jwst-tracking";
const INFLUXDB_ORG = process.env.INFLUXDB_ORG ?? "";
const INFLUXDB_HOST = process.env.INFLUXDB_HOST ?? "";
const SAMPLE_INTERVAL = +process.env.SAMPLE_INTERVAL ?? 300_000 // 300_000; // 5 minutes
const influxClient = new InfluxDB({url: INFLUXDB_HOST, token: INFLUXDB_TOKEN})
const writeApi = influxClient.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET);

let dataPointsCounter = 0;
console.log("Starting recording with interval: " + SAMPLE_INTERVAL + "ms");
const interval = setInterval(async () => {

    axios.get(`${WEBB_TRACKER_API_ENDPOINT}/track`)
        .then( res => {
            const data: TrackingPayload = res.data;

            const tempPoints = Object.entries(data.tempC).map( ([k,v]) =>  new Point('webbTemp').floatField(k, v));


            console.log(`Writing `, tempPoints);
            writeApi.writePoints(tempPoints);
            dataPointsCounter++;

            // write time series data in batches of 10 points
            if(dataPointsCounter > 10) {
                console.log("Flushing data to InfluxDB...");
                writeApi.flush();
                dataPointsCounter = 0;
                // clearInterval(interval);
            }

        })
        .catch(error => {
            console.log(error);
        });
}, SAMPLE_INTERVAL);
