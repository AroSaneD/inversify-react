import * as React from 'react';

interface NestedProps {
    val: number;
}

export const Nested: React.FC<NestedProps> = ({ val }) => {
    return <span>Hmmmmm{val}...</span>;
};
