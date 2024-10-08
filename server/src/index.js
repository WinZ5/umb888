require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Database connection is complete." });
});

app.get("/api/stations", (req, res) => {

  const query = `
    SELECT 
      s.StationID,
      s.StationName,
      s.Longitude,
      s.Latitude,
      s.Capacity,
    COUNT(u.UmbrellaID) AS CurrentStock
    FROM Stations s
    LEFT JOIN Umbrellas u ON s.StationID = u.CurrentStationID
    GROUP BY s.StationID, s.StationName, s.Longitude, s.Latitude, s.Capacity; `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results);
  });
});

app.get("/api/stations/:id", (req, res) => {
  const stationId = req.params.id;

  const query = "SELECT * FROM Stations WHERE StationID = ?";

  db.query(query, [stationId], (error, results) => {
    if (error) {
      console.error("Error querying the database:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json(results[0]);
  });
});

app.get("/api/heatmap-data", (req, res) => {
  const query = `
    SELECT 
        rh.StartStationID, 
        s1.Latitude AS StartLatitude, 
        s1.Longitude AS StartLongitude,
        rh.DestinationStationID,
        s2.Latitude AS DestinationLatitude, 
        s2.Longitude AS DestinationLongitude
    FROM RentalHistories rh
    JOIN Stations s1 ON rh.StartStationID = s1.StationID
    JOIN Stations s2 ON rh.DestinationStationID = s2.StationID
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching rental history:", err);
      return res.status(500).json({ error: "Database query error" });
    }

    res.json(results);
  });
});

app.get("/api/accounts", (req, res) => {
  const query = "SELECT * FROM Accounts";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching accounts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/accounts/:id", (req, res) => {
  const accountId = req.params.id;
  const query = "SELECT * FROM Accounts WHERE AccountID = ?";

  db.query(query, [accountId], (error, results) => {
    if (error) {
      console.error("Error fetching account:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json(results[0]);
  });
});

app.get("/api/cardIDs", (req, res) => {
  const query = "SELECT CardID FROM PaymentMethods";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching CardIDs:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const cardIDs = results.map((row) => row.CardID);
    res.json(cardIDs);
  });
});

app.get("/api/umbrellas", (req, res) => {
  const query = `
    SELECT u.UmbrellaID, u.Size, u.Color, u.CurrentStationID, s.StationName AS CurrentStationName
    FROM Umbrellas u
    LEFT JOIN Stations s ON u.CurrentStationID = s.StationID
  `;

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to fetch umbrellas" });
    }
    res.json(results);
  });
});

app.get("/api/umbrellas/:id", (req, res) => {
  const umbrellaId = req.params.id;
  const query = "SELECT * FROM Umbrellas WHERE UmbrellaID = ?";

  db.query(query, [umbrellaId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Umbrella not found" });
    }
    res.json(results[0]);
  });
});

app.get("/api/payments", (req, res) => {
  const query = "SELECT * FROM PaymentMethods";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching payment methods:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/maintainers", (req, res) => {
  const query = "SELECT * FROM Maintainers";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching maintainers:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(200).json(results);
  });
});

app.get("/api/maintainers/:id", (req, res) => {
  const maintainerId = req.params.id;
  const query = "SELECT * FROM Maintainers WHERE MaintainerID = ?";

  db.query(query, [maintainerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Maintainer not found" });
    }
    res.json(results[0]);
  });
});

app.get("/api/maintenance-histories", (req, res) => {
  const query = `
    SELECT 
      mh.MaintenanceHistoryID, 
      mh.MaintenanceTime, 
      mh.Report, 
      m.MaintainerID,
      m.FirstName AS MaintainerName, 
      m.LastName AS MaintainerLastName, 
      s.StationID,
      s.StationName 
    FROM MaintenanceHistories mh
    JOIN Maintainers m ON mh.MaintainerID = m.MaintainerID
    JOIN Stations s ON mh.StationID = s.StationID
    ORDER BY mh.MaintenanceHistoryID
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching maintenance histories:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch maintenance histories" });
    }
    res.json(results);
  });
});

app.get("/api/maintenance-histories/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT * FROM MaintenanceHistories WHERE MaintenanceHistoryID = ?";

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(404).send("Maintenance history not found");
    res.json(results[0]);
  });
});

