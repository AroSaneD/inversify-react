import { connect, providerContext } from '@arosaned/inversify-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { ClientServerService } from './client-server.service';

interface ClientProps {
    isClient: boolean;
}

const Client = ({ isClient }: ClientProps) => {
    if (isClient) {
        return <div>
            Client page {' '}
            <Link to="/server">Click here for server.</Link>
        </div>
    } else {
        return <h2 style={{ color: "red" }}>You shouldn't be here</h2>
    }
}

export default connect<ClientProps, {}>(Client, (_, s: ClientServerService) => {
    return {
        isClient: s.isClient
    };
}, [ClientServerService]);