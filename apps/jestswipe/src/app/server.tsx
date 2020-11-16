import { connect, providerContext } from '@arosaned/inversify-react';
import React from 'react'
import { Link } from 'react-router-dom'
import { ClientServerService } from './client-server.service';

interface ServerProps {
    isServer: boolean;
}

const Server = ({ isServer }: ServerProps) => {
    if (isServer) {
        return <div>

            Server page {' '}
            <Link to="/client">Click here for client.</Link>
        </div>
    } else {
        return <h2 style={{ color: "red" }}>You shouldn't be here</h2>
    }
}

export default connect<ServerProps, {}>(Server, (_, s: ClientServerService) => {
    return {
        isServer: s.isServer
    }
}, [ClientServerService]);