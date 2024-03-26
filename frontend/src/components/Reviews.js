import React, { useState } from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';

const Reviews = (props) => {
    const { reviews, postReview } = props;
    const [rating, setRating] = useState(1);
    const [text, setText] = useState("");

    const handleAddReview = async () => {
        console.log('Text:', text);
        console.log('Rating:', rating);
        postReview(text, rating);
    };

    const reviewItems = reviews.map((review) => (
        <div key={review.id} className="review">
            <p style={{ color: 'white' }}><strong>{review.username}: </strong><img src='/rating_star.png' alt="Star Rating" className='review-rating-star' /> {review.rating}/5 <br /> Comment: {review.text}</p>
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
                <textarea data-testid="reviewInput" className="reviewinput" rows={7} placeholder='Type review...' style={{ resize: 'none' }}
                    value={text} onChange={(event) => setText(event.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <img src='/rating_star.png' alt="Star Rating" />
                    <select data-testid='ratingselect' style={{ marginLeft: '1em', maxWidth: '10%', borderRadius: '5px', borderStyle: 'none' }}
                        value={rating} onChange={(event) => setRating(parseInt(event.target.value))}>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                    <button className='postreviewbtn' onClick={handleAddReview} data-testid="postreviewbtn">Post</button>
                </div>
            </div>
        </div>
    );
}

export { Reviews };
