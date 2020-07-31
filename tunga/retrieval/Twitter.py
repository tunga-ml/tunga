import tweepy as tw


def read_tweets_from_user(api_key, api_secret, access_token, token_secret, username, max_tweet_count=200):
    """
    Fetch last 200 tweet records that are posted by given username.

    :param api_key: twitter api key
    :param api_secret: twitter api secret
    :param access_token: twitter api token
    :param token_secret: twitter token secret
    :param username: username for fetching tweets
    :param max_tweet_count: tweet limit
    :return: an array that contains tweets posted by user
    """
    auth = tw.OAuthHandler(api_key, api_secret, )
    auth.set_access_token(access_token, token_secret)
    api = tw.API(auth)
    user = api.user_timeline(username, count=max_tweet_count)

    user_tweet = []
    for tweet in user:
        user_tweet.append({
            "tweet_text": tweet.text
        })
    return user_tweet


def read_tweets_from_hashtag(api_key, api_secret, access_token, token_secret, hashtag, max_tweet_count):
    """
    Fetch last 200 tweet records that are posted to given hashtag.

    :param api_key: twitter api key
    :param api_secret: twitter api secret
    :param access_token: twitter api token
    :param token_secret: twitter token secret
    :param hashtag: hashtag for fetching tweets
    :param max_tweet_count: tweet limit
    :param date
    :return: an array that contains tweets posted to given hashtag
    :return:
    """
    auth = tw.OAuthHandler(api_key, api_secret, )
    auth.set_access_token(access_token, token_secret)
    api = tw.API(auth)
    search_words = hashtag + "-filter:retweets"

    tweets = tw.Cursor(api.search,
                       q=search_words,
                       lang="tr").items(max_tweet_count)
    date_tweet = []
    for tweet in tweets:
        date_tweet.append({
            "tweet_text": tweet.text
        })
    return date_tweet
