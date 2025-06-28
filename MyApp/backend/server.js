require('dotenv').config();
require('dotenv').config({ path: './mail.env' });
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fileType = require('file-type');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });


const app = express();
app.use(express.json({ limit: '10mb' })); // Increase JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase URL-encoded payload size

app.use(cors());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL Database'))
  .catch(err => console.error('❌ Database Connection Error:', err));

  pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL client error', err);
  });
  

// Signup API
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const table = 'users';
    const idField = 'user_id'; // Correct field for user ID

    const query = `INSERT INTO ${table} (username, password_hash) VALUES ($1, $2) RETURNING ${idField}, username`;
    const result = await pool.query(query, [username, hashedPassword]);

    const user = result.rows[0];

    res.json({
      message: 'User registered successfully!',
      user: { id: user[idField], username: user.username },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Database error', error });
  }
});


// Profile Setup API
app.post('/setup-profile', upload.single('profile_picture'), async (req, res) => {
  try {
    const { userId, fullName, email, dob, gender, phone } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId || !fullName || !email || !dob || !gender || !phone) {
      return res.status(400).json({ message: 'All fields except profile picture are required.' });
    }

    // Convert DOB to correct format
    const formattedDob = dob.split('/').reverse().join('-'); // Converts DD/MM/YYYY to YYYY-MM-DD

    const insertProfileQuery = `
      INSERT INTO profiles (user_id, email, full_name, date_of_birth, gender, phone_number, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const profileResult = await pool.query(insertProfileQuery, [
      userId, email, fullName, formattedDob, gender, phone, profilePicture
    ]);

    res.json({ message: 'Profile created successfully!', profile: profileResult.rows[0] });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});



const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, role: 'admin' });
  }

  try {
    // Fetch user details from the users table
    const userResult = await pool.query('SELECT user_id, password_hash FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const { user_id, password_hash } = userResult.rows[0];

    // Compare password
    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user_id exists in the profiles table
    const profileResult = await pool.query('SELECT user_id FROM profiles WHERE user_id = $1', [user_id]);

    const role = profileResult.rows.length > 0 ? 'user' : 'puser';

    return res.json({ success: true, role, user_id });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});




//const upload = multer({ storage });

// Create Maintenance Request API
app.post("/maintenance", upload.array("media", 9), async (req, res) => {
  const { user_id, subject, description, priority } = req.body;
  
  try {
      // Insert Maintenance Request
      const result = await pool.query(
          "INSERT INTO maintenance_requests (user_id, subject, description, priority) VALUES ($1, $2, $3, $4) RETURNING request_id",
          [user_id, subject, description, priority]
      );
      const request_id = result.rows[0].request_id;

      // Insert Media (if any)
      if (req.files && req.files.length > 0) {
          const mediaPromises = req.files.map((file) => {
              return pool.query(
                  "INSERT INTO request_media (request_id, media_url, media_type) VALUES ($1, $2, $3)",
                  [request_id, file.path, file.mimetype.startsWith("image") ? "Image" : "Video"]
              );
          });
          await Promise.all(mediaPromises);
      }

      res.json({ success: true, message: "Request submitted successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error!" });
  }
});




// Fetch all announcements
app.get('/announcements', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Add a new announcement
app.post('/announcements', async (req, res) => {
  const { title, description } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO announcements (title, description) VALUES ($1, $2) RETURNING *',
          [title, description]
      );
      res.json(result.rows[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Delete an announcement
app.delete('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  try {
      await pool.query('DELETE FROM announcements WHERE announcement_id = $1', [id]);
      res.json({ message: 'Deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Update an existing announcement
app.put('/announcements/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
      const result = await pool.query(
          'UPDATE announcements SET title = $1, description = $2 WHERE announcement_id = $3 RETURNING *',
          [title, description, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Announcement not found' });
      }

      res.json(result.rows[0]); // Return the updated announcement
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});




app.get("/maintenance_requests", async (req, res) => {
  try {
    // Fetch all maintenance requests
    const requests = await pool.query("SELECT * FROM maintenance_requests");

    if (requests.rows.length === 0) {
      return res.status(404).json({ message: "No maintenance requests found" });
    }

    // Fetch media for each request in parallel
    const requestsWithMedia = await Promise.all(
      requests.rows.map(async (request) => {
        const media = await pool.query(
          "SELECT * FROM request_media WHERE request_id = $1",
          [request.request_id]
        );

        // Map media URLs to full URLs and determine media type
        const mediaWithType = await Promise.all(
          media.rows.map(async (mediaItem) => {
            const filePath = path.join(__dirname, "uploads", mediaItem.media_url);

            // Try to read file and detect type
            try {
              const buffer = fs.readFileSync(filePath);
              const type = await fileType.fromBuffer(buffer); // Detect file type from buffer

              if (type) {
                if (type.mime.startsWith("image")) {
                  mediaItem.media_type = "Image";
                } else if (type.mime.startsWith("video")) {
                  mediaItem.media_type = "Video";
                } else {
                  mediaItem.media_type = "Unknown";
                }
              } else {
                mediaItem.media_type = "Unknown";
              }
            } catch (error) {
              console.error("Error reading file:", error);
              mediaItem.media_type = "Unknown"; // Default to unknown type if an error occurs
            }

            // Modify the URL for client access
            mediaItem.media_url = `http://localhost:5000/uploads/${mediaItem.media_url}`;
            return mediaItem;
          })
        );

        return { ...request, media: mediaWithType }; // Attach media to request
      })
    );

    res.json(requestsWithMedia);
  } catch (err) {
    console.error("Error fetching maintenance requests:", err.message);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
});

