import React from 'react'

export default function Button(props) {
    const { action, res } = props;

    return (
        <button
        onClick={() => action(`${res}`)}
        className='button'
        >
            {res}
        </button>
    )
}