app.get("/api/rental-histories", (req, res) => {
  const query = `
    SELECT
      rh.RentalHistoryID,
      rh.StartRentalTime,
      rh.EndRentalTime,
      rh.UmbrellaID,
      a.AccountID,
      a.FirstName,
      a.LastName,
      ss.StationID AS StartStationID,
      ss.StationName AS StartStationName,
      ds.StationID AS DestinationStationID,
      ds.StationName AS DestinationStationName
    FROM RentalHistories rh
    JOIN Accounts a ON rh.AccountID = a.AccountID
    JOIN Stations ss ON rh.StartStationID = ss.StationID
    LEFT JOIN Stations ds ON rh.DestinationStationID = ds.StationID
    ORDER BY rh.RentalHistoryID ASC  -- Sort by RentalHistoryID
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching rental histories:", err);
      return res
        .status(500)
        .json({ error: "Failed to fetch rental histories" });
    }
    res.json(results);
  });
});

app.get("/api/rental-histories/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      rh.RentalHistoryID,
      rh.AccountID,
      rh.UmbrellaID,
      rh.StartStationID,
      rh.DestinationStationID,
      rh.StartRentalTime,
      rh.EndRentalTime,
      a.FirstName AS AccountFirstName,
      a.LastName AS AccountLastName,
      s1.StationName AS StartStationName,
      s2.StationName AS EndStationName
    FROM RentalHistories rh
    JOIN Accounts a ON rh.AccountID = a.AccountID
    JOIN Stations s1 ON rh.StartStationID = s1.StationID
    JOIN Stations s2 ON rh.DestinationStationID = s2.StationID
    WHERE rh.RentalHistoryID = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching rental history:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Rental history not found" });
    }

    const rentalHistory = results[0];
    res.json(rentalHistory);
  });
});

app.post("/api/stations", (req, res) => {
  const { StationName, Longitude, Latitude, Capacity } = req.body;

  const query = `INSERT INTO stations (StationName, Longitude, Latitude, Capacity) VALUES (?, ?, ?, ?)`;
  const values = [StationName, Longitude, Latitude, Capacity];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error inserting new station:", error);
      return res.status(500).json({ error: "Failed to insert new station" });
    }
    res
      .status(201)
      .json({ message: "New station added", id: results.insertId });
  });
});

app.post("/api/accounts", (req, res) => {
  const {
    FirstName,
    LastName,
    Email,
    DateOfBirth,
    Phone,
    Street,
    City,
    Province,
    ZIPCode,
    CardID,
  } = req.body;

  const formattedDateOfBirth = formatDate(DateOfBirth);

  const query = `
    INSERT INTO Accounts (FirstName, LastName, Email, DateOfBirth, Phone, Street, City, Province, ZIPCode, CardID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    LastName,
    Email,
    formattedDateOfBirth,
    Phone,
    Street,
    City,
    Province,
    ZIPCode,
    CardID,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting account data:", err);
      return res.status(500).json({ message: "Failed to insert new account" });
    }

    console.log("Account created with ID:", results.insertId);
    res
      .status(201)
      .json({ message: "New account added", accountId: results.insertId });
  });
});

app.post("/api/umbrellas", (req, res) => {
  const { Size, Color, CurrentStationID } = req.body;

  const query =
    "INSERT INTO Umbrellas (Size, Color, CurrentStationID) VALUES (?, ?, ?)";
  db.query(query, [Size, Color, CurrentStationID], (err, result) => {
    if (err) {
      console.error("Error inserting umbrella data:", err);
      return res.status(500).json({ message: "Failed to insert new umbrella" });
    }

    res
      .status(201)
      .json({ id: result.insertId, Size, Color, CurrentStationID });
  });
});

app.post("/api/payments", (req, res) => {
  const { CardNumber, CardName, CVV, ExpireDate } = req.body;

  const query =
    "INSERT INTO PaymentMethods (CardNumber, CardName, CVV, ExpireDate) VALUES (?, ?, ?, ?)";

  db.query(query, [CardNumber, CardName, CVV, ExpireDate], (err, result) => {
    if (err) {
      console.error("Error inserting payment method data:", err);
      return res
        .status(500)
        .json({ message: "Failed to insert new payment method" });
    }

    res
      .status(201)
      .json({ CardID: result.insertId, CardNumber, CardName, CVV, ExpireDate });
  });
});

