// Ganti nomor ini dengan nomor WhatsApp toko dalam format internasional tanpa tanda + atau spasi.
const WHATSAPP_NUMBER = "6281234567890";
const whatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll("[data-wa]").forEach((link) => {
  link.href = whatsappUrl(link.dataset.wa);
  link.target = "_blank";
  link.rel = "noopener";
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Buka menu");
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const heroBikeImage = document.querySelector("#heroBikeImage");
const heroPhotoLabel = document.querySelector("#heroPhotoLabel");
const spotlightTitle = document.querySelector("#spotlightTitle");
const spotlightDescription = document.querySelector("#spotlightDescription");
const bikeHint = document.querySelector("#bikeHint");
const variantCards = [...document.querySelectorAll(".variant-card")];
let selectedBike = "KLX";

variantCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedBike = card.dataset.bike;

    variantCards.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === card));
    });

    heroBikeImage.src = card.dataset.image;
    heroBikeImage.alt = `Foto ilustrasi motor ${selectedBike}`;
    heroPhotoLabel.textContent = card.dataset.photoLabel;
    spotlightTitle.textContent = selectedBike;
    spotlightDescription.textContent = `${card.dataset.photoLabel} • foto ilustrasi, bukan foto resmi varian.`;
    bikeHint.textContent = `${selectedBike} dipilih • konfirmasi kecocokan produk sebelum order.`;

    document.querySelectorAll(".product [data-wa]").forEach((link) => {
      link.href = whatsappUrl(
        `${link.dataset.wa} Tipe motor: ${selectedBike}. Mohon konfirmasi kecocokan.`,
      );
    });
  });
});

const productDialog = document.querySelector("#productDialog");
const dialogCategoryLabel = document.querySelector("#dialogCategory");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogDescription = document.querySelector("#dialogDescription");
const dialogFitment = document.querySelector("#dialogFitment");
const dialogOrder = document.querySelector("#dialogOrder");
let dialogCategory = "all";

document.querySelectorAll("[data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.closest(".product");
    dialogCategory = product.dataset.category;
    dialogCategoryLabel.textContent = `${product.dataset.category} • contoh produk`;
    dialogTitle.textContent = product.dataset.product;
    dialogDescription.textContent = product.dataset.description;
    dialogFitment.textContent = `Kecocokan ${selectedBike} belum dikonfirmasi. Sampaikan tipe lengkap dan tahun motor saat menghubungi toko.`;
    dialogOrder.href = whatsappUrl(
      `Halo Tunggal Motor 27, saya ingin tanya ${product.dataset.product}. Motor: ${selectedBike}. Mohon konfirmasi harga, stok, dan kecocokan.`,
    );
    productDialog.showModal();
  });
});

document
  .querySelector(".product-dialog__close")
  .addEventListener("click", () => productDialog.close());

productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) {
    productDialog.close();
  }
});

document.querySelector("#dialogCatalog").addEventListener("click", () => {
  productDialog.close();
  document
    .querySelector(`.filter[data-filter="${dialogCategory}"]`)
    ?.click();
  document.querySelector("#produk").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".product").forEach((product) => {
  product.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const bounds = product.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    product.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${y * -5}deg) translateY(-3px)`;
  });

  product.addEventListener("pointerleave", () => {
    product.style.transform = "";
  });
});

const filterButtons = [...document.querySelectorAll(".filter")];
const products = [...document.querySelectorAll(".product")];
const searchInput = document.querySelector(".search");
let activeCategory = "all";

function updateProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  products.forEach((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      product.dataset.category === activeCategory;
    const matchesSearch = product.dataset.name.includes(searchTerm);

    product.hidden = !(matchesCategory && matchesSearch);
  });
}

function selectCategory(category) {
  activeCategory = category;

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === activeCategory),
    );
  });

  updateProducts();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectCategory(button.dataset.filter);
  });
});

searchInput.addEventListener("input", updateProducts);

document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    selectCategory(link.dataset.categoryLink);
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
