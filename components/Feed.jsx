"use client";

import { useState, useEffect } from "react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard key={post.id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchTimeOut, setSearchTimeOut] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();

      setPosts(data);
    };
    fetchPost();
  }, []);

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i");

    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeOut);
    setSearchText(e.target.value);

    setSearchTimeOut(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      })
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(searchText);
    setSearchResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="search for tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