app.post("/api/maintainers", (req, res) => {
  const {
    FirstName,
    LastName,
    Phone,
    Email,
    DateOfBirth,
    ZIPCode,
    Street,
    City,
    Province,
    Salary,
  } = req.body;

  const formattedDateOfBirth = formatDate(DateOfBirth);

  const query = `
    INSERT INTO Maintainers (FirstName, LastName, Phone, Email, DateOfBirth, ZIPCode, Street, City, Province, Salary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    FirstName,
    LastName,
    Phone,
    Email,
    formattedDateOfBirth,
    ZIPCode,
    Street,
    City,
    Province,
    Salary,
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error inserting maintainer data:", err);
      return res
        .status(500)
        .json({ message: "Failed to insert new maintainer" });
    }

    console.log("Maintainer created with ID:", results.insertId);
    res.status(201).json({
      message: "New maintainer added",
      maintainerId: results.insertId,
    });
  });
});

app.post("/api/maintenance-histories", (req, res) => {
  const { MaintenanceTime, MaintainerID, StationID, Report } = req.body;

  const query =
    "INSERT INTO MaintenanceHistories (MaintenanceTime, MaintainerID, StationID, Report) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [MaintenanceTime, MaintainerID, StationID, Report],
    (err, result) => {
      if (err) {
        console.error("Error inserting maintenance history data:", err);
        return res
          .status(500)
          .json({ message: "Failed to insert new maintenance history" });
      }

      res.status(201).json({
        id: result.insertId,
        MaintenanceTime,
        MaintainerID,
        StationID,
        Report,
      });
    }
  );
});

app.post("/api/rental-histories", (req, res) => {
  const {
    AccountID,
    DestinationStationID,
    StartStationID,
    CardID,
    UmbrellaID,
    StartRentalTime,
    EndRentalTime,
  } = req.body;

  const query = `
    INSERT INTO RentalHistories 
    (AccountID, DestinationStationID, StartStationID, CardID, UmbrellaID, StartRentalTime, EndRentalTime) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      AccountID,
      DestinationStationID,
      StartStationID,
      CardID,
      UmbrellaID,
      StartRentalTime,
      EndRentalTime,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting rental history data:", err);
        return res
          .status(500)
          .json({ message: "Failed to insert new rental history" });
      }

      res.status(201).json({
        id: result.insertId,
        AccountID,
        DestinationStationID,
        StartStationID,
        CardID,
        UmbrellaID,
        StartRentalTime,
        EndRentalTime,
      });
    }
  );
});

app.put("/api/stations/:stationId", (req, res) => {
  const { stationId } = req.params;
  const { StationName, Capacity, Latitude, Longitude } = req.body;

  const query =
    "UPDATE Stations SET StationName = ?, Capacity = ?, Latitude = ?, Longitude = ? WHERE StationID = ?";
  const values = [StationName, Capacity, Latitude, Longitude, stationId];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating station:", error);
      return res.status(500).json({ error: "Error updating station" });
    }

    res.json({ message: "Station updated successfully" });
  });
});

app.put("/api/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;
  const {
    FirstName,
    LastName,
    Email,
    DateOfBirth,
    Phone,
    CardID,
    ZIPCode,
    Street,
    City,
    Province,
  } = req.body;

  const formattedDateOfBirth = formatDate(DateOfBirth);

  const query = `
    UPDATE Accounts 
    SET 
      FirstName = ?, 
      LastName = ?, 
      Email = ?, 
      DateOfBirth = ?, 
      Phone = ?, 
      CardID = ?, 
      ZIPCode = ?, 
      Street = ?, 
      City = ?, 
      Province = ? 
    WHERE AccountID = ?`;

  const values = [
    FirstName,
    LastName,
    Email,
    formattedDateOfBirth,
    Phone,
    CardID,
    ZIPCode,
    Street,
    City,
    Province,
    accountId,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating account:", error);
      return res.status(500).json({ error: "Error updating account" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.json({ message: "Account updated successfully" });
  });
});

app.put("/api/umbrellas/:id", (req, res) => {
  const umbrellaId = req.params.id;
  const { Size, Color, CurrentStationID } = req.body;
  const query =
    "UPDATE Umbrellas SET Size = ?, Color = ?, CurrentStationID = ? WHERE UmbrellaID = ?";

  db.query(
    query,
    [Size, Color, CurrentStationID, umbrellaId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Umbrella not found" });
      }
      res.json({ message: "Umbrella updated successfully" });
    }
  );
});

app.put("/api/maintainers/:maintainerId", (req, res) => {
  const { maintainerId } = req.params;
  const { FirstName, LastName, Email, Phone, Street, City, Province, ZIPCode } =
    req.body;

  const query = `
    UPDATE Maintainers 
    SET 
      FirstName = ?, 
      LastName = ?, 
      Email = ?, 
      Phone = ?, 
      Street = ?, 
      City = ?, 
      Province = ?, 
      ZIPCode = ? 
    WHERE MaintainerID = ?`;

  const values = [
    FirstName,
    LastName,
    Email,
    Phone,
    Street,
    City,
    Province,
    ZIPCode,
    maintainerId,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating maintainer:", error);
      return res.status(500).json({ error: "Error updating maintainer" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Maintainer not found" });
    }

    res.json({ message: "Maintainer updated successfully" });
  });
});

