import React from 'react';
import { useState, useEffect } from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css'; 

const Reviews = (props) => {
    const {reviews, postReview} = props; 
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");


    const handleAddReview = async () => {
    console.log('Text:', text);
    console.log('Rating:', rating);
    postReview(text, rating);
    };
    
    const reviewItems = reviews.map((review, index) => (
        <div key={index} className="review">
            <p><strong>Rating:</strong> {review.rating}</p>
            <p><strong>Comment:</strong> {review.text}</p> 
        </div>
    ));

    return (
        <div className='reviews-container'>
                    <h1>Reviews</h1>
                    <div className='reviews'>
                {reviews.length === 0 ? (
                    <div>No reviews available</div>
                ) : (
                    reviewItems
                )}
            </div>
                    <div className='leave_review'>
                        {/*Arvio tekstinä*/}
                        <textarea data-testid="reviewInput" className="reviewinput" rows={7} placeholder='Type review...' style={{resize: 'none'}}
                        value={text} onChange={(event) => setText(event.target.value)}/>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            {/* Tähtiluokitus */}
                            <img src='/rating_star.png' alt="Star Rating"/>
                            <select data-testid='ratingselect' style={{marginLeft:'1em', maxWidth: '10%', borderRadius: '5px', borderStyle: 'none'}}
                            value={rating} onChange={(event) => setRating(parseInt(event.target.value))}  >  
                                {/*Tähän vaihtoehdot*/}
                                {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                            </select>
                            
                            {/*nappi ohjaa kirjautumaan, jos ei vielä ole */}
                            <button className='postreviewbtn' onClick={handleAddReview}>Post</button>
                        </div>
                    </div>
                </div>
    );
}

export { Reviews };
