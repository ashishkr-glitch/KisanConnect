import React, { useState, useMemo, useEffect } from 'react';
import './AdminCropAnalysis.css';

// initial empty state
const initialState = {
  summary: { totalCrops: 0, avgYield: 0, avgPrice: 0, activeFarms: 0 },
  timeSeries: [],
  farms: []
};

function MiniLineChart({ data, valueKey, height = 60 }) {
  if (!data || data.length === 0) return <svg className="mini-chart" viewBox="0 0 100 100" height={height}></svg>;
  const max = Math.max(...data.map(d => d[valueKey] || 0));
  const min = Math.min(...data.map(d => d[valueKey] || 0));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = ((max - (d[valueKey] || 0)) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="mini-chart" viewBox="0 0 100 100" preserveAspectRatio="none" height={height}>
      <polyline points={points} fill="none" stroke="#1976d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminCropAnalysis() {
  const [filters, setFilters] = useState({ crop: 'Wheat', region: 'All', range: '6m' });
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/analysis/summary')
      .then(r => r.json())
      .then(json => {
        if (!mounted) return;
        setData({
          summary: {
            totalCrops: json.totalCrops || 0,
            avgYield: json.avgYield || 0,
            avgPrice: json.avgPrice || 0,
            activeFarms: json.activeFarms || 0
          },
          timeSeries: json.timeSeries || [],
          farms: json.farms || []
        });
      })
      .catch(err => console.error('Failed to load analysis summary', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, [filters.crop, filters.region, filters.range]);

  // backend already returns farms sorted by soldQuantity desc; use it directly
  const topFarms = data.farms || [];
  const bottomFarms = (data.farms || []).slice().reverse().slice(0,3);

  if (loading) return <div className="admin-crop-analysis">Loading analysis...</div>;

  return (
    <div className="admin-crop-analysis">
      <header className="analysis-header">
        <h2>Crop Analysis</h2>
        <div className="filter-row">
          <select value={filters.crop} onChange={e => setFilters(f => ({...f, crop: e.target.value}))}>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Maize</option>
            <option>Mustard</option>
          </select>
          <select value={filters.region} onChange={e => setFilters(f => ({...f, region: e.target.value}))}>
            <option>All</option>
            <option>Ghazipur</option>
            <option>Varanasi</option>
          </select>
          <select value={filters.range} onChange={e => setFilters(f => ({...f, range: e.target.value}))}>
            <option value="6m">6 months</option>
            <option value="12m">12 months</option>
            <option value="season">This season</option>
          </select>
        </div>
      </header>

      <section className="kpi-grid">
        <div className="kpi">
          <div className="kpi-value">{data.summary.totalCrops}</div>
          <div className="kpi-label">Total Crop Records</div>
        </div>
        <div className="kpi">
          <div className="kpi-value">{data.summary.avgQuantityPerCrop} units</div>
          <div className="kpi-label">Avg Quantity / Record</div>
        </div>
        <div className="kpi">
          <div className="kpi-value">{new Intl.NumberFormat('en-IN').format(data.summary.totalSoldQuantity || 0)} kg</div>
          <div className="kpi-label">Total Sold Quantity</div>
        </div>
        <div className="kpi">
          <div className="kpi-value">{new Intl.NumberFormat('en-IN').format(data.summary.totalAvailableQuantity || 0)} kg</div>
          <div className="kpi-label">Total Available</div>
        </div>
      </section>

      <section className="analysis-panels">
        <div className="panel time-series">
          <h4>Yield & Price Trend</h4>
          <div className="trend-row">
                <div className="trend-chart">
                  <MiniLineChart data={data.timeSeries.map(ts => ({ period: ts.period, value: ts.soldQuantity }))} valueKey="value" />
                </div>
                <div className="trend-meta">
                  <div>Latest Sold: <strong>{new Intl.NumberFormat('en-IN').format((data.timeSeries[data.timeSeries.length-1]||{}).soldQuantity || 0)} kg</strong></div>
                  <div>Available: <strong>{new Intl.NumberFormat('en-IN').format(data.summary.totalAvailableQuantity || 0)} kg</strong></div>
                  <div className="metric-row"><span className="metric-label">Sold / Available</span>
                    <div style={{flex:1}}>
                      <div className="progress"><div className="fill" style={{width: `${Math.min(100, Math.round(((data.summary.totalSoldQuantity||0)/(data.summary.totalAvailableQuantity||1))*100))}%`}}/></div>
                    </div>
                  </div>
                </div>
          </div>
        </div>

        <div className="panel lists">
          <h4>Performance</h4>
          <div className="lists-row">
            <div>
              <h5>Top Farms (by sold)</h5>
              <ol>
                {topFarms.map(f => <li key={f.id}>{f.name} — {new Intl.NumberFormat('en-IN').format(f.soldQuantity || 0)} kg</li>)}
              </ol>
            </div>
            <div>
              <h5>Lowest Farms</h5>
              <ol>
                {bottomFarms.map(f => <li key={f.id}>{f.name} — {new Intl.NumberFormat('en-IN').format(f.soldQuantity || 0)} kg</li>)}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="panel table-panel">
        <h4>Farm Details</h4>
        <table className="farm-table">
          <thead>
            <tr><th>Farmer</th><th>District</th><th>Sold (kg)</th></tr>
          </thead>
          <tbody>
            {(data.farms||[]).map(f => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.district}</td>
                <td>{new Intl.NumberFormat('en-IN').format(f.soldQuantity || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