app.put("/api/maintenance-histories/:historyid", (req, res) => {
  const { historyid } = req.params;
  const { MaintenanceTime, MaintainerID, StationID, Report } = req.body;
  const sql =
    "UPDATE MaintenanceHistories SET MaintenanceTime = ?, MaintainerID = ?, StationID = ?, Report = ? WHERE MaintenanceHistoryID = ?";

  db.query(
    sql,
    [MaintenanceTime, MaintainerID, StationID, Report, historyid],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0)
        return res.status(404).send("Maintenance history not found");
      res.json({ MaintenanceHistoryID: historyid, ...req.body });
    }
  );
});

app.put("/api/rental-histories/:rentalId", (req, res) => {
  const { rentalId } = req.params;
  const {
    AccountID,
    UmbrellaID,
    StartStationID,
    DestinationStationID,
    StartRentalTime,
    EndRentalTime,
  } = req.body;

  const formatToMySQLDateTime = (isoDate) => {
    return new Date(isoDate).toISOString().slice(0, 19).replace("T", " ");
  };

  const formattedStartRentalTime = formatToMySQLDateTime(StartRentalTime);
  const formattedEndRentalTime = formatToMySQLDateTime(EndRentalTime);

  const sql = `
    UPDATE RentalHistories 
    SET 
      AccountID = ?, 
      UmbrellaID = ?, 
      StartStationID = ?, 
      DestinationStationID = ?, 
      StartRentalTime = ?, 
      EndRentalTime = ? 
    WHERE RentalHistoryID = ?`;

  db.query(
    sql,
    [
      AccountID,
      UmbrellaID,
      StartStationID,
      DestinationStationID,
      formattedStartRentalTime,
      formattedEndRentalTime,
      rentalId,
    ],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0)
        return res.status(404).send("Rental history not found");
      res.json({ RentalHistoryID: rentalId, ...req.body });
    }
  );
});

app.delete("/api/stations/:stationId", (req, res) => {
  const { stationId } = req.params;

  const query = "DELETE FROM Stations WHERE StationID = ?";
  db.query(query, [stationId], (error, results) => {
    if (error) {
      console.error("Error deleting station:", error);
      return res.status(500).json({ error: "Error deleting station" });
    }

    res.json({ message: "Station deleted successfully" });
  });
});

app.delete("/api/accounts/:accountId", (req, res) => {
  const { accountId } = req.params;

  const query = "DELETE FROM Accounts WHERE AccountID = ?";
  db.query(query, [accountId], (error, results) => {
    if (error) {
      console.error("Error deleting account:", error);
      return res.status(500).json({ error: "Error deleting account" });
    }

    res.json({ message: "Account deleted successfully" });
  });
});

app.delete("/api/umbrellas/:id", (req, res) => {
  const umbrellaId = req.params.id;

  const query = "DELETE FROM Umbrellas WHERE UmbrellaID = ?";

  db.query(query, [umbrellaId], (err, result) => {
    if (err) {
      console.error("Error deleting umbrella:", err);
      return res.status(500).json({ error: "Error deleting umbrella" });
    }

    res.status(200).json({ message: "Umbrella deleted successfully" });
  });
});

app.delete("/api/payments/:id", (req, res) => {
  const cardID = req.params.id;

  const query = "DELETE FROM PaymentMethods WHERE CardID = ?";

  db.query(query, [cardID], (err, result) => {
    if (err) {
      console.error("Error deleting payment method:", err);
      return res.status(500).json({ message: "Error deleting payment method" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.status(200).json({ message: "Payment method deleted successfully" });
  });
});

app.delete("/api/maintainers/:maintainerId", (req, res) => {
  const { maintainerId } = req.params;

  const query = "DELETE FROM Maintainers WHERE MaintainerID = ?";
  db.query(query, [maintainerId], (error, results) => {
    if (error) {
      console.error("Error deleting maintainer:", error);
      return res.status(500).json({ error: "Error deleting maintainer" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Maintainer not found" });
    }

    res.json({ message: "Maintainer deleted successfully" });
  });
});

app.delete("/api/maintenance-histories/:historyId", (req, res) => {
  const { historyId } = req.params;

  const query =
    "DELETE FROM MaintenanceHistories WHERE MaintenanceHistoryID = ?";
  db.query(query, [historyId], (error, results) => {
    if (error) {
      console.error("Error deleting maintenance history:", error);
      return res
        .status(500)
        .json({ error: "Error deleting maintenance history" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Maintenance history not found" });
    }

    res.json({ message: "Maintenance history deleted successfully" });
  });
});

app.delete("/api/rental-histories/:rentalId", (req, res) => {
  const { rentalId } = req.params;

  const query = "DELETE FROM RentalHistories WHERE RentalHistoryID = ?";
  db.query(query, [rentalId], (error, results) => {
    if (error) {
      console.error("Error deleting rental history:", error);
      return res.status(500).json({ error: "Error deleting rental history" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Rental history not found" });
    }

    res.json({ message: "Rental history deleted successfully" });
  });
});
