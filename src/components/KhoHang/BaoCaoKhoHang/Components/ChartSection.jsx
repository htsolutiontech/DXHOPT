import React, { useCallback } from 'react';
import { Card, Row, Col } from 'antd';
import { 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  CartesianGrid
} from 'recharts';
import ChartWrapper from '../../../common/ChartWrapper';
import { COLORS, CHART_COLORS } from '../constants';

const ChartSection = ({ tongHopTheoThang, pieData, bangNhapXuatTon }) => {
  // Custom label cho PieChart
  const renderCustomLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }, []);

  // Custom tooltip cho charts
  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: '8px' }}>{`Tháng: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {`${entry.name}: ${entry.value?.toLocaleString("vi-VN")}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  return (
    <Row gutter={16}>
      {/* Biểu đồ nhập xuất tồn theo tháng */}
      <Col span={16}>
        <Card 
          title={<span style={{fontSize: '16px', fontWeight: 600}}>📊 Biểu đồ nhập - xuất - tồn theo tháng</span>}
          style={{marginBottom: 24}}
          bodyStyle={{padding: '20px'}}
        >
          <div style={{width:'100%', height: 400}}>
            <ChartWrapper>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart 
                  data={tongHopTheoThang} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorNhap" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.nhap} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS.nhap} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorXuat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.xuat} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS.xuat} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d9d9d9' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#d9d9d9' }}
                    tickFormatter={(value) => value.toLocaleString('vi-VN')}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{
                      fontSize: '14px',
                      paddingTop: '20px'
                    }}
                  />
                  <Bar 
                    dataKey="tong_nhap" 
                    fill="url(#colorNhap)" 
                    name="📈 Tổng nhập"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="tong_xuat" 
                    fill="url(#colorXuat)" 
                    name="📉 Tổng xuất"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ton_cuoi_ky" 
                    stroke={CHART_COLORS.ton}
                    strokeWidth={3}
                    name="📦 Tồn cuối kỳ"
                    dot={{ fill: CHART_COLORS.ton, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: CHART_COLORS.ton, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </Card>
      </Col>

      {/* Biểu đồ phân tích tồn kho */}
      <Col span={8}>
        <Card 
          title={<span style={{fontSize: '16px', fontWeight: 600}}>🥧 Phân tích tồn kho</span>}
          bodyStyle={{padding: '20px'}}
        >
          <div style={{width:'100%', height: 350, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <ChartWrapper>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={90}
                    innerRadius={40}
                    paddingAngle={2}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={COLORS[idx % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} sản phẩm`, 
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '13px',
                      paddingTop: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
            
            {/* Statistics below pie chart */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: '10px',
              fontSize: '12px',
              color: '#666'
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{color: COLORS[0], fontWeight: 600}}>
                  {bangNhapXuatTon.filter(r => r.ton_cuoi_ky >= 10).length}
                </div>
                <div>Bình thường</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{color: COLORS[1], fontWeight: 600}}>
                  {bangNhapXuatTon.filter(r => r.ton_cuoi_ky > 0 && r.ton_cuoi_ky < 10).length}
                </div>
                <div>Sắp hết</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{color: COLORS[2], fontWeight: 600}}>
                  {bangNhapXuatTon.filter(r => r.ton_cuoi_ky <= 0).length}
                </div>
                <div>Hết hàng</div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartSection;
