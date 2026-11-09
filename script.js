/* ==========================================================
   FASO DIGITAL SHOP - script.js (version 8)
   Panier, catégories, tri, favoris, partage, mode sombre, avis, FAQ, promo, PWA
   ========================================================== */

/* ---------- 1. CONFIGURATION ---------- */
const WHATSAPP = "22655685953";
const CART_KEY = "fasoCart";
const PROMO_KEY = "fasoPromo";
const FAV_KEY = "fasoFavs";
const THEME_KEY = "fasoTheme";
const SETTINGS_KEY = "fasoSettings";

// Réduction automatique (en %) pour les membres Premium
const PREMIUM_DISCOUNT = 10;

// Codes promo : "CODE": pourcentage de réduction
const PROMO_CODES = {
  "FASO10": 10,
  "BIENVENUE": 5
};

// Numéros Mobile Money (à remplacer par les tiens)
const PAYMENTS = [
  { name: "Orange Money", number: "00 00 00 00", holder: "Ton nom" },
  { name: "Moov Money", number: "00 00 00 00", holder: "Ton nom" }
];

const CATEGORIES = ["Tous", "Packs", "Premium", "IA", "Informatique", "Emploi"];

/* ---------- 2. DONNÉES ---------- */
const products = [
  {
    id: 1,
    name: "Maîtriser l'intelligence artificielle",
    description: "Un guide pratique pour apprendre à utiliser l'IA.",
    details: "Découvre les bases de l'intelligence artificielle, les meilleurs usages, les techniques de rédaction de prompts et comment utiliser l'IA pour apprendre et travailler.",
    price: 2000,
    category: "IA",
    icon: "🤖",
    image: "images/robot.jpg",
    badge: "Nouveau"
  },
  {
    id: 2,
    name: "Internet et informatique",
    description: "Découvre les bases du numérique.",
    details: "Apprends à utiliser Internet, les navigateurs, les moteurs de recherche, les fichiers, les logiciels et les outils numériques.",
    price: 1500,
    category: "Informatique",
    icon: "💻",
    image: "images/laptop.jpg",
    badge: ""
  },
  {
    id: 3,
    name: "Pack CV professionnel",
    description: "Prépare un CV et une lettre de motivation.",
    details: "Découvre des modèles de CV, des conseils de rédaction et une méthode pour préparer une lettre de motivation professionnelle.",
    price: 1000,
    category: "Emploi",
    icon: "📄",
    badge: "Promo"
  },
  {
    id: 4,
    name: "Devenir développeur web",
    description: "Apprends les bases du développement web.",
    details: "Découvre HTML, CSS et JavaScript, apprends à créer des pages web et commence ton parcours de développeur.",
    price: 2500,
    category: "Informatique",
    icon: "🌐",
    badge: ""
  },

  /* ----- PACKS : "includes" = numéros (id) des produits du pack.
         Le prix économisé est calculé automatiquement. ----- */
  {
    id: 5,
    name: "Pack Numérique",
    description: "L'IA et l'informatique à prix réduit.",
    details: "Deux guides pour bien démarrer dans le numérique : maîtriser l'intelligence artificielle et comprendre Internet et l'informatique.",
    price: 3000,
    category: "Packs",
    icon: "🎁",
    badge: "Pack",
    includes: [1, 2]
  },
  {
    id: 6,
    name: "Pack Emploi et Web",
    description: "Prépare ton CV et apprends le web.",
    details: "Un pack pour décrocher un emploi et développer tes compétences : le pack CV professionnel et le guide pour devenir développeur web.",
    price: 3000,
    category: "Packs",
    icon: "🚀",
    badge: "Pack",
    includes: [3, 4]
  },
  {
    id: 7,
    name: "Pack Complet",
    description: "Tous les guides au meilleur prix.",
    details: "Tous nos guides réunis dans un seul pack : intelligence artificielle, informatique, CV professionnel et développement web.",
    price: 5500,
    category: "Packs",
    icon: "💎",
    badge: "Pack",
    includes: [1, 2, 3, 4]
  },

  /* ----- PRODUIT EXCLUSIF : "premiumOnly: true" = réservé aux membres Premium ----- */
  {
    id: 8,
    name: "Prompts IA exclusifs",
    description: "Une collection de prompts réservée aux membres.",
    details: "Une collection de prompts prêts à l'emploi pour gagner du temps avec l'IA : études, travail, rédaction et création de contenu.",
    price: 1500,
    category: "Premium",
    icon: "⭐",
    badge: "Premium",
    premiumOnly: true
  }
];

