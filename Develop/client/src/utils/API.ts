

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyC0xtRZOAttfQZRO8nj5UuLUFTWSPI9I64`);
};