# twi

Command line tool to for Twitter's REST API.

[![Dependency Status](https://david-dm.org/fent/twi.svg)](https://david-dm.org/fent/twi)

# Usage

Retrieve user

    $ twi username roly426
    { id: 75072321,
      id_str: '75072321',
      name: 'Roly Fentanes',
      screen_name: 'roly426',
      ...
    }

By id

    $ twi userid 75072321
    { id: 75072321,
      id_str: '75072321',
      name: 'Roly Fentanes',
      screen_name: 'roly426',
      ...
    }

Optional template

    $ twi username roly426 '{{id_str}}'
    75072321

Multiple user lookups (with one request)

    $ twi username roly426,twitterid '{{id_str}} - {{screen_name}}'
    75072321 - roly426
    6253282 - twitterapi

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
