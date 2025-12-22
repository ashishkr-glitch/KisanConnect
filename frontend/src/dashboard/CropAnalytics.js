import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CropAnalytics.css";
import Loader from "../components/Loader";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Crop Analytics (enhanced) — fetches backend analysis summary and shows KPIs + charts + top farms
function CropAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/analysis/summary')
      .then(r => {
        if (!r.ok) throw new Error('Network response was not ok');
        return r.json();
      })
      .then(json => { if (mounted) setData(json); })
      .catch(e => { console.error(e); if (mounted) setError('Failed to load analytics'); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;
  if (!data) return <p>No analytics data available.</p>;

  // Build datasets
  const timeLabels = (data.timeSeries || []).map(t => t.period);
  const timeValues = (data.timeSeries || []).map(t => t.soldQuantity || 0);

  const barData = {
    labels: timeLabels,
    datasets: [
      { label: 'Sold (kg)', data: timeValues, backgroundColor: '#2ecc71' }
    ]
  };

  // Pie: distribution by district using farms list as approximation
  const districtCounts = {};
  (data.farms || []).forEach(f => { const d = f.district || 'Unknown'; districtCounts[d] = (districtCounts[d]||0) + (f.soldQuantity||0); });
  const pieLabels = Object.keys(districtCounts);
  const pieValues = pieLabels.map(k => districtCounts[k]);
  const pieData = { labels: pieLabels, datasets: [{ data: pieValues, backgroundColor: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c", "#9b59b6"] }] };

  const totalSold = data.totalSoldQuantity || 0;
  const totalAvailable = data.totalAvailableQuantity || 1; // avoid div0
  const soldPercent = Math.round((totalSold / totalAvailable) * 100);

  return (
    <div className="crop-analytics">
      <h2>Crop Analytics</h2>
      <div style={{marginBottom:12}}>
        <Link to="/dashboard/analytics/advanced" className="btn secondary">Advanced Analysis</Link>
      </div>

      <div className="kpi-row" style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <div className="kpi-box"><div className="kpi-value">{data.totalCrops}</div><div className="kpi-label">Crop Records</div></div>
        <div className="kpi-box"><div className="kpi-value">{data.avgQuantityPerCrop}</div><div className="kpi-label">Avg Qty / Record</div></div>
        <div className="kpi-box"><div className="kpi-value">{new Intl.NumberFormat('en-IN').format(totalSold)} kg</div><div className="kpi-label">Total Sold</div></div>
        <div className="kpi-box"><div className="kpi-value">{new Intl.NumberFormat('en-IN').format(totalAvailable)} kg</div><div className="kpi-label">Total Available</div></div>
      </div>

      <div style={{marginTop:10, marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{minWidth:120,color:'var(--text-color)'}}>Sold / Available</div>
          <div style={{flex:1}} className="progress"><div className="fill" style={{width: Math.min(100, Math.max(0, soldPercent)) + '%'}}/></div>
          <div style={{minWidth:60,textAlign:'right',color:'var(--text-color)'}}>{isNaN(soldPercent) ? '—' : soldPercent + '%'}</div>
        </div>
      </div>

      <div className="charts" style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <div className="chart-box" style={{flex:'1 1 420px'}}>
          <h4>Sold / Month (last periods)</h4>
          <Bar data={barData} />
        </div>

        <div className="chart-box" style={{width:320}}>
          <h4>District Share (by sold)</h4>
          <Pie data={pieData} />
        </div>
      </div>

      <div style={{marginTop:14}}>
        <h4>Top Farms (by sold)</h4>
        <table className="farm-table" style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr><th>Farmer</th><th>District</th><th style={{textAlign:'right'}}>Sold (kg)</th></tr></thead>
          <tbody>
            {(data.farms||[]).map(f => (
              <tr key={f.id} style={{borderBottom:'1px solid var(--border-color)'}}>
                <td>{f.name}</td>
                <td>{f.district}</td>
                <td style={{textAlign:'right'}}>{new Intl.NumberFormat('en-IN').format(f.soldQuantity||0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CropAnalytics;