FROM node:16-alpine AS builder
RUN mkdir -p /build
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build


# --------------------------------------

FROM node:16-alpine

RUN mkdir /app

WORKDIR /app

ENV INFLUXDB_TOKEN=""
ENV INFLUXDB_ORG=""
ENV INFLUXDB_BUCKET=""
ENV INFLUXDB_HOST=""
ENV SAMPLE_INTERVAL="60000"

COPY --from=builder /build/package.json /app/
COPY --from=builder /build/dist/ /app/

RUN npm install --only=prod

EXPOSE 8002
CMD [ "node", "app.js" ]
