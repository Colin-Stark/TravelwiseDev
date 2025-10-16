    import React from 'react';
    import DataTable from 'react-data-table-component';

    function DataTableComponent(props) {
        const customStyles = {
            table: {
                style: {
                    borderTop: '1px solid #303844',
                    borderLeft: '1px solid #303844',
                    borderRight: '1px solid #303844',
                    borderRadius: '4px',
                },
            },
            headCells: {
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: props.theme === "light" ? '#333' : '#ffffff',
                    backgroundColor:  props.theme === "light" ? '#fff' : '#20262E',
                },
            },
            rows: {
                style: {
                    fontSize: '14px',
                    color: props.theme === "light" ? '#333' : '#ffffff',
                    backgroundColor:  props.theme === "light" ? '#fff' : '#121417',
                    borderTop: '1px solid #AAADB1',
                    cursor: 'pointer',
                    minHeight: props.minHeight,
                },
                highlightOnHoverStyle: {
                    backgroundColor: props.theme === "light" ? '#ECECEC' : '#2B3853',
                    color: props.theme === "light" ? '#333' : '#f8f8f8',
                    transition: 'background-color 0.2s ease-in-out',
                },
            },
            pagination: {
                style: {
                    backgroundColor:  props.theme === "light" ? '#fff' : '#20262E',
                    color: props.theme === "light" ? '#333' : '#ffffff',
                    borderBottom: '1px solid #303844',
                    borderLeft: '1px solid #303844',
                    borderRight: '1px solid #303844',
                    borderTop: '1px solid #AAADB1',
                    borderRadius: '4px',
                },
                pageButtonsStyle: {
                    borderRadius: '50%',
                    height: '40px',
                    width: '40px',
                    padding: '8px',
                    margin: '4px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    color: props.theme === "light" ? '#333' : '#ffffff',
                    fill: props.theme === "light" ? '#333' : '#ffffff',
                    '&:hover:not(:disabled)': {
                        backgroundColor: props.theme === "light" ? '#ECECEC' : '#323539',
                    },
                    '&:focus': {
                        backgroundColor: props.theme === "light" ? '#E0E0E0' : '#303038',
                    },
                    '&:disabled': {
                        fill: '#a0a0a0',
                    },
                },
            },
        };

        return <DataTable 
            columns={props.columns} 
            data={props.data} 
            pagination
            highlightOnHover
            responsive
            customStyles={customStyles}
            onRowClicked={props.onRowClicked} />;
    }

    export default DataTableComponent;