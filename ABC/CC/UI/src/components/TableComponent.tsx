/* istanbul ignore file */
import React from 'react';
import { Table, Form, Row, Col } from 'react-bootstrap';

interface TableComponentProps {
  getTableProps: () => any;
  headerGroups: any[];
  getTableBodyProps: () => any;
  rows: any[];
  prepareRow: (row: any) => void;
  handleRowClick: (row: any) => void;
  currentPage: number;
  rowsPerPage: number;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleChangePage: (newPage: number) => void;
  totalPages: number;
}

const TableComponent: React.FC<TableComponentProps> = ({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
  handleRowClick,
  currentPage,
  rowsPerPage,
  handleRowsPerPageChange,
  handleChangePage,
  totalPages
}) => {
  return (
    <>
      <Table {...getTableProps()} border={1}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} style={{ border: '1px solid #e0e0e0', width: column.width }}>
                  <Form.Label style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
                    {column.render('Header')}
                  </Form.Label>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.slice((currentPage - 1) * rowsPerPage, ((currentPage - 1) + 1) * rowsPerPage).map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} style={{ border: '1px solid #e0e0e0', cursor: 'pointer', fontWeight: 'small !important' }}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
        <Col>
          <Form.Label>Rows Per Page: </Form.Label>
          <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ fontSize: "13px", borderRadius: "5px", border: "1px solid#ccc" }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>

          <button
            className={'btn btn-dark'}
            onClick={() => handleChangePage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "5px 10px",
              margin: "0 5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: currentPage === 1 ? "not-allowed" : "pointer"
            }}
          >
            <Form.Label>Previous</Form.Label>
          </button>
          <Form.Label>Page {currentPage} of {totalPages}</Form.Label>
          <button
            className={'btn btn-dark'}
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "5px 10px",
              margin: "0 5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer"
            }}
          >
            <Form.Label>Next</Form.Label>
          </button>
        </Col>
      </Row>
    </>
  );
};

export default TableComponent;
