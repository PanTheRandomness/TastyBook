import React from 'react';
import { useState, useEffect } from 'react';
import { addReview} from '../api/recipeApi';
import '../Styles/Modal.css';
import '../Styles/Recipe.css'; 

const Reviews = () => {
    const [reviews, setReviews] = useState([]); 
    const [newReview, setNewReview] = useState({
        rating: 0,
        text: ''
    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Fetch reviews from the server
            const response = await fetch('http://localhost:3004/api/review');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data.reviews); // Assuming data contains a "reviews" array
        } catch (error) {
            console.error('Error fetching reviews:', error.message);
        }
    };

    const handleAddReview = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User token not found');
            }

            // Tässä lähetetään HTTP POST pyyntö jotta voidaan lisätä uusi arvio
            const response = await addReview(token, newReview);

            // Päivitetään arviot uudella
            setReviews([...reviews, response]);

            // Nollataan uusi arvio
            setNewReview({
                rating: 0,
                text: ''
            });
        } catch (error) {
            console.error('Error adding review:', error.message);
        }
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
                        {/*Huom maksimipituus!*/}
                        <textarea data-testid="reviewInput" className="reviewinput" rows={7} placeholder='Type review...' style={{resize: 'none'}}/>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <img src='/rating_star.png' alt="Star Rating"/>
                            <select data-testid='ratingselect' style={{marginLeft:'1em', maxWidth: '10%', borderRadius: '5px', borderStyle: 'none'}}>
                                {/*Tähän vaihtoehdot*/}
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            {/*Asettelua tarkemmaksi */}
                            {/*nappi ohjaa kirjautumaan, jos ei vielä ole */}
                            <button className='postreviewbtn' onClick={handleAddReview}>Post</button>
                        </div>
                    </div>
                </div>
    );
}

export { Reviews };