// Témoignages : remplace-les par de vrais avis de tes clients
const testimonials = [
  { name: "Client 1", text: "Texte du premier avis de ton client.", stars: 5 },
  { name: "Client 2", text: "Texte du deuxième avis de ton client.", stars: 5 },
  { name: "Client 3", text: "Texte du troisième avis de ton client.", stars: 4 }
];

// Questions fréquentes : adapte les réponses à ta façon de travailler
const faq = [
  {
    question: "Comment je reçois mon produit ?",
    answer: "Après la confirmation de ton paiement, je t'envoie ton guide directement sur WhatsApp."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Orange Money et Moov Money. Les numéros sont indiqués dans la section « Comment payer ? »."
  },
  {
    question: "Combien de temps pour recevoir mon guide ?",
    answer: "En général, quelques minutes après l'envoi de la preuve de paiement."
  },
  {
    question: "Le guide est-il en format PDF ?",
    answer: "Oui, tu peux le lire sur ton téléphone, même sans connexion Internet."
  },
  {
    question: "J'ai un problème avec ma commande, que faire ?",
    answer: "Clique sur le bouton WhatsApp en bas à droite et explique-moi la situation."
  }
];

/* ---------- 3. ÉLÉMENTS DU DOM ---------- */
const container = document.getElementById("products");
const searchInput = document.getElementById("search");

/* ---------- 3B. COMPTE ET PARAMÈTRES (complétés par account.js) ---------- */
const account = {
  user: null,                // { name, email, picture } quand l'utilisateur est connecté
  isPremium: () => false     // remplacé par account.js
};

const settings = {
  saveCart: true,
  saveFavs: true,
  saveOrders: true,
  rememberInfo: true
};

try {
  Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {});
} catch (error) {
  // on garde les paramètres par défaut
}

/* ---------- 4. OUTILS ---------- */
let currentCategory = "Tous";
let currentSort = "default";
let showFavsOnly = false;
let viewingDetails = false;
let favorites = [];

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + " FCFA";
}

function findProduct(id) {
  return products.find(p => p.id === id);
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getWhatsAppNumber() {
  return String(WHATSAPP).replace(/\D/g, "");
}

// Petit message qui apparaît puis disparaît
function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

/* ---------- 5. PANIER : DONNÉES ---------- */
let cart = [];
let promoCode = "";

try {
  cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
  promoCode = localStorage.getItem(PROMO_KEY) || "";
} catch (error) {
  cart = [];
  promoCode = "";
}

function isValidPromo(code) {
  return Object.prototype.hasOwnProperty.call(PROMO_CODES, code);
}

// Si le code enregistré n'existe plus, on l'enlève
if (promoCode && !isValidPromo(promoCode)) {
  promoCode = "";
}

function saveCart() {
  try {
    if (settings.saveCart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      localStorage.setItem(PROMO_KEY, promoCode);
    } else {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(PROMO_KEY);
    }
  } catch (error) {
    console.warn("Impossible de sauvegarder le panier.", error);
  }
}

function addToCart(id) {
  const product = findProduct(id);
  if (!product) return;

  if (product.premiumOnly && !account.isPremium()) {
    showToast("🔒 Réservé aux membres Premium");
    return;
  }

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  saveCart();
  displayCart();
  showToast("✅ Produit ajouté au panier !");
}

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  displayCart();
}

function clearCart() {
  if (cart.length === 0) return;

  if (confirm("Vider tout le panier ?")) {
    cart = [];
    promoCode = "";
    saveCart();
    displayCart();
    showToast("🗑️ Panier vidé");
  }
}

/* ---------- 5B. FAVORIS ---------- */
try {
  favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
} catch (error) {
  favorites = [];
}

