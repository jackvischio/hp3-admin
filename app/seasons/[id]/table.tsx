"use client"

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

import { AgGridReact } from "ag-grid-react";
import '@/app/supp/TableCss.css';
import '@/app/supp/TableConfig';

const CampionatiTable = ({ campionati } : { campionati: any[]}) => {
    const router = useRouter();

    const [columnDefs] = useState([
        { headerName: 'ID', field: 'id', sortable: true, width: 80 },
        { headerName: 'FISR', field: 'idFisr', sortable: true, filter: true, width: 100 },
        { headerName: 'Nome fisr', field: 'nfisr', sortable: true, filter: true, width: 300 },
        { headerName: 'Nome', field: 'nome', sortable: true, filter: true, width: 250 },
        { headerName: 'Lega', field: 'lega', sortable: true, filter: true, width: 90 },
        { headerName: 'Tipo', field: 'tipo', sortable: true, filter: true, width: 90 },
        {
            headerName: '',
            field: 'actions',
            cellRenderer: (params: any) => (
                <>
                    <button className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => router.push(`/edit-camp/${params.data.id}`)}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    {params.data.idFisr != 9999 && <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => alert("scrape calendar " + params.data.id)}>
                        <i className="bi bi-robot"></i>
                    </button>}
                </>
            ),
            filter: false,
            sortable: false,
            width: 150,
          },
    ]);

    const goEdit = (event: any) => {
        console.log("Edit", event);
    }
  
    return (
        <div className="ag-theme-my-custom" style={{ height: 700, width: '100%' }}>
            <AgGridReact rowData={campionati} columnDefs={columnDefs} rowModelType="clientSide" />
        </div>
    );
};

export default CampionatiTable;