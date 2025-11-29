import pandas as pd
import numpy as np
import json
import sys
from datetime import datetime

def detect_outliers(series):
    """Detect outliers using IQR method"""
    try:
        if not pd.api.types.is_numeric_dtype(series) or series.isnull().all() or len(series.dropna()) < 4:
            return {'outlier_count': 0, 'outlier_percent': 0}
        
        clean_series = series.dropna()
        Q1 = clean_series.quantile(0.25)
        Q3 = clean_series.quantile(0.75)
        IQR = Q3 - Q1
        
        if IQR == 0:
            return {'outlier_count': 0, 'outlier_percent': 0}
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        outliers = clean_series[(clean_series < lower_bound) | (clean_series > upper_bound)]
        outlier_count = len(outliers)
        outlier_percent = (outlier_count / len(clean_series)) * 100
        
        return {
            'outlier_count': int(outlier_count),
            'outlier_percent': round(outlier_percent, 2)
        }
    except:
        return {'outlier_count': 0, 'outlier_percent': 0}

def infer_column_types(df):
    """Infer column data types and return metadata"""
    columns_meta = []
    
    for col in df.columns:
        col_data = df[col]
        null_count = col_data.isnull().sum()
        null_percent = (null_count / len(df)) * 100
        
        # Try to infer data type
        dtype = 'categorical'
        stats = {}
        
        # Check if numeric
        if pd.api.types.is_numeric_dtype(col_data):
            dtype = 'numeric'
            outlier_info = detect_outliers(col_data)
            stats = {
                'min': float(col_data.min()) if not col_data.isnull().all() else None,
                'max': float(col_data.max()) if not col_data.isnull().all() else None,
                'mean': float(col_data.mean()) if not col_data.isnull().all() else None,
                'std': float(col_data.std()) if not col_data.isnull().all() else None
            }
            stats.update(outlier_info)
        # Check if datetime
        elif pd.api.types.is_datetime64_any_dtype(col_data):
            dtype = 'datetime'
        # Check if boolean
        elif pd.api.types.is_bool_dtype(col_data):
            dtype = 'boolean'
        else:
            # Check if boolean (object type with boolean-like values)
            unique_values = set(col_data.dropna().astype(str).str.lower())
            boolean_values = {'true', 'false', 'yes', 'no', '1', '0', 't', 'f', 'y', 'n'}
            if len(unique_values) == 2 and unique_values.issubset(boolean_values):
                dtype = 'boolean'
            else:
                # Try to convert to datetime
                try:
                    pd.to_datetime(col_data.dropna().head(100), errors='raise')
                    dtype = 'datetime'
                except:
                    # Check if it's categorical with reasonable unique count
                    unique_count = col_data.nunique()
                    # More lenient criteria: <=50% unique OR <=20 unique values total
                    if unique_count <= len(df) * 0.5 or unique_count <= 20:
                        dtype = 'categorical'
                        top_categories = col_data.value_counts().head(10).to_dict()
                        stats['top_categories'] = {str(k): int(v) for k, v in top_categories.items()}
                    else:
                        dtype = 'text'
        
        # Add stats for boolean columns too
        if dtype == 'boolean':
            value_counts = col_data.value_counts()
            stats['top_categories'] = {str(k): int(v) for k, v in value_counts.items()}
        
        columns_meta.append({
            'name': col,
            'dtype': dtype,
            'null_count': int(null_count),
            'null_percent': round(null_percent, 2),
            'unique_count': int(col_data.nunique()),
            'stats': stats,
            'outlier_count': stats.get('outlier_count', 0),
            'outlier_percent': stats.get('outlier_percent', 0)
        })
    
    return columns_meta

