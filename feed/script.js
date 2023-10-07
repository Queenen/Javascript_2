import { fetchPosts } from "../js/posts.js";
import { findContent } from "../js/search.js";
import { fetchContent } from "../js/filter.js";
import { createPost } from "../js/create.js";

fetchPosts();
fetchContent();
findContent();
