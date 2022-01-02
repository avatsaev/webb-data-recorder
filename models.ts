export type TrackingPayload = {
    distanceEarthKm: number | null;
    launchElapsedTime: string | null;
    distanceL2Km: number | null;
    percentageCompleted: number | null;
    speedKmS: number | null;
    deploymentImgURL: string | null;
    currentDeploymentStep: string | null;
    tempC: {
        tempWarmSide1C: number | null;
        tempWarmSide2C: number | null;
        tempCoolSide1C: number | null;
        tempCoolSide2C: number | null;
    };
    timestamp: string | null;
};
