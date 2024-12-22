import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TweetComponent = ({ tweetId }) => {
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, {
          params: {
            'tweet.fields': 'created_at,attachments',
            'expansions': 'author_id',
            'media.fields': '',
            'place.fields': '',
            'poll.fields': '',
            'user.fields': ''
          },
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_X_BEARER_TOKEN}`
          }
        });
        setTweet(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching tweet: {error.message}</p>;

  return (
    <div>
      {tweet && (
        <div>
          <p>Author ID: {tweet.includes.users[0].id}</p>
          <p>Author Name: {tweet.includes.users[0].name}</p>
          <p>Author Username: {tweet.includes.users[0].username}</p>
          <p>Tweet Text: {tweet.data.text}</p>
          <p>Created At: {tweet.data.created_at}</p>
        </div>
      )}
    </div>
  );
};

export default TweetComponent;
