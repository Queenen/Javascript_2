let validPostCount = 0;
const MAX_POST_COUNT = 10; // Define the maximum post count

// This function resets the post count, useful for scenarios when you need to recount from the start.
function resetPostCount() {
  validPostCount = 0;
}

// This function increments the post count and checks if it's less than the provided limit.
// Returns true if it's under the limit, else returns false.
function incrementAndCheckPostCount(limit = MAX_POST_COUNT) {
  if (validPostCount < limit) {
    validPostCount++;
    return true; // Return true if incrementing the count is allowed
  } else {
    return false; // Return false to indicate that the limit has been reached
  }
}

// This function returns the current valid post count.
function getCurrentPostCount() {
  return validPostCount;
}

export { resetPostCount, incrementAndCheckPostCount, getCurrentPostCount };
