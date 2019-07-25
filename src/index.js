// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finished loading. 
document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes();
});

const getQuotesUrl = 'http://localhost:3000/quotes?_embed=likes';
const quotesUrl = 'http://localhost:3000/quotes/';
const likesUrl = 'http://localhost:3000/likes/';
const faveQuotes = document.querySelector('#quote-list');
const quoteForm = document.querySelector('#new-quote-form');

// fetch quotes
function fetchQuotes() {
  return fetch(getQuotesUrl)
  .then(resp => resp.json())
  .then(quotes => renderQuotes(quotes));
}

// show quotes
function renderQuotes(quotes) {
  faveQuotes.innerHTML = '';
  quotes.forEach(quote => renderQuote(quote));
}

// show quote
function renderQuote(quote) {
  const qCard = document.createElement('li');
  qCard.className = 'quote-card';

  const blockQuote = document.createElement('blockquote');
  blockQuote.className = 'blockquote';

  const p = document.createElement('p');
  p.className = 'mb-0';
  p.innerText = `"${quote.quote}"`;

  const footer = document.createElement('footer');
  footer.className = 'blocknote_footer';
  footer.innerText = quote.author;

  const breaker = document.createElement('br');

  const btnSuccess = document.createElement('span');
  btnSuccess.innerHTML = `<button class="btn-success">Likes: <span>${quote.likes.length}</span></button>`;
  btnSuccess.addEventListener('click', () => likeQuote(quote));
  
  const btnDanger = document.createElement('button')
  btnDanger.className = 'btn-danger';
  btnDanger.innerText = 'Delete';
  btnDanger.addEventListener('click', () => {
    fetch(quotesUrl + quote.id, {
      method: 'DELETE',
    }).then(fetchQuotes());
  })

  blockQuote.appendChild(p);
  blockQuote.appendChild(footer);
  blockQuote.appendChild(breaker);
  blockQuote.appendChild(btnSuccess);
  blockQuote.appendChild(btnDanger);
  qCard.appendChild(blockQuote);
  faveQuotes.appendChild(qCard);
}

function likeQuote(quote) {
  fetch(likesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify({
      quoteId: quote.id
    })
  })
  .then(fetchQuotes());
}

// new quote
quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  submitQuote(event.target);
})

function submitQuote(eventData) {
  fetch(getQuotesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'quote': eventData.newquote.value,
        'author': eventData.author.value,
      })
  })
  .then(resp => resp.json())
  .then(quote => renderQuote(quote));
}
