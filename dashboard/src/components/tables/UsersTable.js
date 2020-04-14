import React from 'react'
import { TableLayout } from './TableLayout';

export const UsersTable = ({ users, onGrantClick, onRevokeClick }) => (

    <TableLayout
        TableHeaders={() =>
            <React.Fragment>
                <th>Public Key</th>
                <th>Address</th>
                <th>Grant or Revoke Access</th>
            </React.Fragment>
        }


        TableBodyContent={() => Object.keys(users).filter(pubKey => users[pubKey].identity !== 'OWNER').map((pubKey, index) =>
            (
                <tr key={index} style={{
                    background: users[pubKey].haveAccess ? 'lightgreen' : 'initial'
                }
                    
                }>
                    <td>{pubKey}</td>
                    <td>{users[pubKey].address}</td>


                    <td>
                        {
                            users[pubKey].haveAccess ?
                                <button  onClick={() => onRevokeClick(pubKey)} className="btn btn-warning"> Revoke Access </button>
                                :
                                <button  onClick={() => onGrantClick(pubKey)} className="btn btn-warning"> Grant Access </button>
                        }
                    </td>


                </tr>
            ))}

    />

)