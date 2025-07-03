import React, { useEffect, useMemo } from "react";
import ErrorBoundary from "../../../common/ErrorBoundary";
import { useWarehouseData, useWarehouseFilters, useWarehouseCalculations } from "../hooks/useWarehouseData";
import PageHeader from "../Components/PageHeader";
import FilterControls from "../Components/FilterControls";
import SummaryCards from "../Components/SummaryCards";
import ChartSection from "../Components/ChartSection";
import DataTable from "../Components/DataTable";
import dayjs from "dayjs";

export default function BaoCaoKhoHang_Main() {
  // Custom hooks for data and state management
  const warehouseData = useWarehouseData();
  const filters = useWarehouseFilters();
  const calculations = useWarehouseCalculations(warehouseData, filters);

  // Dữ liệu đã được filter theo ngày tháng & kho hàng trong hook useWarehouseCalculations
  // Không cần filter lại ở ngoài nữa
  const filteredCalculations = calculations;

  // Suppress ResizeObserver error
  useEffect(() => {
    const handleResizeObserverError = (e) => {
      if (e.message && e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        e.preventDefault();
        e.stopPropagation();
        console.log('ResizeObserver error suppressed');
      }
    };
    
    window.addEventListener('error', handleResizeObserverError);
    
    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  const handleRefresh = () => {
    filters.resetFilters();
  };

  return (
    <ErrorBoundary>
      <div style={{padding: 24, backgroundColor: '#f5f5f5', minHeight: '100vh'}}>
        
        <PageHeader />
        
        <FilterControls
          warehouses={warehouseData.warehouses}
          products={warehouseData.products}
          selectedWarehouse={filters.selectedWarehouse}
          setSelectedWarehouse={filters.setSelectedWarehouse}
          dateRange={filters.dateRange}
          setDateRange={filters.setDateRange}
          selectedProduct={filters.selectedProduct}
          setSelectedProduct={filters.setSelectedProduct}
          onRefresh={handleRefresh}
        />
        
        <SummaryCards bangNhapXuatTon={filteredCalculations.bangNhapXuatTon} />
        
        <ChartSection 
          tongHopTheoThang={filteredCalculations.tongHopTheoThang}
          pieData={filteredCalculations.pieData}
          bangNhapXuatTon={filteredCalculations.bangNhapXuatTon}
        />
        
        <DataTable 
          bangNhapXuatTon={filteredCalculations.bangNhapXuatTon}
          loading={warehouseData.loading}
        />
        
      </div>
    </ErrorBoundary>
  );
}