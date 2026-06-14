/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "gotap-95a12-firebase-adminsdk-fbsvc-fc78d18130.json"));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore();

const testProfile = {
  name: "John Anderson",
  displayName: "John",
  logo: "",
  theme: "classic-executive",
  active: true,
  productType: "digital-cards",
  links: {
    instagram: "https://instagram.com/john.anderson",
    facebook: "https://facebook.com/john.anderson",
    tiktok: "https://tiktok.com/@john.anderson",
    snapchat: "https://snapchat.com/add/john.anderson",
    whatsapp: "https://wa.me/201095976766",
    phoneSocial: "tel:+201095976766",
  },
  digitalCardsFields: {
    website: "https://johnanderson.com",
    googleMaps: "https://maps.app.goo.gl/example",
    linkedin: "https://linkedin.com/company/johnanderson",
    email: "mailto:john@johnanderson.com",
  },
  createdAt: FieldValue.serverTimestamp(),
};

const testProfile2 = {
  name: "Speed Garage",
  logo: "",
  theme: "carbon-track",
  active: true,
  productType: "auto-tap",
  links: {
    instagram: "https://instagram.com/speedgarage",
    facebook: "https://facebook.com/speedgarage",
    tiktok: "https://tiktok.com/@speedgarage",
    snapchat: "https://snapchat.com/add/speedgarage",
    whatsapp: "https://wa.me/201095976766",
    phoneSocial: "tel:+201095976766",
  },
  autoTapFields: {
    profileType: "single",
    logoWidthCm: "35",
    addressDetail: "Cairo, Egypt",
    selectedPlatform: "instagram",
    singlePlatformValue: "speedgarage",
  },
  createdAt: FieldValue.serverTimestamp(),
};

const testProfile3 = {
  name: "Cafe Roma",
  logo: "",
  theme: "modern-bistro",
  active: true,
  productType: "business-tap",
  links: {
    instagram: "https://instagram.com/caferoma",
    facebook: "https://facebook.com/caferoma",
    tiktok: "https://tiktok.com/@caferoma",
    snapchat: "https://snapchat.com/add/caferoma",
    whatsapp: "https://wa.me/201095976766",
    phoneSocial: "tel:+201095976766",
  },
  businessTapFields: {
    establishmentName: "Cafe Roma Downtown",
    quantity: 50,
    menuLink: "https://caferoma.com/menu",
    googleReviews: "https://g.page/r/example123",
    onlineOrdering: "https://order.caferoma.com",
  },
  createdAt: FieldValue.serverTimestamp(),
};

async function seed() {
  try {
    await db.collection("profiles").doc("test-profile-1").set(testProfile);
    console.log("✅ test-profile-1 (Classic Luxury / Digital Cards) inserted");

    await db.collection("profiles").doc("test-profile-2").set(testProfile2);
    console.log("✅ test-profile-2 (Sporty Carbon / Auto Tap) inserted");

    await db.collection("profiles").doc("test-profile-3").set(testProfile3);
    console.log("✅ test-profile-3 (Minimalist Clean / Business Tap) inserted");

    console.log("\n🎉 All 3 test profiles seeded successfully!");
    console.log("\nVisit these after starting the dev server:");
    console.log("  http://localhost:3000/en/user/test-profile-1");
    console.log("  http://localhost:3000/en/user/test-profile-2");
    console.log("  http://localhost:3000/en/user/test-profile-3");
    console.log("  http://localhost:3000/ar/user/test-profile-1 (Arabic)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
