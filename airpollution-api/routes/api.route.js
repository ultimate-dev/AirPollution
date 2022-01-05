const moment = require("moment");
const router = require("express").Router();
const openGeocoder = require("node-open-geocoder");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    let result = [];

    let stations = await prisma.station.findMany();

    await Promise.all(
      stations.map(async (station) => {
        let data = await prisma.data.findFirst({ orderBy: { date: "desc" } });

        let obj = {
          ...data,
        };
        obj["id"] = station.id;
        let location = await new Promise((resolve, reject) => {
          openGeocoder()
            .reverse(data.lng, data.lat)
            .end((err, res) => {
              if (err) reject(err);
              else resolve(res);
            });
        });
        obj["locationText"] = String(location.display_name).substring(
          String(location.display_name).indexOf(",") + 1,
          String(location.display_name).indexOf(
            ",",
            String(location.display_name).indexOf(",") + 1
          )
        );
        let count = await prisma.data.count();
        let chart = await prisma.data.findMany({
          orderBy: { date: "asc" },
          skip: count >= 25 ? count - 25 : 0,
          take: 25,
        });

        let ppm_chart = [],
          dht_chart = [];

        await Promise.all(
          chart.map(async (item) => {
            ppm_chart.push({
              date: moment(item.date).format("HH:mm"),
              ppm: item.ppm,
            });
            dht_chart.push({
              date: moment(item.date).format("HH:mm"),
              temp: item.temperature,
              humi: item.humidity,
            });
          })
        );

        obj["ppm_chart"] = ppm_chart;
        obj["dht_chart"] = dht_chart;

        result.push(obj);
      })
    );

    res.json({
      error: 0,
      result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const io = res.app.get("io");
    const {
      id,
      lng,
      lat,
      ppm = 0,
      co_ppm = 0,
      co2_ppm = 0,
      alkol_ppm = 0,
      aseton_ppm = 0,
      temperature = 0,
      humidity = 0,
      heat_index = 0,
      pressure = 0,
      altitude = 0,
    } = req.body;

    const data = await prisma.data.create({
      data: {
        station_id: id,
        lng,
        lat,
        ppm,
        co_ppm,
        co2_ppm,
        alkol_ppm,
        aseton_ppm,
        temperature,
        humidity,
        heat_index,
        pressure,
        altitude,
      },
    });

    io.emit("update");

    res.json({
      error: 0,
      data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
