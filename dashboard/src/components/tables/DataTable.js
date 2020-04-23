import React from 'react'
import { TableLayout } from './TableLayout';

export const DataTable = ({ data }) => (

    <TableLayout
        TableHeaders={() =>
            <React.Fragment>
                <th>Date</th>
                <th>Temperature</th>
            </React.Fragment>
        }


        TableBodyContent={() => data.map((item, index) =>
            (
                <tr key={index} >
                    <td>{item.date}</td>
                    <td>{item.temperature }</td>
                </tr>
            ))}

    />

)