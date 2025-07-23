import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Paginator } from 'primereact/paginator';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';


interface TableData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface PaginationDetails {
  total: number;
  limit: number;
  offset: number;
  current_page: number;
  total_pages: number;
  next_url: string;
}

function App() {
  const [rows, setRows] = useState<TableData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [PaginationDetails, setPaginationDetails] = useState<PaginationDetails>({
    total: 0,
    limit: 12,
    offset: 0,
    current_page: 1,
    total_pages: 0,
    next_url: ''
  });
  const [selectRange, setSelectRange] = useState<string>('');
  const op = useRef<OverlayPanel>(null);

  const handleSelectionWithNumber = () => {
    
    const from = Number(selectRange.slice(0, selectRange.indexOf('-')));
    const to = Number(selectRange.slice(selectRange.indexOf('-') + 1));
    console.log(from, to);
    const numRows = to - from + 1;
    if (numRows >= 1 && numRows <= PaginationDetails.total) {
      setSelectedIds([...selectedIds, ...Array.from({ length: numRows }, (_, i) => from + i)]);
    }
  };

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    const pageValue = Math.ceil(e.first / e.rows) + 1;
    if (page === pageValue) return;
    setPage(pageValue);
    setLoading(true);
  }

  const getCurrentPageSelection = () => {
    return rows.filter(product => selectedIds.includes(product.id));
  };

  const handleSelectionChange = (e: any) => {
    const newSelection: TableData[] = e.value;
    const newIds = newSelection.map(p => p.id);
    const currentPageIds = rows.map(p => p.id);
    const otherIds = selectedIds.filter(id => !currentPageIds.includes(id));
    setSelectedIds([...otherIds, ...newIds]);
    
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
        setRows(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
      )
  }, [page]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="card">
      <DataTable value={rows} selectionMode={'checkbox'} selection={getCurrentPageSelection()} onSelectionChange={handleSelectionChange} dataKey="id" tableStyle={{ minWidth: '50rem', marginBottom: '2rem' }}
        scrollable={true} scrollHeight="80vh"
      >
        <Column selectionMode="multiple"
        ></Column>
        <Column field="id" header={
          <>
            <Button id='pi-chevron-down' type="button" icon="pi pi-chevron-down" onClick={(e) => op.current?.toggle(e)}
              tooltip="Select multiple rows"
              tooltipOptions={{ position: 'bottom' }} />
            Sr. No.
          </>
        }
          style={{ minWidth: '7rem' }}
        ></Column>
        <Column field="title"
          header='Title'
          style={{ minWidth: '10rem' }}
        ></Column>
        <Column field="place_of_origin" header="Place Of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>
      <Paginator first={(page - 1) * 12} rows={PaginationDetails.limit} totalRecords={PaginationDetails.total} onPageChange={onPageChange} template={{ layout: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport' }} />
      <OverlayPanel ref={op}>
        <InputText min={1} max={PaginationDetails.total} value={selectRange} onChange={(e) => setSelectRange(e.target.value)} placeholder='Select Rows... [from-to]' />
        <Button type="button" icon="" label='Submit' onClick={handleSelectionWithNumber}
          disabled={
            !selectRange ||
            Number(selectRange) < 1 ||
            Number(selectRange) > PaginationDetails.total
          }
        />
      </OverlayPanel>
    </div>
  );
}

export default App