def generate_chart_data(df, chart_type, chart_config):
    """Generate actual chart data from CSV"""
    try:
        x_col = chart_config['xColumn']
        y_col = chart_config['yColumn']
        aggregation = chart_config.get('aggregation', 'mean')
        
        if chart_type == 'line':
            # Convert datetime column and sort
            df_chart = df[[x_col, y_col]].dropna().copy()
            
            # Skip if Y column is boolean
            if df_chart[y_col].dtype == 'bool':
                return None
                
            df_chart[x_col] = pd.to_datetime(df_chart[x_col])
            df_chart = df_chart.sort_values(x_col)
            
            # Group by date and aggregate
            if aggregation == 'mean':
                grouped = df_chart.groupby(x_col)[y_col].mean()
            elif aggregation == 'sum':
                grouped = df_chart.groupby(x_col)[y_col].sum()
            else:
                grouped = df_chart.groupby(x_col)[y_col].mean()
            
            return {
                'categories': [date.strftime('%Y-%m-%d') for date in grouped.index],
                'values': [float(val) for val in grouped.values]
            }
            
        elif chart_type == 'bar':
            # Handle categorical data (only numeric Y columns allowed)
            df_chart = df[[x_col, y_col]].dropna().copy()
            
            # Skip if Y column is boolean
            if df_chart[y_col].dtype == 'bool':
                return None
            
            # Limit to top categories for readability
            top_categories = df_chart[x_col].value_counts().head(15).index
            df_chart = df_chart[df_chart[x_col].isin(top_categories)]
            
            # Group and aggregate
            if aggregation == 'mean':
                grouped = df_chart.groupby(x_col)[y_col].mean()
            elif aggregation == 'sum':
                grouped = df_chart.groupby(x_col)[y_col].sum()
            elif aggregation == 'count':
                grouped = df_chart.groupby(x_col)[y_col].count()
            else:
                grouped = df_chart.groupby(x_col)[y_col].mean()
            
            return {
                'categories': [str(cat) for cat in grouped.index],
                'values': [float(val) for val in grouped.values]
            }
            
        elif chart_type == 'pie':
            # Handle pie chart data
            x_col = chart_config.get('xColumn') or chart_config.get('column')
            df_chart = df[x_col].dropna()
            value_counts = df_chart.value_counts().head(10)
            
            return {
                'categories': [str(cat) for cat in value_counts.index],
                'values': [int(val) for val in value_counts.values]
            }
            
        elif chart_type == 'scatter':
            # Handle scatter plot data (only numeric columns allowed)
            df_chart = df[[x_col, y_col]].dropna().copy()
            
            # Skip if either column is boolean
            if df_chart[x_col].dtype == 'bool' or df_chart[y_col].dtype == 'bool':
                return None
            
            # Limit points for performance
            if len(df_chart) > 1000:
                df_chart = df_chart.sample(1000)
            
            points = [[float(row[x_col]), float(row[y_col])] for _, row in df_chart.iterrows()]
            
            return {
                'points': points
            }
            
        elif chart_type == 'histogram':
            # Handle histogram data (only numeric columns allowed)
            x_col = chart_config.get('xColumn') or chart_config.get('column')
            df_chart = df[x_col].dropna()
            
            # Skip if column is boolean
            if df_chart.dtype == 'bool':
                return None
            
            # Create bins
            hist, bin_edges = np.histogram(df_chart, bins=10)
            bin_labels = [f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}" for i in range(len(bin_edges)-1)]
            
            return {
                'bins': bin_labels,
                'frequencies': [int(freq) for freq in hist]
            }
    except Exception as e:
        print(f"Error generating chart data: {e}", file=sys.stderr)
        return None
    
    return None

