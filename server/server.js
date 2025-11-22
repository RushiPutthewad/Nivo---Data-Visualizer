const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Routes
app.get('/api/test', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

app.post('/api/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  const csvPath = req.file.path;
  const pythonScriptPath = path.join(__dirname, '..', 'python-scripts', 'analyze_csv.py');

  // Spawn Python process
  const pythonProcess = spawn('python', [pythonScriptPath, csvPath]);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    // Clean up uploaded file
    fs.unlink(csvPath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    if (code !== 0) {
      console.error('Python script error:', errorString);
      return res.status(500).json({ error: 'Failed to analyze CSV file' });
    }

    try {
      const result = JSON.parse(dataString);
      if (result.error) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(500).json({ error: 'Invalid response from analysis script' });
    }
  });
});

// Generate chart data endpoint
app.post('/api/chart-data', upload.single('csvFile'), (req, res) => {
  const { chartType, xColumn, yColumn, aggregation } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'CSV file required for chart data generation' });
  }

  const csvPath = req.file.path;
  const pythonScriptPath = path.join(__dirname, '..', 'python-scripts', 'generate_chart_data.py');

  const pythonProcess = spawn('python', [pythonScriptPath, csvPath, chartType, xColumn, yColumn, aggregation]);

  let dataString = '';
  let errorString = '';

  pythonProcess.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorString += data.toString();
  });

  pythonProcess.on('close', (code) => {
    fs.unlink(csvPath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    if (code !== 0) {
      console.error('Chart data generation error:', errorString);
      return res.status(500).json({ error: 'Failed to generate chart data' });
    }

    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(500).json({ error: 'Invalid response from chart data script' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});