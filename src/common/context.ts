import * as React from 'react';
import { Container } from 'inversify';

export const providerContext = React.createContext<Container>(null);
