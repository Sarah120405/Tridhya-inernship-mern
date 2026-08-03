let comments = [];
let nextId = 1;

export function getComments(postSlug) {
  return comments.filter((c) => c.postSlug === postSlug);
}

export function addComment(postSlug, author, text) {
  const comment = {
    id: nextId++,
    postSlug,
    author,
    text,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  console.log("Comment added, array now:", comments);
  return comment;
}

export function getAllCommentsAcrossPosts() {
  console.log("getAllCommentsAcrossPosts called", comments);
  return comments;
}