function saveFavorites() {
  try {
    if (settings.saveFavs) {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } else {
      localStorage.removeItem(FAV_KEY);
    }
  } catch (error) {
    console.warn("Impossible de sauvegarder les favoris.", error);
  }
}

function favButtonHTML(id) {
  const fav = favorites.includes(id);

  return `
    <button class="fav-btn ${fav ? "active" : ""}" data-id="${id}"
            onclick="toggleFavorite(${id})" aria-label="Ajouter aux favoris">
      ${fav ? "❤️" : "🤍"}
    </button>
  `;
}

function refreshFavButtons() {
  document.querySelectorAll(".fav-btn").forEach(btn => {
    const fav = favorites.includes(Number(btn.dataset.id));
    btn.classList.toggle("active", fav);
    btn.textContent = fav ? "❤️" : "🤍";
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showToast("Retiré des favoris");
  } else {
    favorites.push(id);
    showToast("❤️ Ajouté aux favoris");
  }

  saveFavorites();

  if (showFavsOnly && !viewingDetails) {
    applyFilters();
  } else {
    refreshFavButtons();
  }
}

function toggleFavFilter() {
  showFavsOnly = !showFavsOnly;

  const btn = document.getElementById("fav-filter");
  btn.classList.toggle("active", showFavsOnly);
  btn.textContent = showFavsOnly ? "❤️ Mes favoris" : "🤍 Mes favoris";

  applyFilters();
}

/* ---------- 5C. PARTAGE ---------- */
async function shareProduct(id) {
  const product = findProduct(id);
  if (!product) return;

  const pageUrl = window.location.href.split("#")[0];
  const text =
    `${product.icon} ${product.name}\n` +
    `${product.description}\n` +
    `Prix : ${formatPrice(product.price)}\n\n` +
    `À découvrir sur Faso Digital Shop :`;

  if (navigator.share) {
    try {
      await navigator.share({ title: product.name, text: text, url: pageUrl });
    } catch (error) {
      // Partage annulé par l'utilisateur : rien à faire
    }
    return;
  }

  const link = `https://wa.me/?text=${encodeURIComponent(text + "\n" + pageUrl)}`;
  window.open(link, "_blank");
}

/* ---------- 5D. MODE SOMBRE ---------- */
function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);

  const btn = document.getElementById("theme-btn");
  if (btn) btn.textContent = dark ? "☀️" : "🌙";
}

function toggleTheme() {
  const dark = !document.body.classList.contains("dark");
  applyTheme(dark);

  try {
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  } catch (error) {
    console.warn("Impossible de sauvegarder le thème.", error);
  }
}

function createThemeButton() {
  // Le bouton de thème se trouve dans « Mon compte > Paramètres »

  let saved = "";
  try {
    saved = localStorage.getItem(THEME_KEY) || "";
  } catch (error) {
    saved = "";
  }

  applyTheme(saved === "dark");
}

