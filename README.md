# CSV Dashboard Application

A React.js dashboard application that uses ApexCharts for visualization and Python + pandas for CSV data analysis.

## Features

- **CSV Upload**: Drag and drop CSV file upload with validation
- **Automatic Data Analysis**: Python-powered data type inference and quality metrics
- **Smart Chart Recommendations**: Automatic mapping of data types to appropriate chart types
- **Interactive Dashboard**: Overview with key metrics and sample charts
- **Data Issues Analysis**: Detailed view of missing values and data quality
- **Multiple Chart Types**: Bar, Line, Area, Pie, Scatter, and Histogram charts
- **Smooth Animations**: ApexCharts with smooth transitions and animations

## Architecture

### Backend (Node.js + Express)
- CSV file upload handling
- Python child process integration
- RESTful API endpoints

### Data Analysis (Python + pandas)
- CSV parsing and data type inference
- Data quality metrics computation
- Chart recommendation engine

### Frontend (React + ApexCharts)
- Responsive dashboard layout
- Interactive chart visualization
- Real-time data analysis results

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.7+ with pandas
- npm or yarn

### Setup

1. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Python Dependencies**
   ```bash
   pip install pandas numpy
   ```

## Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server runs on http://localhost:5000

2. **Start the React Client**
   ```bash
   cd client
   npm start
   ```
   Client runs on http://localhost:3000

## Usage

1. **Upload CSV**: Drag and drop or select a CSV file
2. **View Dashboard**: See overview statistics and sample charts
3. **Check Data Issues**: Review missing values and data quality
4. **Explore Charts**: Navigate through different chart types based on your data

## Chart Type Mapping

The system automatically recommends charts based on intelligent column analysis:

### Primary Mappings
- **Bar Charts**: Categorical/Boolean × Numeric (max 20 categories)
- **Line Charts**: DateTime × Numeric (time series trends)
- **Area Charts**: DateTime × Numeric (filled trend visualization)
- **Pie Charts**: Categorical/Boolean (2-12 unique values only)
- **Scatter Plots**: Numeric × Numeric (correlation analysis)
- **Histograms**: Single Numeric (distribution patterns)

### Exclusion Rules
- **Text Columns**: Automatically excluded from all chart recommendations
- **High Cardinality**: Categories >20 excluded from bar/pie charts
- **Invalid Combinations**: No charts generated for incompatible data types

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── ...
├── server/                # Node.js backend
│   ├── server.js          # Express server
│   └── uploads/           # Temporary file storage
├── python-scripts/        # Data analysis scripts
│   └── analyze_csv.py     # Main analysis script
└── README.md
```

## API Endpoints

- `POST /api/upload` - Upload and analyze CSV file
- `POST /api/chart-data` - Generate chart data (future enhancement)

## Data Quality Metrics

- Null/missing value counts and percentages
- Basic statistics for numeric columns
- Unique value counts for categorical columns
- Data type inference and validation

## Intelligent Data Type Inference

The system uses sophisticated algorithms to automatically detect column data types:

### Detection Hierarchy
1. **Numeric**: `pd.api.types.is_numeric_dtype()` - integers, floats
2. **DateTime**: `pd.api.types.is_datetime64_any_dtype()` or `pd.to_datetime()` conversion
3. **Boolean**: Native boolean or object columns with boolean-like patterns
4. **Categorical**: Object columns with ≤50% unique values
5. **Text**: Object columns with >50% unique values (excluded from charts)

### Boolean Pattern Recognition
For object columns, detects boolean patterns:
- **Accepted Values**: `true/false`, `yes/no`, `1/0`, `t/f`, `y/n` (case-insensitive)
- **Requirement**: Exactly 2 unique values matching boolean patterns
- **Example**: `["Yes", "No", "Yes"]` → Boolean

### Categorical vs Text Classification
- **Categorical**: `unique_count ≤ total_rows × 0.5` (≤50% unique)
- **Text**: `unique_count > total_rows × 0.5` (>50% unique)
- **Example**: `["Male", "Female", "Male"]` → Categorical (67% repetition)
- **Example**: `["John", "Jane", "Bob"]` → Text (100% unique)

## Advanced Chart Recommendation Engine

### Chart Type Logic

| Chart Type | Requirements | Constraints |
|------------|--------------|-------------|
| **Bar Charts** | Categorical × Numeric | ≤20 categories |
| **Line Charts** | DateTime × Numeric | Time series data |
| **Area Charts** | DateTime × Numeric | Trend visualization |
| **Pie Charts** | Categorical only | 2-12 unique values |
| **Scatter Plots** | Numeric × Numeric | Correlation analysis |
| **Histograms** | Single Numeric | Distribution analysis |

### Smart Filtering
- **Prevents Invalid Charts**: No charts generated for incompatible column combinations
- **Category Limits**: Bar charts limited to ≤20 categories for readability
- **Pie Chart Optimization**: Only 2-12 categories to avoid cluttered visualizations
- **Statistical Relevance**: Ensures all recommendations are statistically meaningful