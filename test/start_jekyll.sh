#!/bin/bash

# Ensure the correct Ruby and Bundler paths
export PATH="/home/dmckellar/miniforge3/envs/jekyll/bin:$PATH"
export GEM_HOME="/home/dmckellar/miniforge3/envs/jekyll/share/rubygems"
export GEM_PATH="/home/dmckellar/miniforge3/envs/jekyll/share/rubygems"
export RUBYLIB="/home/dmckellar/miniforge3/envs/jekyll/lib/ruby"

# Install Bundler
/home/dmckellar/miniforge3/envs/jekyll/bin/ruby -S gem install bundler -v 2.5.23

# Install Jekyll
/home/dmckellar/miniforge3/envs/jekyll/bin/ruby -S gem install jekyll

# Install dependencies
/home/dmckellar/miniforge3/envs/jekyll/bin/ruby -S bundle install --path vendor/bundle

# Serve the Jekyll site
/home/dmckellar/miniforge3/envs/jekyll/bin/ruby -S bundle exec jekyll serve