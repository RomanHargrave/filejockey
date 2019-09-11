FROM ruby:2.5.5

# Install system dependencies
RUN apt update && apt install -y build-essential libpq-dev libxml2-dev libxslt1-dev nodejs

# to be clear, APP_HOME is NOT a special environment variable
# rails DOES NOT care about it
ENV APP_HOME /opt/filerouter

ADD . $APP_HOME

WORKDIR $APP_HOME

RUN bundle install -j3

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
