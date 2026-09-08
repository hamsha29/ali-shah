// Configuration (EDIT THESE VALUES)
const GAME_CONFIG = {
  name: "MY GAME",
  tagline: "Enter the Darkness. Master the Game.",
  prices: {
    standard: 1000,
    deluxe: 1500,
    ultimate: 2000
  },
  version: "1.0.0",
  assets: {
    hero: "assets/hero.jpg",
    screenshot1: "assets/screenshot1.jpg",
    screenshot2: "assets/screenshot2.jpg",
    screenshot3: "assets/screenshot3.jpg",
    logo: "assets/logo.svg"
  },
  // After "payment" complete, redirect to confirmation page with this simulated download link (edit to your real link)
  downloadLink: "https://example.com/download/my-game.zip"
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupEventHandlers();
});

function applyConfig(){
  // Price displays
  document.getElementById("heroPrice").textContent = GAME_CONFIG.prices.standard.toLocaleString();
  document.getElementById("heroPriceInline").textContent = GAME_CONFIG.prices.standard.toLocaleString();
  document.getElementById("productPrice").textContent = GAME_CONFIG.prices.standard.toLocaleString();
  document.querySelectorAll(".price-val").forEach(el=>{
    // match which card by reading nearest content - fallback to standard
    const p = el.closest(".card");
    if(p && p.querySelector("h3")){
      const title = p.querySelector("h3").textContent.toLowerCase();
      if(title.includes("standard")) el.textContent = GAME_CONFIG.prices.standard.toLocaleString();
      if(title.includes("deluxe")) el.textContent = GAME_CONFIG.prices.deluxe.toLocaleString();
      if(title.includes("ultimate")) el.textContent = GAME_CONFIG.prices.ultimate.toLocaleString();
    }
  });

  // Version
  document.getElementById("versionLabel").textContent = GAME_CONFIG.version;

  // Images (try to set but keep fallback)
  document.querySelectorAll("img").forEach(img=>{
    if(img.getAttribute("src") && img.getAttribute("src").includes("assets/")){
      // noop - user can replace images in assets/ folder
    }
  });

  // Logo fallback
  const logoImgs = document.querySelectorAll(".logo, .logo-small");
  logoImgs.forEach(i => i.src = GAME_CONFIG.assets.logo || i.src);
}

// --- Modal & Checkout logic ---
const modal = document.getElementById("checkoutModal");
const closeModalBtn = document.getElementById("closeModal");

function setupEventHandlers(){
  // Buy buttons open modal, prefill price & edition
  document.querySelectorAll(".btn-buy").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const edition = btn.dataset.edition || "Standard";
      const price = parseInt(btn.dataset.price || GAME_CONFIG.prices.standard);
      openCheckoutModal(edition, price);
    });
  });

  document.getElementById("buyNowTop").addEventListener("click", ()=>openCheckoutModal("Standard", GAME_CONFIG.prices.standard));
  document.getElementById("buyNowHero").addEventListener("click", ()=>openCheckoutModal("Standard", GAME_CONFIG.prices.standard));
  document.getElementById("buyNowProduct").addEventListener("click", ()=>openCheckoutModal("Standard", GAME_CONFIG.prices.standard));

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });

  // Contact form handler uses simple client-side simulation
  window.handleContactSubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    alert("Thanks " + name + "! Your message was received. We'll reply at " + email + ".");
    document.getElementById("contactForm").reset();
    return false;
  };

  // Checkout submit
  window.handleCheckout = (e) => {
    e.preventDefault();
    // Collect info
    const name = document.getElementById("custName").value;
    const email = document.getElementById("custEmail").value;
    const payment = document.querySelector('input[name="payMethod"]:checked').value;
    // Simulate payment processing...
    // For a real integration: call your backend to create a payment order (Easypaisa/JazzCash/Bank transfer)
    // Then verify payment and generate/download link + receipt.
    // Here we redirect to confirmation.html with simulated params
    const price = document.getElementById("checkoutPrice").textContent || GAME_CONFIG.prices.standard;
    const params = new URLSearchParams({
      name, email, payment, price, edition: document.getElementById("checkoutEdition").textContent
    });
    // Use session storage to pass the download link & config (simpler than implementing a server)
    sessionStorage.setItem("downloadLink", GAME_CONFIG.downloadLink);
    closeModal();
    // Redirect to confirmation page
    window.location.href = "confirmation.html?" + params.toString();
    return false;
  };
}

function openCheckoutModal(edition, price){
  modal.setAttribute("aria-hidden","false");
  document.getElementById("checkoutEdition").textContent = edition + " • PKR " + price.toLocaleString();
  document.getElementById("checkoutPrice").textContent = price.toLocaleString();
  document.getElementById("payNowPrice").textContent = price.toLocaleString();
  // Scroll into view / focus first input
  setTimeout(()=>document.getElementById("custName").focus(),100);
}

function closeModal(){
  modal.setAttribute("aria-hidden","true");
}

/* Optional: smooth-scrolling for in-page links */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", (e)=>{
    const target = document.querySelector(a.getAttribute("href"));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth",block:"start"}); }
  })
});
