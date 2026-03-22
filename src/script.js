const STORAGE_KEYS = {
  user: "bookverse-user",
  wishlist: "bookverse-wishlist",
  downloads: "bookverse-downloads",
  requests: "bookverse-requests",
};

const books = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    published: 2018,
    category: "Self Help",
    amazonUrl: "https://www.amazon.com/s?k=Atomic+Habits+James+Clear",
    description:
      "A practical guide to building better habits through small daily improvements and systems thinking.",
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    published: 2011,
    category: "Psychology",
    amazonUrl: "https://www.amazon.com/s?k=Thinking+Fast+and+Slow+Daniel+Kahneman",
    description:
      "A deep look into how intuitive and analytical thinking shape judgment, bias, and decision making.",
  },
  {
    id: "the-psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    published: 2020,
    category: "Business",
    amazonUrl: "https://www.amazon.com/s?k=The+Psychology+of+Money+Morgan+Housel",
    description:
      "Stories and lessons about wealth, greed, and happiness that make financial behavior easier to understand.",
  },
  {
    id: "mans-search-for-meaning",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    published: 1946,
    category: "Philosophy",
    amazonUrl: "https://www.amazon.com/s?k=Man%27s+Search+for+Meaning+Viktor+Frankl",
    description:
      "A timeless reflection on purpose, suffering, and the human ability to find meaning in difficult conditions.",
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    published: 2016,
    category: "Motivational",
    amazonUrl: "https://www.amazon.com/s?k=Deep+Work+Cal+Newport",
    description:
      "An argument for focused, distraction-free effort and how it creates more value in modern work and learning.",
  },
  {
    id: "the-almanack-of-naval-ravikant",
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    published: 2020,
    category: "Self Help",
    amazonUrl: "https://www.amazon.com/s?k=The+Almanack+of+Naval+Ravikant",
    description:
      "Collected wisdom on wealth, happiness, leverage, and long-term thinking from Naval Ravikant.",
  },
  {
    id: "start-with-why",
    title: "Start With Why",
    author: "Simon Sinek",
    published: 2009,
    category: "Business",
    amazonUrl: "https://www.amazon.com/s?k=Start+With+Why+Simon+Sinek",
    description:
      "A leadership-focused book about purpose, influence, and building trust through a clear sense of why.",
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    published: 180,
    category: "Philosophy",
    amazonUrl: "https://www.amazon.com/s?k=Meditations+Marcus+Aurelius",
    description:
      "Stoic reflections on discipline, calm, and living well through self-awareness and inner steadiness.",
  },
  {
    id: "mindset",
    title: "Mindset",
    author: "Carol S. Dweck",
    published: 2006,
    category: "Psychology",
    amazonUrl: "https://www.amazon.com/s?k=Mindset+Carol+Dweck",
    description:
      "An influential look at fixed versus growth mindset and how belief patterns shape achievement.",
  },
  {
    id: "cant-hurt-me",
    title: "Can't Hurt Me",
    author: "David Goggins",
    published: 2018,
    category: "Motivational",
    amazonUrl: "https://www.amazon.com/s?k=Can%27t+Hurt+Me+David+Goggins",
    description:
      "A powerful memoir about mental toughness, resilience, and breaking through self-imposed limits.",
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    published: 2014,
    category: "Business",
    amazonUrl: "https://www.amazon.com/s?k=Zero+to+One+Peter+Thiel",
    description:
      "A startup and innovation book focused on building unique value instead of copying existing ideas.",
  },
  {
    id: "ikigai",
    title: "Ikigai",
    author: "Hector Garcia and Francesc Miralles",
    published: 2016,
    category: "Self Help",
    amazonUrl: "https://www.amazon.com/s?k=Ikigai+Hector+Garcia",
    description:
      "An accessible exploration of purpose, longevity, and daily joy inspired by Japanese philosophy.",
  },
];

const recommendationTags = [
  "High-growth mindset books",
  "Behavioral psychology picks",
  "Founder and leadership reads",
  "Stoicism and modern philosophy",
  "Motivational books for discipline",
  "Money and wealth thinking",
];

const state = {
  user: readStorage(STORAGE_KEYS.user, null),
  wishlist: readStorage(STORAGE_KEYS.wishlist, []),
  downloads: readStorage(STORAGE_KEYS.downloads, []),
  requests: readStorage(STORAGE_KEYS.requests, []),
  searchTerm: "",
  activeCategory: "All",
};

