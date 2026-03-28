const BASE_URL = "https://crudcrud.com/api/a5badc8cd6b14556ad034de28db015fd/feedback";

let ratings = {1:0,2:0,3:0,4:0,5:0};
let feedbacks = [];

window.onload = fetchFeedbacks;

function updateRatings() {
  ratings = {1:0,2:0,3:0,4:0,5:0};
  feedbacks.forEach(fb => ratings[fb.rating]++);

  document.getElementById('r1').innerText = ratings[1];
  document.getElementById('r2').innerText = ratings[2];
  document.getElementById('r3').innerText = ratings[3];
  document.getElementById('r4').innerText = ratings[4];
  document.getElementById('r5').innerText = ratings[5];
}

function renderFeedbacks() {
  const list = document.getElementById('feedbackList');
  list.innerHTML = '';

  feedbacks.forEach(fb => {
    const div = document.createElement('div');
    div.className = 'feedback-item';

    div.innerHTML = `
      ${fb.name} - ${'★'.repeat(fb.rating)}
      <button onclick="editFeedback('${fb._id}')">Edit</button>
      <button onclick="deleteFeedback('${fb._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

function submitFeedback() {
  const name = document.getElementById('name').value;
  const rating = parseInt(document.getElementById('rating').value);

  if (!name) return alert('Enter name');

  const obj = { name, rating };

  fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(data => {
    feedbacks.push(data);
    updateRatings();
    renderFeedbacks();

    document.getElementById('submitBtn').innerText = "Submit";
  });

  document.getElementById('name').value = '';
}

function fetchFeedbacks() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      feedbacks = data;
      updateRatings();
      renderFeedbacks();
    });
}

function deleteFeedback(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    feedbacks = feedbacks.filter(fb => fb._id !== id);
    updateRatings();
    renderFeedbacks();
  });
}

function editFeedback(id) {
  const fb = feedbacks.find(f => f._id === id);

  document.getElementById('name').value = fb.name;
  document.getElementById('rating').value = fb.rating;

  document.getElementById('submitBtn').innerText = "Edit Rating";

  deleteFeedback(id);
}