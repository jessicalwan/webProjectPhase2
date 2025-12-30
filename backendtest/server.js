// server.js
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// Serve images statically
// ==========================
app.use("/images", express.static(path.join(__dirname, "images")));

// ==========================
// Multer configuration
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    // IMPORTANT: store original filename
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ==========================
// MySQL connection
// ==========================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "bluecarehub",
});

// ==========================
// GET all doctors
// ==========================
app.get("/doctors", (req, res) => {
  const q = "SELECT id, name, specialty, description, image FROM doctors";

  db.query(q, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    const doctors = data.map((d) => ({
      id: d.id,
      name: d.name,
      image: d.image
        ? `http://localhost:5000/images/${d.image}`
        : null,
      services: [{ name: d.specialty }],
      description: d.description,
    }));

    res.json(doctors);
  });
});


// GET all bookings with doctor name and user name
app.get("/bookings", (req, res) => {
  const q = `
    SELECT 
      b.id, 
      b.doctor_id AS doctorId,
      u.full_name AS username,
      b.service_name AS service,
      b.day,
      b.time,
      b.duration,
      d.name AS doctorName
    FROM bookings b
    INNER JOIN doctors d ON b.doctor_id = d.id
    INNER JOIN users u ON b.user_id = u.id
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});



// POST new booking
app.post("/bookings", (req, res) => {
  const { doctorId, username, service, day, time, duration } = req.body;
  const q = `
    INSERT INTO bookings (doctorId, username, service, day, time, duration)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(q, [doctorId, username, service, day, time, duration], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json({ id: data.insertId, doctorId, username, service, day, time, duration });
  });
});

// DELETE a booking
app.delete("/bookings/:id", (req, res) => {
  const id = req.params.id;
  const q = "DELETE FROM bookings WHERE id = ?";

  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(500).json({ ok: false, error: err });
    }

    res.json({ ok: true });
  });
});


// GET doctor details by ID
app.get("/doctors/:id", (req, res) => {
  const doctorId = req.params.id;

  //  Get doctor info
  const doctorQuery = "SELECT id, name, specialty, description, image FROM doctors WHERE id = ?";
  
  db.query(doctorQuery, [doctorId], (err, doctorData) => {
    if (err) return res.status(500).json(err);
    if (doctorData.length === 0) return res.status(404).json({ message: "Doctor not found" });

    const doctor = doctorData[0];

    //  Get doctor services
    const serviceQuery = "SELECT id, name, duration, price FROM services WHERE doctor_id = ?";
    db.query(serviceQuery, [doctorId], (err, services) => {
      if (err) return res.status(500).json(err);

      //  Get doctor time slots
      const timeQuery = "SELECT day, time FROM time_slots WHERE doctor_id = ?";
      db.query(timeQuery, [doctorId], (err, timeData) => {
        if (err) return res.status(500).json(err);

        // organize time slots by day
        const timeSlots = [];
        const daysMap = {};

        for (const t of timeData) {
          if (!daysMap[t.day]) {
            daysMap[t.day] = { day: t.day, slots: [] };
            timeSlots.push(daysMap[t.day]);
          }
          daysMap[t.day].slots.push(t.time);
        }

        // prepare final response
        const response = {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          description: doctor.description,
          image: `http://localhost:5000/images/${doctor.image}`,
          services: services.map(s => ({ name: s.name, duration: s.duration, price: s.price })),
          timeSlots
        };

        res.json(response);
      });
    });
  });
});

app.post("/register", (req, res) => {
  const { full_name, phone, email, doctorId, service, day, time, duration } = req.body;

  if (!full_name || !phone || !email || !doctorId || !service || !day || !time || !duration) {
    return res.status(400).json({ ok: false, message: "Missing required fields" });
  }

  // Check if user already exists
  const checkUser = "SELECT id FROM users WHERE full_name = ? AND phone = ?";
  db.query(checkUser, [full_name, phone], (err, userData) => {
    if (err) return res.status(500).json({ ok: false, message: "DB error (checking user)", error: err });

    let userIdPromise;

    if (userData.length > 0) {
      // user exists
      userIdPromise = Promise.resolve(userData[0].id);
    } else {
      // insert new user
      userIdPromise = new Promise((resolve, reject) => {
        const insertUser = "INSERT INTO users(full_name, phone, email, created_at) VALUES (?, ?, ?, NOW())";
        db.query(insertUser, [full_name, phone, email], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
      });
    }

    userIdPromise
      .then((userId) => {
        // Check if slot already booked
        const checkSlot = `
          SELECT id FROM bookings 
          WHERE doctor_id = ? AND day = ? AND time = ?
        `;
        db.query(checkSlot, [doctorId, day, time], (err, slotData) => {
          if (err) return res.status(500).json({ ok: false, message: "DB error (checking slot)", error: err });

          if (slotData.length > 0) {
            return res.status(400).json({ ok: false, message: "Slot already taken. Please choose another time." });
          }

          // Insert booking
          const insertBooking = `
            INSERT INTO bookings(doctor_id, user_id, service_name, day, time, duration, created_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
          `;
          db.query(insertBooking, [doctorId, userId, service, day, time, duration], (err, bookingResult) => {
            if (err) return res.status(500).json({ ok: false, message: "DB error (inserting booking)", error: err });

            res.json({ ok: true, userId, bookingId: bookingResult.insertId });
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ ok: false, message: "DB error (creating user)", error: err });
      });
  });
});

//post contacts
app.post("/contact", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields",
    });
  }

  const q = `
    INSERT INTO contacts (name, email, phone, subject, message, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    q,
    [name, email, phone || "", subject, message],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          ok: false,
          message: "Database error",
        });
      }

      res.json({
        ok: true,
        messageId: result.insertId,
      });
    }
  );
});


// GET /users?email=...&phone=...
app.get("/users", (req, res) => {
  const { email, phone } = req.query;

  if (!email && !phone) {
    return res.status(400).json({ ok: false, message: "Email or phone required" });
  }

  let query = "SELECT * FROM users WHERE ";
  const params = [];

  if (email && phone) {
    query += "email = ? AND phone = ?";
    params.push(email, phone);
  } else if (email) {
    query += "email = ?";
    params.push(email);
  } else {
    query += "phone = ?";
    params.push(phone);
  }

  db.query(query, params, (err, data) => {
    if (err) return res.status(500).json({ ok: false, message: "DB error", error: err });
    res.json(data); // returns array, empty if user not found
  });
});


// POST new user
app.post("/users", (req, res) => {
  const { full_name, phone, email } = req.body;
  if (!full_name || !phone || !email) return res.status(400).json({ ok: false, message: "Missing fields" });

  const q = "INSERT INTO users(full_name, phone, email, created_at) VALUES (?, ?, ?, NOW())";
  db.query(q, [full_name, phone, email], (err, result) => {
    if (err) return res.status(500).json({ ok: false, error: err });
    res.json({ ok: true, userId: result.insertId });
  });
});
// UPDATE booking
app.put("/bookings/:id", (req, res) => {
  const bookingId = req.params.id;
  const { day, time, duration, service } = req.body;

  if (!day || !time || !duration || !service) {
    return res.status(400).json({ ok: false, message: "Missing fields" });
  }

  const q = `
    UPDATE bookings
    SET day = ?, time = ?, duration = ?, service_name = ?
    WHERE id = ?
  `;

  db.query(q, [day, time, duration, service, bookingId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});


// start server
app.listen(5000, () => {
  console.log("Connected to backend on port 5000.");
});
