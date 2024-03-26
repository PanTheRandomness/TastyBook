import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Reviews } from '../Reviews';

describe('Reviews component', () => {
  const reviews = [
    { id: 1, username: 'user1', rating: 4, text: 'Great recipe!' },
    { id: 2, username: 'user2', rating: 5, text: 'Excellent!' },
  ];

  const postReviewMock = jest.fn();

  test('renders reviews correctly', () => {
    const { getByText, queryByText } = render(<Reviews reviews={reviews} postReview={postReviewMock} />);

    expect(getByText('user1:')).toBeInTheDocument();
    const ratingAndCommentRegex = new RegExp('4/5 Comment: Great recipe!');
    const reviewText = queryByText(ratingAndCommentRegex);
    expect(reviewText).toBeInTheDocument();

    expect(getByText('user2:')).toBeInTheDocument();
    const ratingAndCommentRegex2 = new RegExp('5/5 Comment: Excellent!');
    const reviewText2 = queryByText(ratingAndCommentRegex2);
    expect(reviewText2).toBeInTheDocument();
  });

  it('calls postReview function with correct parameters when "Post" button is clicked', async () => {
    const { getByTestId } = render(<Reviews reviews={reviews} postReview={postReviewMock} />);

    fireEvent.change(getByTestId('reviewInput'), { target: { value: 'Amazing!' } });
    fireEvent.change(getByTestId('ratingselect'), { target: { value: '5' } });

    fireEvent.click(getByTestId('postreviewbtn'));

    await waitFor(() => {
      expect(postReviewMock).toHaveBeenCalledWith('Amazing!', 5);
    });
  });

  it('displays correct message when there are no reviews available', () => {
    const { getByText } = render(<Reviews reviews={[]} postReview={postReviewMock} />);

    expect(getByText('No reviews available')).toBeInTheDocument();
  });
});
