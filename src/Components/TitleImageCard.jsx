import React from 'react';

export default function TitleImageCard(props) {
    const { data, type } = props;
    
    return (
        <div>
            <p>{type === 'movie' ? data.title : data.name}</p>
            <img src={type === 'movie' ? data.poster : data.picture} alt="" />
        </div>
    )
}