const elements = {
  authButton: document.getElementById("authButton"),
  authModal: document.getElementById("authModal"),
  closeAuthModal: document.getElementById("closeAuthModal"),
  loginForm: document.getElementById("loginForm"),
  authFeedback: document.getElementById("authFeedback"),
  bookGrid: document.getElementById("bookGrid"),
  categoryFilters: document.getElementById("categoryFilters"),
  searchInput: document.getElementById("searchInput"),
  wishlistList: document.getElementById("wishlistList"),
  downloadsList: document.getElementById("downloadsList"),
  wishlistCount: document.getElementById("wishlistCount"),
  downloadsCount: document.getElementById("downloadsCount"),
  memberName: document.getElementById("memberName"),
  memberEmail: document.getElementById("memberEmail"),
  memberState: document.getElementById("memberState"),
  bookCount: document.getElementById("bookCount"),
  categoryCount: document.getElementById("categoryCount"),
  recommendationTags: document.getElementById("recommendationTags"),
  recommendationForm: document.getElementById("recommendationForm"),
  formFeedback: document.getElementById("formFeedback"),
  wishlistShortcut: document.getElementById("wishlistShortcut"),
  downloadsShortcut: document.getElementById("downloadsShortcut"),
};

init();

function init() {
  bindEvents();
  renderRecommendationTags();
  renderCategoryFilters();
  renderBooks();
  renderShelf("wishlist");
  renderShelf("downloads");
  renderMemberProfile();
  renderHeroStats();
}

function bindEvents() {
  elements.authButton.addEventListener("click", handleAuthButton);
  elements.closeAuthModal.addEventListener("click", () => elements.authModal.close());
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value.trim().toLowerCase();
    renderBooks();
  });
  elements.recommendationForm.addEventListener("submit", handleRecommendationSubmit);
  elements.wishlistShortcut.addEventListener("click", () => {
    document.getElementById("library-dashboard").scrollIntoView({ behavior: "smooth" });
  });
  elements.downloadsShortcut.addEventListener("click", () => {
    document.getElementById("library-dashboard").scrollIntoView({ behavior: "smooth" });
  });
}

function handleAuthButton() {
  if (state.user) {
    clearUserSession();
    return;
  }

  elements.authModal.showModal();
}

function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const user = {
    name: String(formData.get("loginName") || "").trim(),
    email: String(formData.get("loginEmail") || "").trim(),
  };
  const password = String(formData.get("loginPassword") || "");

  if (!user.name || !user.email || password.length < 6) {
    elements.authFeedback.textContent = "Please enter a valid name, email, and password with at least 6 characters.";
    return;
  }

  state.user = user;
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  elements.authFeedback.textContent = "Login successful. Your reader account is ready.";
  elements.loginForm.reset();

  renderMemberProfile();
  renderHeroStats();
  renderBooks();

  setTimeout(() => {
    elements.authModal.close();
    elements.authFeedback.textContent = "";
  }, 700);
}

function handleRecommendationSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const request = {
    name: String(formData.get("requestName") || "").trim(),
    email: String(formData.get("requestEmail") || "").trim(),
    book: String(formData.get("requestBook") || "").trim(),
    message: String(formData.get("requestMessage") || "").trim(),
    createdAt: new Date().toLocaleString(),
  };

  state.requests = [request, ...state.requests];
  localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(state.requests));
  event.currentTarget.reset();
  elements.formFeedback.textContent =
    "Your recommendation request has been saved locally for this portal demo.";
}

function clearUserSession() {
  state.user = null;
  localStorage.removeItem(STORAGE_KEYS.user);
  renderMemberProfile();
  renderHeroStats();
  renderBooks();
}

function requireAuth(actionText) {
  if (state.user) {
    return true;
  }

  elements.authFeedback.textContent = `Please login first to ${actionText}.`;
  elements.authModal.showModal();
  return false;
}

function renderCategoryFilters() {
  const categories = ["All", ...new Set(books.map((book) => book.category))];
  elements.categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-chip ${category === state.activeCategory ? "active" : ""}"
          data-category="${escapeHtml(category)}"
          type="button"
        >
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");

  elements.categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategoryFilters();
      renderBooks();
    });
  });
}

