const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 4001;
const app = express();

let logs = [];

app.use(cors());
app.use(express.json());

app
  .route("/")
  .get((req, res) => {
    res.status(200).json({ message: "Logging API is running" });
  })
  .options((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app
  .route("/health")
  .get((req, res) => {
    res.status(200).json({ message: "Logging API is healthy" });
  })
  .options((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    res.sendStatus(204);
  })
  .all((req, res) => {
    res.set("Allow", "GET, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app
  .route("/logs")

  .get((req, res) => {
    const _level = req.query.level;
    const _source = req.query.source;
    const _start = req.query.start;
    const _end = req.query.end;
    const _limit = req.query.limit;

    if (!logs || logs.length === 0) {
      return res.status(200).json([]);
    }

    if (_start && isNaN(parseInt(_start, 10))) {
      return res.status(400).json({ message: "Invalid 'start' timestamp" });
    }
    if (_end && isNaN(parseInt(_end, 10))) {
      return res.status(400).json({ message: "Invalid 'end' timestamp" });
    }
    if (_limit && isNaN(parseInt(_limit, 10))) {
      return res.status(400).json({ message: "Invalid 'limit' value" });
    }

    let filteredLogs = logs;
    if (_level) {
      filteredLogs = filteredLogs.filter((log) => log.level === _level);
    }
    if (_source) {
      filteredLogs = filteredLogs.filter((log) => log.source === _source);
    }
    if (_start) {
      const startTime = parseInt(_start, 10);
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= startTime);
    }
    if (_end) {
      const endTime = parseInt(_end, 10);
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= endTime);
    }
    if (_limit) {
      const limit = parseInt(_limit, 10);
      filteredLogs = filteredLogs.slice(0, limit);
    }
    res.status(200).json(filteredLogs);
  })

  .post((req, res) => {
    const logEntry = req.body;

    if (!logEntry || Object.keys(logEntry).length === 0) {
      return res.status(400).json({ message: "Log entry cannot be empty" });
    }

    if (!logEntry.level || !logEntry.message || !logEntry.source) {
      return res.status(400).json({ message: "Log entry must contain 'level', 'message', and 'source'" });
    }

    logEntry.timestamp = new Date().getTime();

    logs.push(logEntry);
    res.status(201).json({ message: "Log entry created", log: logEntry });
    const date = new Date(logEntry.timestamp);
    const { day, month, year, hours, minutes, seconds } = {
      day: String(date.getDate()).padStart(2, "0"),
      month: String(date.getMonth() + 1).padStart(2, "0"),
      year: date.getFullYear(),
      hours: String(date.getHours()).padStart(2, "0"),
      minutes: String(date.getMinutes()).padStart(2, "0"),
      seconds: String(date.getSeconds()).padStart(2, "0"),
    };
    console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} [${logEntry.level}] (${logEntry.source}): ${logEntry.message}`);
  })

  .options((req, res) => {
    res.set("Allow", "GET, POST, OPTIONS");
    res.sendStatus(204);
  })

  .all((req, res) => {
    res.set("Allow", "GET, POST, OPTIONS");
    return res.status(405).json({ message: `Method Not Allowed` });
  });

app.use((req, res) => {
  res.status(404).json({ message: `Resource Not Found: ${req.path}` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Logging API is running at http://localhost:${PORT}`);
});
