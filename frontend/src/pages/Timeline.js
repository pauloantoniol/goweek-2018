import React, { Component } from "react";
import api from "../services/api";
import socket from "socket.io-client";

import twitterLogo from "../twitter.svg";
import "./Timeline.css";

import Tweet from "../components/Tweet";

export default class Timeline extends Component {
  state = {
    tweets: [],
    newTweet: ""
  };

  async componentDidMount() {
    this.subscribeToEvents();
    const response = await api.get("/tweets");
    this.setState({ tweets: response.data });
  }

  subscribeToEvents = () => {
    const io = socket("http://localhost:3000");
    io.on("tweet", data => {
      this.setState({ tweets: [data, ...this.state.tweets] });
    });

    io.on("like", data => {
      this.setState({
        tweets: this.state.tweets.map(tweet => {
          return tweet._id === data._id ? data : tweet;
        })
      });
    });
  };

  handleInputChange = e => {
    this.setState({ newTweet: e.target.value });
  };

  handleNewTweet = async e => {
    if (e.keyCode !== 13) return;
    const author = localStorage.getItem("@GoTwitter:username");
    const content = this.state.newTweet;

    await api.post("/tweets", { author, content });

    this.setState({ newTweet: "" });
  };

  render() {
    return (
      <div className="timeline-wrapper">
        <img height={24} src={twitterLogo} alt="GoTwitter" />
        <form>
          <textarea
            value={this.state.newTweet}
            onChange={this.handleInputChange}
            onKeyDown={this.handleNewTweet}
            placeholder="O que está acontecendo"
          />
        </form>
        <ul className="tweet-list">
          {this.state.tweets.map(tweet => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </ul>
      </div>
    );
  }
}