/* ---------- 6. CODES PROMO ---------- */
function getSubtotal() {
  return cart.reduce((sum, item) => {
    const product = findProduct(item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}

// Applique la meilleure réduction (code promo, Premium ou parrainage : non cumulables)
function getDiscountInfo(subtotal) {
  const options = [];

  if (promoCode) {
    options.push({ pct: PROMO_CODES[promoCode], label: `Code ${promoCode}`, source: "promo" });
  }

  if (account.isPremium()) {
    options.push({ pct: PREMIUM_DISCOUNT, label: "⭐ Réduction Premium", source: "premium" });
  }

  // getReferralPct() est définie dans account.js
  const referralPct = typeof getReferralPct === "function" ? getReferralPct() : 0;
  if (referralPct > 0) {
    options.push({ pct: referralPct, label: "🎁 Réduction parrainage", source: "referral" });
  }

  if (options.length === 0) {
    return { amount: 0, pct: 0, label: "", source: "" };
  }

  const best = options.reduce((a, b) => (b.pct > a.pct ? b : a));

  return {
    amount: Math.round(subtotal * best.pct / 100),
    pct: best.pct,
    label: best.label,
    source: best.source
  };
}

function getDiscount(subtotal) {
  return getDiscountInfo(subtotal).amount;
}

function applyPromo() {
  const input = document.getElementById("promo-input");
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast("Entre un code promo");
    return;
  }

  if (!isValidPromo(code)) {
    showToast("❌ Code promo invalide");
    return;
  }

  promoCode = code;
  input.value = "";
  saveCart();
  displayCart();
  showToast(`🎉 Code ${code} appliqué : -${PROMO_CODES[code]} %`);
}

function removePromo() {
  promoCode = "";
  saveCart();
  displayCart();
  showToast("Code promo retiré");
}

/* ---------- 7. PANIER : AFFICHAGE ---------- */
function createCartSection() {
  container.insertAdjacentHTML("beforebegin", `
    <div class="cart-backdrop" id="cart-backdrop" onclick="closeCart()"></div>

    <section class="cart-section" id="cart-section" aria-label="Mon panier">
      <button class="cart-close" onclick="closeCart()" aria-label="Fermer le panier">✕</button>
      <h2>🛒 Mon panier (<span id="cart-count">0</span>)</h2>
      <div id="cart-items"></div>

      <div class="promo-box">
        <input type="text" id="promo-input" placeholder="Code promo" autocapitalize="characters">
        <button onclick="applyPromo()">Appliquer</button>
      </div>

      <div id="cart-discount"></div>
      <h3>Total : <span id="cart-total">0 FCFA</span></h3>

      <div class="order-form">
        <input type="text" id="customer-name" placeholder="Ton nom *" autocomplete="name">
        <input type="text" id="customer-city" placeholder="Ta ville" autocomplete="address-level2">
      </div>

      <button class="buy" onclick="checkoutCart()">
        Commander sur WhatsApp
      </button>
      <button class="clear-cart" onclick="clearCart()">
        Vider le panier
      </button>
    </section>
  `);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });
}

function openCart() {
  document.getElementById("cart-section").classList.add("open");
  document.getElementById("cart-backdrop").classList.add("open");
  document.body.classList.add("modal-open");
}

function closeCart() {
  const section = document.getElementById("cart-section");
  const backdrop = document.getElementById("cart-backdrop");
  if (section) section.classList.remove("open");
  if (backdrop) backdrop.classList.remove("open");
  document.body.classList.remove("modal-open");
}

// Bouton « Commander » : ajoute le produit puis ouvre le panier
function buyNow(id) {
  const product = findProduct(id);
  if (!product) return;

  if (product.premiumOnly && !account.isPremium()) {
    showToast("🔒 Réservé aux membres Premium");
    return;
  }

  addToCart(id);
  openCart();
}

function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const totalElement = document.getElementById("cart-total");
  const discountElement = document.getElementById("cart-discount");

  let totalQuantity = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Ton panier est vide.</p>";
  } else {
    cartItems.innerHTML = cart.map(item => {
      const product = findProduct(item.id);
      if (!product) return "";

      totalQuantity += item.quantity;
      const subtotal = product.price * item.quantity;

      return `
        <div class="cart-item">
          <p><strong>${product.icon} ${product.name}</strong></p>
          <p>${formatPrice(product.price)} × ${item.quantity}</p>
          <p>Sous-total : ${formatPrice(subtotal)}</p>
          <button onclick="changeQuantity(${product.id}, -1)">−</button>
          <button onclick="changeQuantity(${product.id}, 1)">+</button>
          <button onclick="removeFromCart(${product.id})">Supprimer</button>
        </div>
      `;
    }).join("");
  }

  const subtotal = getSubtotal();
  const discount = getDiscount(subtotal);

  const info = getDiscountInfo(subtotal);

  if (info.amount > 0 && cart.length > 0) {
    discountElement.innerHTML = `
      <p class="discount-line">
        ${info.label} (-${info.pct} %) : -${formatPrice(info.amount)}
        ${info.source === "promo" ? '<button class="link-btn" onclick="removePromo()">Retirer</button>' : ""}
      </p>
    `;
  } else {
    discountElement.innerHTML = "";
  }

  count.textContent = totalQuantity;

  const navBadge = document.getElementById("nav-cart-count");
  if (navBadge) {
    navBadge.textContent = totalQuantity;
    navBadge.hidden = totalQuantity === 0;
  }
  totalElement.textContent = formatPrice(subtotal - discount);
}