function renderBooks() {
  const filteredBooks = books.filter((book) => {
    const matchesCategory = state.activeCategory === "All" || book.category === state.activeCategory;
    const haystack = [book.title, book.author, book.category, String(book.published)]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !state.searchTerm || haystack.includes(state.searchTerm);
    return matchesCategory && matchesSearch;
  });

  elements.bookGrid.innerHTML = filteredBooks
    .map((book) => {
      const isWishlisted = state.wishlist.includes(book.id);
      const isDownloaded = state.downloads.includes(book.id);

      return `
        <article class="book-card">
          <div class="book-cover">
            <small>${escapeHtml(book.category)}</small>
            <strong>${escapeHtml(book.title)}</strong>
          </div>

          <div class="book-header">
            <div>
              <h3>${escapeHtml(book.title)}</h3>
              <span class="tag">${escapeHtml(book.category)}</span>
            </div>
          </div>

          <div class="book-meta">
            <span><strong>Writer:</strong> ${escapeHtml(book.author)}</span>
            <span><strong>Published:</strong> ${escapeHtml(String(book.published))}</span>
          </div>

          <p class="book-description">${escapeHtml(book.description)}</p>

          <div class="book-actions">
            <button class="action-button" data-action="wishlist" data-book-id="${book.id}" type="button">
              ${isWishlisted ? "Wishlisted" : "Add to wishlist"}
            </button>
            <button class="action-button" data-action="download" data-book-id="${book.id}" type="button">
              ${isDownloaded ? "Added to downloads" : "Download"}
            </button>
            <button class="action-button buy" data-action="buy" data-book-id="${book.id}" type="button">
              Buy on Amazon
            </button>
          </div>
          <p class="small-note">Download is a placeholder action right now because no file link is attached yet.</p>
        </article>
      `;
    })
    .join("");

  if (!filteredBooks.length) {
    elements.bookGrid.innerHTML =
      '<p class="empty-state">No books matched your search. Try another title, author, or category.</p>';
  }

  elements.bookGrid.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const { action, bookId } = button.dataset;
      if (action === "wishlist") toggleWishlist(bookId);
      if (action === "download") trackDownload(bookId);
      if (action === "buy") handleAmazonBuy(bookId);
    });
  });
}

function toggleWishlist(bookId) {
  if (!requireAuth("save books to your wishlist")) return;

  if (state.wishlist.includes(bookId)) {
    state.wishlist = state.wishlist.filter((id) => id !== bookId);
  } else {
    state.wishlist = [bookId, ...state.wishlist];
  }

  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist));
  renderBooks();
  renderShelf("wishlist");
}

function trackDownload(bookId) {
  const selectedBook = books.find((book) => book.id === bookId);
  if (!selectedBook) return;

  if (!state.downloads.includes(bookId)) {
    state.downloads = [bookId, ...state.downloads];
    localStorage.setItem(STORAGE_KEYS.downloads, JSON.stringify(state.downloads));
  }

  renderBooks();
  renderShelf("downloads");
  elements.formFeedback.textContent = `"${selectedBook.title}" was added to your downloads list. File link can be attached later.`;
}

function handleAmazonBuy(bookId) {
  if (!requireAuth("buy books from Amazon")) return;

  const selectedBook = books.find((book) => book.id === bookId);
  if (!selectedBook) return;

  window.open(selectedBook.amazonUrl, "_blank", "noopener,noreferrer");
}

function renderShelf(type) {
  const listElement = type === "wishlist" ? elements.wishlistList : elements.downloadsList;
  const countElement = type === "wishlist" ? elements.wishlistCount : elements.downloadsCount;
  const ids = state[type];
  const selectedBooks = ids.map((id) => books.find((book) => book.id === id)).filter(Boolean);

  countElement.textContent = String(selectedBooks.length);

  if (!selectedBooks.length) {
    listElement.innerHTML = `<p class="empty-state">No books in your ${type} list yet.</p>`;
    return;
  }

  listElement.innerHTML = selectedBooks
    .map(
      (book) => `
        <article class="dashboard-item">
          <strong>${escapeHtml(book.title)}</strong>
          <small>${escapeHtml(book.author)} • ${escapeHtml(book.category)}</small>
        </article>
      `
    )
    .join("");
}

function renderRecommendationTags() {
  elements.recommendationTags.innerHTML = recommendationTags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");
}

function renderMemberProfile() {
  if (state.user) {
    elements.memberName.textContent = state.user.name;
    elements.memberEmail.textContent = state.user.email;
    elements.memberState.textContent = "Member";
    elements.authButton.textContent = "Logout";
  } else {
    elements.memberName.textContent = "Not signed in";
    elements.memberEmail.textContent = "Login to unlock wishlist and Amazon purchase access.";
    elements.memberState.textContent = "Guest";
    elements.authButton.textContent = "Login";
  }
}

function renderHeroStats() {
  const categories = new Set(books.map((book) => book.category));
  elements.bookCount.textContent = String(books.length);
  elements.categoryCount.textContent = String(categories.size);
}

function readStorage(key, fallbackValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
