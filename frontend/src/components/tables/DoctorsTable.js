import React from 'react'
import { TableLayout } from './TableLayout';

export const UsersTable = ({ users, onGrantClick, onRevokeClick }) => (

    <TableLayout
        TableHeaders={() =>
            <React.Fragment>
                <th>Public Key</th>
                <th>Address</th>
                <th>Access</th>
            </React.Fragment>
        }


        TableBodyContent={() => Object.keys(users).map((pubKey, index) =>
            (
                <tr key={index}>
                    <td>{pubKey}</td>
                    <td>{users[pubKey].address}</td>


                    <td className="text-center ">
                        {
                            users[pubKey].haveAccess ?
                                <button className="link" onClick={() => onRevokeClick(pubKey)}>
                                    <i className="fa fa-thumbs-down text-danger"> </i>
                                </button>
                                :
                                <button className="link" onClick={() => onGrantClick(pubKey)}>
                                    <i className="fa fa-thumbs-down text-success"> </i>
                                </button>
                        }
                    </td>


                </tr>
            ))}

    />

)