# twi

Command line tool to for Twitter's REST API.


# Usage

Retrieve user

   $ twi user fent id_str,screen_name
   { id_str: '75072321', screen_name: 'fent' } 

Retrieve Tweet

    $ twi tweet 387968357875843072
    { created_at: 'Wed Oct 09 15:50:39 +0000 2013',
      id: 387968357875843100,
      id_str: '387968357875843072',
      text: 'hmm I am not sure about this breakfast sandwich http://t.co/baw8koYz53',
      ...
    }


To configure it with your Twitter oauth credentials, it looks at the following environment variables.

    TWITTER_CONSUMER_KEY
    TWITTER_CONSUMER_SECRET
    TWITTER_TOKEN
    TWITTER_TOKEN_SECRET

# Motive

I work with the Twitter API. Sometimes looking up a Tweet's or user's metadata is useful. Twitter turned off the ability to simply go to a URL without oauth, so I thought this would be useful. 


# Install

    npm -g install twi


# License
MIT
