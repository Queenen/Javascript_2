let validPostCount = 0;

// This function resets the post count, useful for scenarios when you need to recount from the start.
function resetPostCount() {
  validPostCount = 0;
}

// This function increments the post count and checks if it's less than the provided limit.
// Returns true if it's under the limit, else returns false.
function incrementAndCheckPostCount(limit = 10) {
  validPostCount++;
  return validPostCount <= limit;
}

// This function returns the current valid post count.
function getCurrentPostCount() {
  return validPostCount;
}

export { resetPostCount, incrementAndCheckPostCount, getCurrentPostCount };
