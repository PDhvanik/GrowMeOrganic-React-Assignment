import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Paginator } from 'primereact/paginator';

import { InputSwitch } from 'primereact/inputswitch';


interface TableData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface PaginationDetails{
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  next_url: string;
}

function App() {
  const [products, setProducts] = useState<TableData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<TableData[]>([]);
  const [PaginationDetails, setPaginationDetails] = useState<PaginationDetails>({
    total: 0,
    limit: 12,
    offset: 0,
    current_page: 1,
    total_pages: 0,
    next_url: ''
  });
  const [rowClick, setRowClick] = useState(true);

  const onPageChange = (e: any) => {
    const pageValue = Math.ceil(e.first / e.rows) + 1;
    if(page=== pageValue) return;
    setPage(pageValue);
    setLoading(true);
  }

  const getCurrentPageSelection = () => {
    return products.filter(product =>
      selectedProducts.some(selected => selected.id === product.id)
    );
  };

  const handleSelectionChange = (e: any) => {
    const newSelection: TableData[] = e.value;
    const currentPageIds = products.map(p => p.id);

    const otherSelections = selectedProducts.filter(
      sel => !currentPageIds.includes(sel.id)
    );
    
    setSelectedProducts([...otherSelections, ...newSelection]);
  };

  useEffect(() => {
    fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setPaginationDetails(data.pagination);
        const formattedData = data.data.map((item: any, index: number) => ({
          id: (page - 1) * 12 + index + 1,
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }
        ));
        for (const item of formattedData) {
          console.log(item.id);
        }
        setProducts(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    )
  }, [page]);

  if(loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="card">
      <DataTable value={products} selectionMode={'checkbox'} selection={getCurrentPageSelection()} onSelectionChange={handleSelectionChange} dataKey="id" tableStyle={{ minWidth: '50rem', marginBottom: '2rem' }}
      scrollable={true} scrollHeight="80vh"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place Of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>
      <Paginator first={(page - 1) * 12} rows={PaginationDetails.limit} totalRecords={PaginationDetails.total} onPageChange={onPageChange} template={{ layout: 'PrevPageLink PageLinks NextPageLink CurrentPageReport' }}/>
    </div>
  );
}

export default App
