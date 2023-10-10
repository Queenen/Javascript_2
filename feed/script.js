import { request } from "../js/HTTP_request_base.js";
import { fetchPosts } from "../js/posts.js";
import { findContent } from "../js/search.js";
import { fetchContent } from "../js/filter.js";
import { initEditFunctionality } from "../js/edit_delete.js";

findContent();
initEditFunctionality();
fetchPosts();
fetchContent();