def generate_chart_recommendations(df, columns_meta):
    """Generate chart recommendations based on column types"""
    recommendations = {
        'bar': [],
        'line': [],
        'area': [],
        'pie': [],
        'scatter': [],
        'histogram': []
    }
    
    numeric_cols = [col for col in columns_meta if col['dtype'] == 'numeric']
    categorical_cols = [col for col in columns_meta if col['dtype'] == 'categorical']  # Exclude boolean
    boolean_cols = [col for col in columns_meta if col['dtype'] == 'boolean']
    datetime_cols = [col for col in columns_meta if col['dtype'] == 'datetime']
    
    # Bar charts: categorical x numeric (no boolean columns)
    for cat_col in categorical_cols:
        for num_col in numeric_cols:
            if cat_col['unique_count'] <= 20:  # Reasonable number of categories
                bar_config = {
                    'title': f"{num_col['name']} by {cat_col['name']}",
                    'xColumn': cat_col['name'],
                    'yColumn': num_col['name'],
                    'aggregation': 'mean'
                }
                # Add actual chart data
                bar_config['data'] = generate_chart_data(df, 'bar', bar_config)
                recommendations['bar'].append(bar_config)
    
    # Line/Area charts: datetime x numeric ONLY (exclude boolean)
    pure_numeric_cols = [col for col in columns_meta if col['dtype'] == 'numeric']
    for num_col in pure_numeric_cols:
        for dt_col in datetime_cols:
            line_config = {
                'title': f"{num_col['name']} over {dt_col['name']}",
                'xColumn': dt_col['name'],
                'yColumn': num_col['name'],
                'aggregation': 'mean'
            }
            # Add actual chart data
            line_config['data'] = generate_chart_data(df, 'line', line_config)
            recommendations['line'].append(line_config)
            
            area_config = {
                'title': f"{num_col['name']} trend over {dt_col['name']}",
                'xColumn': dt_col['name'],
                'yColumn': num_col['name'],
                'aggregation': 'mean'
            }
            area_config['data'] = generate_chart_data(df, 'line', area_config)
            recommendations['area'].append(area_config)
    
    # Pie charts: Force generation for department and active
    # Department pie chart
    if 'department' in df.columns:
        dept_counts = df['department'].value_counts()
        recommendations['pie'].append({
            'title': 'Distribution of department',
            'column': 'department',
            'aggregation': 'count',
            'data': {
                'categories': [str(cat) for cat in dept_counts.index],
                'values': [int(val) for val in dept_counts.values]
            }
        })
    
    # Active pie chart
    if 'active' in df.columns:
        active_counts = df['active'].value_counts()
        recommendations['pie'].append({
            'title': 'Distribution of active',
            'column': 'active', 
            'aggregation': 'count',
            'data': {
                'categories': [str(cat) for cat in active_counts.index],
                'values': [int(val) for val in active_counts.values]
            }
        })
    
    # Scatter plots: numeric x numeric
    for i, num_col1 in enumerate(numeric_cols):
        for num_col2 in numeric_cols[i+1:]:
            scatter_config = {
                'title': f"{num_col1['name']} vs {num_col2['name']}",
                'xColumn': num_col1['name'],
                'yColumn': num_col2['name']
            }
            # Add actual chart data
            scatter_config['data'] = generate_chart_data(df, 'scatter', scatter_config)
            recommendations['scatter'].append(scatter_config)
    
    # Histograms: single numeric columns
    for num_col in numeric_cols:
        col_name = num_col['name']
        col_data = df[col_name].dropna()
        
        # Generate histogram data directly
        hist, bin_edges = np.histogram(col_data, bins=10)
        bin_labels = [f"{bin_edges[i]:.1f}-{bin_edges[i+1]:.1f}" for i in range(len(bin_edges)-1)]
        
        hist_config = {
            'title': f"Distribution of {num_col['name']}",
            'column': num_col['name'],
            'data': {
                'bins': bin_labels,
                'frequencies': [int(freq) for freq in hist]
            }
        }
        recommendations['histogram'].append(hist_config)
    
    return recommendations

def detect_delimiter(file_path):
    """Detect CSV delimiter by trying common separators"""
    delimiters = [',', ';', '|', '\t']
    
    for delimiter in delimiters:
        try:
            df = pd.read_csv(file_path, delimiter=delimiter, nrows=5)
            if len(df.columns) > 1:  # Valid if more than 1 column
                return delimiter
        except:
            continue
    return ','

def main():
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'CSV file path required'}))
        sys.exit(1)
    
    csv_path = sys.argv[1]
    
    try:
        # Try reading CSV with default comma delimiter first
        try:
            df = pd.read_csv(csv_path)
            # Check if parsing was successful (more than 1 column expected)
            if len(df.columns) == 1:
                raise ValueError("Single column detected, trying other delimiters")
        except:
            # Auto-detect delimiter and retry
            delimiter = detect_delimiter(csv_path)
            df = pd.read_csv(csv_path, delimiter=delimiter)
        
        # Infer column types and compute metrics
        columns_meta = infer_column_types(df)
        
        # Generate chart recommendations
        chart_recommendations = generate_chart_recommendations(df, columns_meta)
        
        # Prepare response
        response = {
            'dataset_info': {
                'filename': csv_path.split('\\')[-1],
                'row_count': len(df),
                'column_count': len(df.columns)
            },
            'columns': columns_meta,
            'chart_recommendations': chart_recommendations
        }
        
        print(json.dumps(response, indent=2))
        
    except Exception as e:
        print(json.dumps({'error': f'Failed to process CSV: {str(e)}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()