/* ---------- 8. COMMANDE WHATSAPP ---------- */
function checkoutCart() {
  if (cart.length === 0) {
    showToast("Ton panier est vide !");
    return;
  }

  const numeroWhatsApp = getWhatsAppNumber();

  if (numeroWhatsApp.length < 8 || numeroWhatsApp.length > 15) {
    alert("Vérifie ton numéro WhatsApp.");
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const city = document.getElementById("customer-city").value.trim();

  if (!name) {
    showToast("✏️ Entre ton nom avant de commander");
    document.getElementById("customer-name").focus();
    return;
  }

  let message = "Bonjour, je souhaite commander :\n\n";

  cart.forEach(item => {
    const product = findProduct(item.id);
    if (!product) return;

    message += `- ${product.name}\n`;
    if (product.includes) {
      const names = product.includes
        .map(id => findProduct(id))
        .filter(Boolean)
        .map(p => p.name);
      message += `Contenu : ${names.join(" + ")}\n`;
    }
    message += `Quantité : ${item.quantity}\n`;
    message += `Prix : ${formatPrice(product.price * item.quantity)}\n\n`;
  });

  const subtotal = getSubtotal();
  const discount = getDiscount(subtotal);

  const info = getDiscountInfo(subtotal);

  if (discount > 0) {
    message += `Sous-total : ${formatPrice(subtotal)}\n`;
    message += `${info.label} (-${info.pct} %) : -${formatPrice(discount)}\n`;
  }

  message += `TOTAL À PAYER : ${formatPrice(subtotal - discount)}\n\n`;
  message += `Nom : ${name}\n`;
  if (city) message += `Ville : ${city}\n`;
  if (account.user) message += `Email : ${account.user.email}\n`;
  if (account.isPremium()) message += `Statut : ⭐ Membre Premium (support prioritaire)\n`;

  // Code parrain (fonctions définies dans account.js) : valable pour la première commande
  if (typeof getActiveReferral === "function") {
    const referral = getActiveReferral();
    if (referral) {
      message += `Parrain : ${referral}\n`;
      consumeReferral();
    }
  }

  // Historique des commandes (fonction définie dans account.js)
  if (typeof saveOrder === "function") {
    saveOrder(
      cart
        .map(item => {
          const p = findProduct(item.id);
          return p ? { name: p.name, quantity: item.quantity } : null;
        })
        .filter(Boolean),
      subtotal - discount
    );
  }

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

/* ---------- 9. PRODUITS : AFFICHAGE ---------- */
function badgeHTML(product) {
  if (!product.badge) return "";
  const type = product.badge.toLowerCase();
  return `<span class="badge badge-${type}">${product.badge}</span>`;
}

const CART_ICON = `<svg class="cart-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.6 12.2a1 1 0 0 0 1 .8h9.1a1 1 0 0 0 1-.8L20.5 7H6"/></svg>`;

// Bouton d'achat : verrouillé pour les produits réservés aux membres Premium
function buyButtonHTML(product) {
  if (product.premiumOnly && !account.isPremium()) {
    return `<button class="buy locked" onclick="openPremium()">🔒 Réservé aux membres Premium</button>`;
  }

  return `<button class="buy" onclick="buyNow(${product.id})">${CART_ICON} Commander</button>`;
}

// Image du produit (avec le bandeau « Faso Digital Shop »), ou emoji si pas d'image
function coverHTML(product) {
  const hasImage = Boolean(product.image);
  const alt = escapeHTML(product.name).replace(/"/g, "&quot;");

  return `
    <div class="cover ${hasImage ? "has-img" : ""}">
      ${hasImage ? `<img src="${product.image}" alt="${alt}" loading="lazy"
        onerror="this.parentElement.classList.remove('has-img'); this.remove();">` : ""}
      <span class="cover-emoji">${product.icon}</span>
      <span class="cover-label"><b>FASO</b> DIGITAL<br><b>SHOP</b></span>
    </div>
  `;
}

// Affiche le prix, et pour un pack : son contenu et l'économie réalisée
function priceHTML(product) {
  if (!product.includes) {
    return `<div class="price">${formatPrice(product.price)}</div>`;
  }

  const items = product.includes.map(id => findProduct(id)).filter(Boolean);
  const normalPrice = items.reduce((sum, p) => sum + p.price, 0);
  const saving = normalPrice - product.price;

  return `
    <p class="pack-includes">🎁 Contient : ${items.map(p => p.name).join(" + ")}</p>
    <div class="price">
      <s class="old-price">${formatPrice(normalPrice)}</s>
      ${formatPrice(product.price)}
    </div>
    ${saving > 0 ? `<span class="saving">Tu économises ${formatPrice(saving)}</span>` : ""}
  `;
}

function displayProducts(list, emptyMessage) {
  viewingDetails = false;

  if (list.length === 0) {
    container.innerHTML = `<p class="empty">${emptyMessage || "Aucun produit disponible."}</p>`;
    return;
  }

  container.innerHTML = list.map(product => `
    <article class="product">
      ${badgeHTML(product)}
      ${favButtonHTML(product.id)}

      <div class="card-link" onclick="showDetails(${product.id})">
        ${coverHTML(product)}
        <h3>${product.name}</h3>
        <p class="desc">${product.description}</p>
      </div>

      ${priceHTML(product)}
      ${buyButtonHTML(product)}
    </article>
  `).join("");
}

function showDetails(id) {
  const product = findProduct(id);
  if (!product) return;

  viewingDetails = true;
  const locked = product.premiumOnly && !account.isPremium();

  container.innerHTML = `
    <article class="product details">
      ${badgeHTML(product)}
      ${favButtonHTML(product.id)}
      ${coverHTML(product)}

      <h2>${product.name}</h2>
      <p class="desc">${product.details}</p>

      ${priceHTML(product)}
      ${buyButtonHTML(product)}
      ${locked ? "" : `<button class="secondary-btn" onclick="addToCart(${product.id})">Ajouter au panier</button>`}

      <button class="share-btn" onclick="shareProduct(${product.id})">📤 Partager</button>
      <button class="secondary-btn" onclick="applyFilters()">← Retour aux produits</button>
    </article>
  `;

  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- 10. CATÉGORIES, TRI ET RECHERCHE ---------- */
function createCategoryButtons() {
  container.insertAdjacentHTML("beforebegin", `
    <div class="categories" id="categories">
      ${CATEGORIES.map(cat => `
        <button class="cat-btn ${cat === "Tous" ? "active" : ""}"
                data-category="${cat}"
                onclick="filterCategory('${cat}')">
          ${cat}
        </button>
      `).join("")}
    </div>

    <div class="toolbar">
      <select id="sort-select" onchange="changeSort(this.value)"
              aria-label="Trier les produits">
        <option value="default">Trier : par défaut</option>
        <option value="asc">Prix croissant</option>
        <option value="desc">Prix décroissant</option>
      </select>

      <button id="fav-filter" class="fav-filter" onclick="toggleFavFilter()">
        🤍 Mes favoris
      </button>
    </div>
  `);
}

function filterCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  applyFilters();
}

function changeSort(value) {
  currentSort = value;
  applyFilters();
}

function applyFilters() {
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const result = products.filter(p => {
    const matchCategory = currentCategory === "Tous" || p.category === currentCategory;
    const matchSearch =
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    const matchFav = !showFavsOnly || favorites.includes(p.id);

    return matchCategory && matchSearch && matchFav;
  });

  if (currentSort === "asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (currentSort === "desc") {
    result.sort((a, b) => b.price - a.price);
  }

  const emptyMessage = showFavsOnly
    ? "Tu n'as pas encore de favoris. Appuie sur 🤍 pour en ajouter."
    : undefined;

  displayProducts(result, emptyMessage);
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

/* ---------- 11. PAIEMENT MOBILE MONEY ---------- */
function createPaymentSection() {
  container.insertAdjacentHTML("afterend", `
    <section class="info-section" id="payment">
      <h2>💳 Comment payer ?</h2>
      <ol class="steps">
        <li>Ajoute tes produits au panier et clique sur « Commander sur WhatsApp ».</li>
        <li>Envoie le montant total à l'un des numéros ci-dessous.</li>
        <li>Envoie la capture du paiement sur WhatsApp.</li>
        <li>Reçois ton produit numérique directement sur WhatsApp.</li>
      </ol>

      <div class="payment-list">
        ${PAYMENTS.map(p => `
          <div class="payment-card">
            <strong>${p.name}</strong>
            <span>${p.number}</span>
            <small>${p.holder}</small>
          </div>
        `).join("")}
      </div>
    </section>
  `);
}

/* ---------- 12. TÉMOIGNAGES ---------- */
function createTestimonialsSection() {
  document.getElementById("payment").insertAdjacentHTML("afterend", `
    <section class="info-section" id="testimonials">
      <h2>⭐ Avis de nos clients</h2>
      <div class="testimonial-list">
        ${testimonials.map(t => `
          <div class="testimonial">
            <div class="stars">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</div>
            <p>« ${escapeHTML(t.text)} »</p>
            <strong>— ${escapeHTML(t.name)}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `);
}

/* ---------- 13. FAQ ---------- */
function createFaqSection() {
  document.getElementById("testimonials").insertAdjacentHTML("afterend", `
    <section class="info-section" id="faq">
      <h2>❓ Questions fréquentes</h2>
      ${faq.map(item => `
        <details class="faq-item">
          <summary>${escapeHTML(item.question)}</summary>
          <p>${escapeHTML(item.answer)}</p>
        </details>
      `).join("")}
    </section>
  `);
}

/* ---------- 13B. BARRE DE NAVIGATION (EN BAS) ---------- */
function createBottomNav() {
  document.body.insertAdjacentHTML("beforeend", `
    <nav class="bottom-nav" aria-label="Navigation principale">
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">
        <span class="nav-icon">🏠</span><span class="nav-label">Accueil</span>
      </button>
      <button onclick="openCart()">
        <span class="nav-icon">🛒<span class="nav-badge" id="nav-cart-count" hidden>0</span></span>
        <span class="nav-label">Panier</span>
      </button>
      <button onclick="openPremium()">
        <span class="nav-icon">⭐</span><span class="nav-label">Premium</span>
      </button>
      <button id="account-btn" onclick="openAccount()">
        <span class="nav-icon">👤</span><span class="nav-label">Compte</span>
      </button>
    </nav>
  `);
}

/* ---------- 14. BOUTON WHATSAPP FLOTTANT ---------- */
function createWhatsAppButton() {
  const message = "Bonjour, j'ai une question sur vos produits.";
  const url = `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;

  document.body.insertAdjacentHTML("beforeend", `
    <a class="whatsapp-float" href="${url}" aria-label="Discuter sur WhatsApp">
      💬
    </a>
  `);
}

/* ---------- 15. PWA : APPLICATION INSTALLABLE ---------- */
let installPrompt = null;

function setupPWA() {
  // Lien vers le manifest et couleur de la barre du navigateur
  const manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = "manifest.json";
  document.head.appendChild(manifest);

  const theme = document.createElement("meta");
  theme.name = "theme-color";
  theme.content = "#015022";
  document.head.appendChild(theme);

  // Service worker (fonctionne uniquement en HTTPS ou sur localhost)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(error => {
      console.warn("Service worker non enregistré.", error);
    });
  }

  // Bouton « Installer l'application »
  document.body.insertAdjacentHTML("beforeend", `
    <button id="install-btn" class="install-btn" hidden>
      📲 Installer l'application
    </button>
  `);

  const installBtn = document.getElementById("install-btn");

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    installBtn.hidden = false;
  });

  installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    installBtn.hidden = true;
    showToast("🎉 Application installée !");
  });
}

/* ---------- 16. DÉMARRAGE ---------- */
createThemeButton();
createCartSection();
createCategoryButtons();
displayProducts(products);
createPaymentSection();
createTestimonialsSection();
createFaqSection();
createWhatsAppButton();
createBottomNav();
displayCart();
setupPWA();