// Endpoint to update maintenance request status
app.put("/maintenance_requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "In Progress", "Completed", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Update request status
    const updatedRequest = await pool.query(
      "UPDATE maintenance_requests SET status = $1 WHERE request_id = $2 RETURNING *",
      [status, id]
    );

    if (updatedRequest.rows.length === 0) {
      return res.status(404).json({ error: "Request ID not found" });
    }

    res.json({ message: "Status updated successfully", data: updatedRequest.rows[0] });
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ error: "Server Error. Please try again later." });
  }
});

// Serve static files in the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));








const otpStorage = {};

// Email Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Generate Random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP API
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  try {
    const otp = generateOTP();
    otpStorage[email] = otp; // Store OTP temporarily
    
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: '🔐 Admin Authentication OTP – Secure Access Confirmation',
      text: `Dear Administrator,  

To verify your identity and access the admin panel securely, please use the following One-Time Password (OTP):  

🔑 **${otp}**  

This OTP is automatically generated for internal verification and is valid for a limited time. **Do not share or forward this code.**  

If you did not request this OTP, please investigate immediately to ensure the security of your system.  

For any security concerns, please check your system logs or reach out to your IT administrator.  

Best regards,  
CAMA    
`,
    });
    
    res.json({ success: true, otp: otp, message: 'OTP sent successfully.' });  // ✅ Modify Response
  } catch (error) {
    console.error('OTP sending error:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP', error });
  }
});


// Verify OTP API
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

  if (otpStorage[email] === otp) {
    delete otpStorage[email]; // Clear OTP after successful verification
    res.json({ message: 'OTP verified successfully. Proceed to dashboard.' });
  } else {
    res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }
});











app.get('/profiles', async (req, res) => {
  try {
      const result = await pool.query('SELECT user_id, full_name FROM profiles');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/residents', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM residents');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching residents:', error);
      res.status(500).send('Server Error');
  }
});

// Add a new resident
app.post('/residents', async (req, res) => {
  const { user_id, full_name, apartment, contact_number } = req.body;
  
  try {
      const result = await pool.query(
          'INSERT INTO residents (user_id, full_name, apartment, contact_number) VALUES ($1, $2, $3, $4) RETURNING *',
          [user_id, full_name, apartment, contact_number]
      );
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error adding resident:', error);
      res.status(500).send('Server Error');
  }
});


app.delete('/residents/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM residents WHERE user_id = $1', [id]);
        res.json({ message: 'Resident removed successfully' });
    } catch (error) {
        console.error('Error deleting resident:', error);
        res.status(500).json({ error: 'Server error' });
    }
});





// Fetch rental agreement by user ID
app.get('/rental-agreements/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM rental_agreements WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Rental agreement not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching rental agreement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch resident name by user ID
app.get('/residents/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const result = await pool.query(
      'SELECT name FROM residents WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update rental agreement by agreement ID
app.put('/rental-agreements/:agreementId', async (req, res) => {
  const { agreementId } = req.params;
  const { monthly_rent, security_deposit, notice_period } = req.body;

  // Validate input fields
  if (monthly_rent === undefined || security_deposit === undefined || notice_period === undefined) {
    return res.status(400).json({ message: 'All fields (monthly_rent, security_deposit, notice_period) are required' });
  }

  // Validate that numeric fields are valid
  if (isNaN(monthly_rent) || isNaN(security_deposit) || isNaN(notice_period)) {
    return res.status(400).json({ message: 'Invalid input: all fields must be numbers' });
  }

  try {
    const result = await pool.query(
      `UPDATE rental_agreements 
       SET monthly_rent = $1, security_deposit = $2, notice_period = $3 
       WHERE id = $4 RETURNING *`,
      [monthly_rent, security_deposit, notice_period, agreementId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Rental agreement not found" });
    }

    res.json({
      message: "Rental agreement updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating rental agreement:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get('/security-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM security_logs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching security logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.get('/maintenance-requests', async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT request_id, user_id, subject, description, status, created_at FROM maintenance_requests WHERE priority = 'High' ORDER BY created_at DESC"
      );
      
      // Log the results to debug
      console.log('Fetched Maintenance Requests:', result.rows);

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching maintenance requests:', error.message, error.stack);
      res.status(500).json({ error: 'Internal server error' });
  }
});




// Add a Family Member
app.post('/addFamilyMember', async (req, res) => {
  try {
      const { resident_id, name, age, relationship } = req.body;

      if (!resident_id || !name || !age || !relationship) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      const result = await pool.query(
          'INSERT INTO familymembers (resident_id, name, age, relationship) VALUES ($1, $2, $3, $4) RETURNING *',
          [resident_id, name, age, relationship]
      );

      res.json({ message: 'Family Member Added', member: result.rows[0] });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database Error' });
  }
});

// Get Family Members by Resident ID
app.get('/familyMembers/:resident_id', async (req, res) => {
  try {
      const { resident_id } = req.params;
      const result = await pool.query('SELECT * FROM familymembers WHERE resident_id = $1', [resident_id]);

      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database Error' });
  }
});

app.delete('/deleteFamilyMember/:member_id', async (req, res) => {
  try {
      const { member_id } = req.params;
      console.log(`Deleting member with ID: ${member_id}`);  // Log the incoming member_id

      const result = await pool.query('DELETE FROM familymembers WHERE member_id = $1', [member_id]);

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Family member not found' });
      }

      res.json({ message: 'Family Member Removed' });
  } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).json({ error: 'Database Error' });
  }
});










// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


