import React, { useState } from "react";
import { FaBook, FaVideo, FaDownload, FaSearch, FaArrowRight, FaTimes, FaMoon, FaSun, FaGlobe } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Documentation.css";

function Documentation() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("docLanguage") || "hi";
  });

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
  };

  const handleLanguageToggle = () => {
    const newLang = language === "hi" ? "en" : "hi";
    setLanguage(newLang);
    localStorage.setItem("docLanguage", newLang);
  };

  const translations = {
    hi: {
      title: "📚 KisanConnect दस्तावेज़",
      subtitle: "आपके सभी सवालों के जवाब एक जगह",
      search: "अपना सवाल खोजें...",
      categories: "श्रेणियां",
      articles: "लेख",
      noResults: "कोई परिणाम नहीं मिला",
      tryAgain: "अपना सवाल फिर से दर्ज करने की कोशिश करें",
      question: "अभी भी सवाल है?",
      contact: "Margdarshak AI से पूछें या Support से संपर्क करें",
      email: "samjauritu@gmail.com",
      phone: "9919171589",
      team: "KisanConnect Team",
      members: "Ashish Kumar Singh, Abhishek Verma, Akriti Pandey",
      readMore: "और पढ़ें",
    },
    en: {
      title: "📚 KisanConnect Documentation",
      subtitle: "Answers to all your questions in one place",
      search: "Search your question...",
      categories: "Categories",
      articles: "articles",
      noResults: "No results found",
      tryAgain: "Try searching with different keywords",
      question: "Still have questions?",
      contact: "Ask Margdarshak AI or Contact Support",
      email: "samjauritu@gmail.com",
      phone: "9919171589",
      team: "KisanConnect Team",
      members: "Ashish Kumar Singh, Abhishek Verma, Akriti Pandey",
      readMore: "Read More",
    },
  };

  const categoryNames = {
    hi: {
      "getting-started": "शुरुआत करें",
      features: "सभी फीचर्स",
      "buyer-guide": "खरीदार गाइड",
      "farmer-guide": "किसान गाइड",
      "admin-guide": "एडमिन गाइड",
      faq: "FAQ",
    },
    en: {
      "getting-started": "Getting Started",
      features: "All Features",
      "buyer-guide": "Buyer Guide",
      "farmer-guide": "Farmer Guide",
      "admin-guide": "Admin Guide",
      faq: "FAQ",
    },
  };

  const categories = [
    { id: "getting-started", icon: "🚀" },
    { id: "features", icon: "✨" },
    { id: "buyer-guide", icon: "🛒" },
    { id: "farmer-guide", icon: "🌾" },
    { id: "admin-guide", icon: "⚙️" },
    { id: "faq", icon: "❓" },
  ];

  const docs = {
    "getting-started": [
      {
        title_hi: "KisanConnect क्या है?",
        title_en: "What is KisanConnect?",
        content_hi:
          "KisanConnect एक डिजिटल platform है जो किसानों और खरीदारों को सीधे जोड़ता है। यहाँ किसान अपनी फसलें बेच सकते हैं और खरीदार सीधे किसान से खरीद सकते हैं।",
        content_en: "KisanConnect is a digital platform that directly connects farmers and buyers. Here farmers can sell their crops and buyers can purchase directly from farmers.",
        icon: "📱",
      },
      {
        title_hi: "अकाउंट कैसे बनाएं?",
        title_en: "How to Create an Account?",
        content_hi: `
1. "Sign Up" बटन पर क्लिक करें
2. अपना ईमेल दर्ज करें
3. मजबूत पासवर्ड सेट करें
4. अपनी भूमिका चुनें (किसान/खरीदार/एडमिन)
5. स्वागत है! अब आप लॉगिन कर सकते हैं
        `,
        content_en: `
1. Click on "Sign Up" button
2. Enter your email
3. Set a strong password
4. Choose your role (Farmer/Buyer/Admin)
5. Welcome! Now you can login
        `,
        icon: "🔐",
      },
      {
        title_hi: "लॉगिन कैसे करें?",
        title_en: "How to Login?",
        content_hi: `
1. होमपेज पर जाएं
2. अपना ईमेल और पासवर्ड दर्ज करें
3. "Login" बटन पर क्लिक करें
4. आप अपने डैशबोर्ड पर पहुंच जाएंगे
        `,
        content_en: `
1. Go to homepage
2. Enter your email and password
3. Click "Login" button
4. You will be redirected to your dashboard
        `,
        icon: "🔑",
      },
      {
        title_hi: "प्रोफाइल को पूरा कैसे करें?",
        title_en: "How to Complete Your Profile?",
        content_hi: `
अपनी जानकारी भरें:
- पूरा नाम
- फोन नंबर
- पता (गाँव, जिला, राज्य)
- बैंक विवरण (खरीद-बिक्री के लिए)
- अपनी तस्वीर (optional)

यह आपकी विश्वसनीयता बढ़ाता है।
        `,
        content_en: `
Fill your information:
- Full Name
- Phone Number
- Address (Village, District, State)
- Bank Details (for transactions)
- Your Photo (optional)

This increases your credibility.
        `,
        icon: "👤",
      },
    ],
    features: [
      {
        title_hi: "डैशबोर्ड",
        title_en: "Dashboard",
        content_hi: `
आपके डैशबोर्ड पर:
- आपके सभी सक्रिय लिस्टिंग्स
- मार्केट की कीमतें
- आपके ऑर्डर्स
- बिक्री के आंकड़े
- Margdarshak AI चैट
        `,
        content_en: `
On your dashboard:
- All your active listings
- Market prices
- Your orders
- Sales statistics
- Margdarshak AI chat
        `,
        icon: "📊",
      },
      {
        title_hi: "Margdarshak AI - कृषि सलाहकार",
        title_en: "Margdarshak AI - Agricultural Advisor",
        content_hi: `
Margdarshak आपका AI कृषि सलाहकार है:
- फसलों की जानकारी लें
- बेहतर उपज के टिप्स
- बाजार की कीमतों का पूर्वानुमास
- खरपतवार और कीट नियंत्रण
- मौसम की जानकारी

बस अपना सवाल पूछें!
        `,
        content_en: `
Margdarshak is your AI agricultural advisor:
- Get crop information
- Better yield tips
- Market price forecasts
- Weed and pest control
- Weather information

Just ask your question!
        `,
        icon: "🤖",
      },
      {
        title_hi: "थीम सेटिंग्स",
        title_en: "Theme Settings",
        content_hi: `
अपनी पसंद के अनुसार थीम चुनें:
- Light Mode (सफेद background)
- Dark Mode (काली background, आँखों के लिए अच्छा)

हेडर के top-right में toggle बटन से बदलें।
        `,
        content_en: `
Choose a theme according to your preference:
- Light Mode (white background)
- Dark Mode (black background, good for eyes)

Change it with the toggle button in the header's top-right.
        `,
        icon: "🎨",
      },
      {
        title_hi: "नोटिफिकेशन्स",
        title_en: "Notifications",
        content_hi: `
नई updates के लिए नोटिफिकेशन पाएं:
- नया ऑर्डर मिले तो सूचना
- कीमत में बदलाव
- संदेश और ऑफर्स
- महत्वपूर्ण अपडेट्स

हेडर के bell icon से देखें।
        `,
        content_en: `
Get notifications for new updates:
- New order received
- Price changes
- Messages and offers
- Important updates

Check them from the bell icon in the header.
        `,
        icon: "🔔",
      },
    ],
    "buyer-guide": [
      {
        title_hi: "खरीदार डैशबोर्ड",
        title_en: "Buyer Dashboard",
        content_hi: `
खरीदार डैशबोर्ड पर आप देख सकते हैं:
- सभी उपलब्ध फसलें
- किसानों की सूची
- बाजार में क्या नया है
- आपके कुल ऑर्डर्स
- आपकी पसंदीदा चीजें
        `,
        content_en: `
On the buyer dashboard you can see:
- All available crops
- List of farmers
- What's new in the market
- Your total orders
- Your favorites
        `,
        icon: "🛍️",
      },
      {
        title_hi: "फसल कैसे खरीदें?",
        title_en: "How to Buy Crops?",
        content_hi: `
1. डैशबोर्ड पर "Available Crops" देखें
2. जो फसल चाहिए उस पर क्लिक करें
3. किसान की जानकारी देखें
4. कीमत, मात्रा, गुणवत्ता check करें
5. "Order Now" बटन दबाएं
6. डिलीवरी एड्रेस दें
7. पेमेंट करें - तैयार!

किसान आपसे contact करेगा।
        `,
        content_en: `
1. View "Available Crops" on the dashboard
2. Click on the crop you want
3. Check farmer's information
4. Verify price, quantity, and quality
5. Press "Order Now" button
6. Provide delivery address
7. Make payment - Done!

The farmer will contact you.
        `,
        icon: "🌾",
      },
      {
        title_hi: "किसानों से संपर्क करें",
        title_en: "Contact Farmers",
        content_hi: `
किसी किसान से सीधे बात करने के लिए:
1. Farmer List में जाएं
2. जो किसान पसंद हो उसे चुनें
3. उसकी profile देखें
4. फोन नंबर से सीधे call करें
5. या app में message भेजें

सीधी बातचीत सबसे अच्छा deal सुनिश्चित करती है।
        `,
        content_en: `
To talk directly to a farmer:
1. Go to Farmer List
2. Choose the farmer you like
3. View their profile
4. Call directly from phone number
5. Or send a message in the app

Direct communication ensures the best deals.
        `,
        icon: "📞",
      },
      {
        title_hi: "मेरे ऑर्डर्स",
        title_en: "My Orders",
        content_hi: `
अपने सभी ऑर्डर्स को एक जगह देखें:
- Pending ऑर्डर्स
- Confirmed ऑर्डर्स
- Delivered ऑर्डर्स
- Cancelled ऑर्डर्स

हर ऑर्डर का status real-time update होता है।
        `,
        content_en: `
View all your orders in one place:
- Pending orders
- Confirmed orders
- Delivered orders
- Cancelled orders

Every order status is updated in real-time.
        `,
        icon: "📦",
      },
    ],
    "farmer-guide": [
      {
        title_hi: "किसान डैशबोर्ड",
        title_en: "Farmer Dashboard",
        content_hi: `
आपके किसान डैशबोर्ड पर:
- आपकी सभी फसलें
- आपकी कुल बिक्री
- कुल earnings
- खरीदारों की सूची
- बाजार की कीमतें
        `,
        content_en: `
On your farmer dashboard:
- All your crops
- Your total sales
- Total earnings
- List of buyers
- Market prices
        `,
        icon: "🚜",
      },
      {
        title_hi: "फसल कैसे जोड़ें?",
        title_en: "How to Add Crops?",
        content_hi: `
अपनी फसल बेचने के लिए:
1. Dashboard में "Add Crop" बटन दबाएं
2. फसल का नाम लिखें (धान, गेहूँ, etc)
3. फसल की किस्म चुनें
4. कितनी मात्रा है (बोरी में या किग्रा में)
5. कीमत तय करें (प्रति किग्रा)
6. फसल की तस्वीर लगाएं
7. गुणवत्ता की जानकारी दें
8. "Post Crop" बटन दबाएं

अब सभी खरीदार देख सकते हैं!
        `,
        content_en: `
To sell your crop:
1. Click "Add Crop" button on Dashboard
2. Write crop name (Rice, Wheat, etc)
3. Choose crop variety
4. Specify quantity (bags or kg)
5. Set price (per kg)
6. Upload crop photo
7. Provide quality information
8. Click "Post Crop" button

Now all buyers can see it!
        `,
        icon: "➕",
      },
      {
        title_hi: "कीमत कैसे तय करें?",
        title_en: "How to Set Price?",
        content_hi: `
सही कीमत लगाने के लिए:
1. Dashboard में Market Prices देखें
2. अपनी फसल की quality check करें
3. Competition check करें (अन्य किसान कितने में बेच रहे हैं)
4. Margdarshak AI से सलाह लें
5. थोड़ा competitive रहें ताकि खरीदार attract हों

टिप्स: अच्छी quality = अच्छी कीमत!
        `,
        content_en: `
To set the right price:
1. Check Market Prices on Dashboard
2. Check your crop's quality
3. Check competition (what other farmers are selling at)
4. Take advice from Margdarshak AI
5. Stay slightly competitive to attract buyers

Tip: Good quality = Good price!
        `,
        icon: "💰",
      },
      {
        title_hi: "ऑर्डर्स को Manage करें",
        title_en: "Manage Orders",
        content_hi: `
जब कोई ऑर्डर आए:
1. Notification मिलेगा
2. "My Orders" section में देखें
3. खरीदार की जानकारी देखें
4. "Accept" या "Reject" करें
5. Accepted order को pack करें
6. Delivery के लिए तैयार करें
7. खरीदार को update दें

सही service = अच्छे reviews!
        `,
        content_en: `
When you receive an order:
1. You'll get a notification
2. Check "My Orders" section
3. View buyer's information
4. "Accept" or "Reject"
5. Pack the accepted order
6. Prepare for delivery
7. Update the buyer

Good service = Good reviews!
        `,
        icon: "📋",
      },
      {
        title_hi: "Margdarshak से सलाह लें",
        title_en: "Get Advice from Margdarshak",
        content_hi: `
कृषि के किसी भी सवाल के लिए:
- "कौन सी फसल अभी बोऊँ?"
- "इस कीट से कैसे बचूँ?"
- "बेहतर उपज के लिए क्या करूँ?"
- "मिट्टी की कमी कैसे दूर करूँ?"

Margdarshak तुरंत जवाब देगा!
        `,
        content_en: `
For any agriculture question:
- "Which crop should I plant now?"
- "How to prevent this pest?"
- "What to do for better yield?"
- "How to fix soil deficiency?"

Margdarshak will answer instantly!
        `,
        icon: "🌱",
      },
    ],
    "admin-guide": [
      {
        title_hi: "एडमिन डैशबोर्ड",
        title_en: "Admin Dashboard",
        content_hi: `
एडमिन के पास पूरा control है:
- सभी किसान देखें
- सभी खरीदार देखें
- सभी फसलें manage करें
- सभी ऑर्डर्स track करें
- Analytics देखें
- Users को remove कर सकते हैं
        `,
        content_en: `
Admin has full control:
- View all farmers
- View all buyers
- Manage all crops
- Track all orders
- View analytics
- Remove users
        `,
        icon: "👨‍💼",
      },
      {
        title_hi: "किसानों को Manage करें",
        title_en: "Manage Farmers",
        content_hi: `
Farmers section में:
- नए किसानों को verify करें
- उनकी profile check करें
- Fake farmers को block करें
- कुल किसानों की संख्या देखें
- उनकी फसलों की जानकारी देखें

Quality control बहुत जरूरी है!
        `,
        content_en: `
In Farmers section:
- Verify new farmers
- Check their profile
- Block fake farmers
- See total farmers count
- View their crops information

Quality control is very important!
        `,
        icon: "👨‍🌾",
      },
      {
        title_hi: "खरीदारों को Manage करें",
        title_en: "Manage Buyers",
        content_hi: `
Buyers section में:
- नए खरीदारों को देखें
- उनकी पहचान verify करें
- Problem buyers को block करें
- Total buyers का data देखें
- उनकी purchase history देखें
        `,
        content_en: `
In Buyers section:
- View new buyers
- Verify their identity
- Block problematic buyers
- View total buyers data
- See their purchase history
        `,
        icon: "👥",
      },
      {
        title_hi: "फसलों की निगरानी",
        title_en: "Monitor Crops",
        content_hi: `
Crops section में:
- सभी listed फसलें देखें
- असली फसलें confirm करें
- Fake या spam फसलें remove करें
- Prices में गड़बड़ी देखें
- फसलों की analytics

Platform की credibility इसी पर निर्भर है!
        `,
        content_en: `
In Crops section:
- View all listed crops
- Confirm genuine crops
- Remove fake or spam crops
- Check for price anomalies
- View crop analytics

Platform credibility depends on this!
        `,
        icon: "🌾",
      },
      {
        title_hi: "Analytics देखें",
        title_en: "View Analytics",
        content_hi: `
Dashboard में analytics:
- कुल users, किसान, खरीदार
- कुल ऑर्डर्स
- कुल बिक्री की रकम
- सबसे लोकप्रिय फसलें
- Monthly growth
- Region-wise data
        `,
        content_en: `
Analytics on Dashboard:
- Total users, farmers, buyers
- Total orders
- Total sales amount
- Most popular crops
- Monthly growth
- Region-wise data
        `,
        icon: "📈",
      },
    ],
    faq: [
      {
        title_hi: "क्या यह app safe है?",
        title_en: "Is this app safe?",
        content_hi: `
हाँ! हम आपकी सुरक्षा को सबसे ज्यादा अहमियत देते हैं:
- आपका डेटा encrypted है
- पासवर्ड secure हैं
- Payment gateway secure है
- Personal details safe रहते हैं

हमेशा अपना पासवर्ड किसी से share न करें।
        `,
        content_en: `
Yes! We prioritize your security:
- Your data is encrypted
- Passwords are secure
- Payment gateway is secure
- Personal details are safe

Never share your password with anyone.
        `,
        icon: "🔒",
      },
      {
        title_hi: "Order cancel कैसे करूँ?",
        title_en: "How to Cancel an Order?",
        content_hi: `
Order को cancel करने के लिए:
1. "My Orders" section जाएं
2. जो order cancel करना है उसे चुनें
3. "Cancel Order" बटन दबाएं
4. Reason बताएं
5. Confirm करें

Note: Accepted order को cancel करने पर charges लग सकते हैं।
        `,
        content_en: `
To cancel an order:
1. Go to "My Orders" section
2. Select the order to cancel
3. Click "Cancel Order" button
4. Provide reason
5. Confirm

Note: Cancelling accepted orders may incur charges.
        `,
        icon: "❌",
      },
      {
        title_hi: "Payment कैसे करते हैं?",
        title_en: "How to Make Payment?",
        content_hi: `
हम secure payment methods support करते हैं:
- Credit/Debit Card
- Net Banking
- UPI
- Digital Wallets

सभी payments secure gateway से होते हैं। Money directly seller को जाता है।
        `,
        content_en: `
We support secure payment methods:
- Credit/Debit Card
- Net Banking
- UPI
- Digital Wallets

All payments go through secure gateway. Money goes directly to seller.
        `,
        icon: "💳",
      },
      {
        title_hi: "Delivery कितने दिन में होगी?",
        title_en: "How Many Days for Delivery?",
        content_hi: `
Delivery का समय depend करता है:
- Location distance पर
- Seller की availability पर
- Order की quantity पर

आमतौर पर 3-7 दिन लगते हैं। हर order का tracking available है।
        `,
        content_en: `
Delivery time depends on:
- Distance of location
- Seller's availability
- Order quantity

Usually takes 3-7 days. Tracking available for every order.
        `,
        icon: "🚚",
      },
      {
        title_hi: "Problem होने पर क्या करूँ?",
        title_en: "What to do if there's a Problem?",
        content_hi: `
अगर कोई समस्या हो:
1. Contact करने की कोशिश करें (seller से या support को)
2. Screenshot/Evidence save रखें
3. Complaint file करें app में
4. Support team मदद करेगा

हम सभी issues को seriously लेते हैं।
        `,
        content_en: `
If you face a problem:
1. Try contacting (seller or support)
2. Save screenshots/evidence
3. File complaint in the app
4. Support team will help

We take all issues seriously.
        `,
        icon: "🆘",
      },
      {
        title_hi: "App use करने के लिए कोई fee है?",
        title_en: "Is there any fee to use the app?",
        content_hi: `
नहीं! KisanConnect बिल्कुल FREE है:
- Farmer = बिना किसी cost के अपनी फसल list कर सकते हैं
- Buyer = बिना किसी charges के खरीद सकते हैं
- Admin = सिर्फ system manage करते हैं

हम commission या कोई hidden charges नहीं लेते।
        `,
        content_en: `
No! KisanConnect is completely FREE:
- Farmers = Can list crops without any cost
- Buyers = Can purchase without any charges
- Admin = Only manage the system

We don't take commission or hidden charges.
        `,
        icon: "🆓",
      },
    ],
  };

  const filteredDocs = docs[activeCategory]?.filter((doc) =>
    doc.title_hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content_hi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content_en.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="documentation-container">
      {/* Header */}
      <div className="doc-header">
        <div className="doc-header-content">
          <div className="doc-header-actions">
            <button 
              className="doc-language-btn"
              onClick={handleLanguageToggle}
              title="Toggle Language"
            >
              <FaGlobe /> {language.toUpperCase()}
            </button>
            <button 
              className="doc-theme-btn"
              onClick={handleThemeToggle}
              title="Toggle Theme"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button 
              className="doc-close-btn"
              onClick={() => navigate(-1)}
              title="Close Documentation"
            >
              <FaTimes />
            </button>
          </div>
          <h1>{translations[language].title}</h1>
          <p>{translations[language].subtitle}</p>

          {/* Search Bar */}
          <div className="doc-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={translations[language].search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="doc-search-input"
            />
          </div>
        </div>
      </div>

      <div className="doc-content-wrapper">
        {/* Sidebar Categories */}
        <div className="doc-sidebar">
          <h3>{translations[language].categories}</h3>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`doc-category-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{categoryNames[language][cat.id]}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="doc-main">
          <div className="doc-category-header">
            <h2>{categoryNames[language][activeCategory]}</h2>
            <p className="doc-count">{filteredDocs.length} {translations[language].articles}</p>
          </div>

          {filteredDocs.length > 0 ? (
            <div className="doc-cards-grid">
              {filteredDocs.map((doc, index) => (
                <div key={index} className="doc-card">
                  <div className="doc-card-icon">{doc.icon}</div>
                  <h3 className="doc-card-title">{language === "hi" ? doc.title_hi : doc.title_en}</h3>
                  <p className="doc-card-content">{language === "hi" ? doc.content_hi : doc.content_en}</p>
                  <div className="doc-card-footer">
                    <a href="#" className="doc-read-more">
                      {translations[language].readMore} <FaArrowRight />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="doc-no-results">
              <p>❌ {translations[language].noResults}</p>
              <p className="small">{translations[language].tryAgain}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="doc-footer">
        <div className="doc-footer-content">
          <div className="footer-section">
            <h4>❓ {translations[language].question}</h4>
            <p>{translations[language].contact}</p>
          </div>
          <div className="footer-section">
            <h4>📧 Support</h4>
            <p>{translations[language].email}</p>
          </div>
          <div className="footer-section">
            <h4>📱 Phone</h4>
            <p>{translations[language].phone}</p>
          </div>
          <div className="footer-section">
            <h4>👥 {translations[language].team}</h4>
            <p>Ashish Kumar Singh</p>
            <p>Abhishek Verma</p>
            <p>Akriti Pandey</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;
