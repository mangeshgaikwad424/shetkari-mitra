import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { useChat } from "../context/ChatContext";
import { LanguageContext } from "../context/LanguageContext";

const CONTACT_STYLES = {
  tractor: { bg: "#fef9c3", text: "#92400e", icon: "🚜" },
  labour: { bg: "#ffedd5", text: "#9a3412", icon: "👷" },
  farmer: { bg: "#dcfce7", text: "#15803d", icon: "🌾" },
};

const BOOKING_STATUS_STYLES = {
  pending: { bg: "#fef9c3", text: "#92400e" },
  accepted: { bg: "#dcfce7", text: "#15803d" },
  rejected: { bg: "#fee2e2", text: "#b91c1c" },
};

export default function FarmerDashboard() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const mr = lang === "mr";
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const copy = mr
    ? {
        dashboard: "डॅशबोर्ड",
        hireTractor: "ट्रॅक्टर मिळवा",
        hireLabour: "मजूर मिळवा",
        myBookings: "माझे बुकिंग",
        earnings: "कमाई",
        schemes: "शासकीय योजना",
        cropDoctor: "पीक डॉक्टर",
        messages: "संदेश",
        notifications: "सूचना",
        profile: "प्रोफाईल",
        settings: "सेटिंग्ज",
        farmer: "शेतकरी",
        goHome: "मुख्य पानावर जा",
        logout: "लॉगआउट",
        welcomeBack: "पुन्हा स्वागत आहे,",
        maharashtra: "महाराष्ट्र",
        india: "भारत",
        homePage: "मुख्य पान",
        activeListings: "सक्रिय सेवा",
        totalEarnings: "एकूण कमाई",
        schemeBenefits: "योजना लाभ",
        earningsOverview: "कमाईचा आढावा",
        thisMonth: "या महिन्यात",
        lastMonth: "मागील महिन्यात",
        lastThreeMonths: "गेल्या ३ महिन्यांत",
        quickActions: "जलद कृती",
        alertsTips: "सतर्कता आणि टिपा",
        upcomingBookings: "आगामी बुकिंग",
        viewAll: "सर्व पहा →",
        recentActivity: "अलीकडील क्रियाकलाप",
        topServices: "प्रसिद्ध सेवा",
        availableTractors: "उपलब्ध ट्रॅक्टर्स",
        tractorIntro: "ट्रॅक्टर मालकांनी जोडलेले नवीन ट्रॅक्टर्स इथे दिसतील.",
        refreshTractors: "ताजे ट्रॅक्टर्स रिफ्रेश करा",
        available: "उपलब्ध",
        contactUnavailable: "माहिती उपलब्ध नाही",
        bookNow: "आता बुक करा",
        messageOwner: "संदेश पाठवा",
        availableLabour: "उपलब्ध मजूर",
        labourIntro: "शेतातील कामासाठी उपलब्ध मजूर इथे दिसतील.",
        refreshLabour: "ताजे मजूर रिफ्रेश करा",
        hireNow: "आता भाड्याने घ्या",
        noTractors: "आत्ता कोणतेही ट्रॅक्टर्स उपलब्ध नाहीत.",
        noLabour: "आत्ता कोणतेही मजूर उपलब्ध नाहीत.",
        noBookings: "अजून बुकिंग नाही. सुरुवात करण्यासाठी ट्रॅक्टर किंवा मजूर बुक करा.",
        noNotifications: "अजून सूचना नाहीत. सुरुवात करण्यासाठी ट्रॅक्टर किंवा मजूर बुक करा.",
        browseTractors: "ट्रॅक्टर्स पाहा",
        bookingConfirmed: "बुकिंग मंजूर झाले. ठरलेल्या दिवशी या.",
        ownerPhone: "मालकाचा फोन",
        bookingPending: "प्रलंबित",
        bookingAccepted: "मंजूर",
        bookingRejected: "नाकारले",
        bookingAcceptedShort: "मंजूर",
        byOwner: "मालक",
        tractorOwner: "ट्रॅक्टर मालक",
        labourProvider: "मजूर पुरवठादार",
        earningsReport: "कमाईचा अहवाल",
        totalEarned: "एकूण कमाई",
        recentTransactions: "अलीकडील व्यवहार",
        received: "मिळाले",
        paid: "दिले",
        myProfile: "माझे प्रोफाईल",
        totalBookings: "एकूण बुकिंग",
        activeSince: "सक्रिय वर्ष",
        village: "गाव",
        na: "माहिती नाही",
        comingSoon: "हा विभाग लवकरच उपलब्ध होईल.",
        bookLabel: "बुक करा",
        ownerLabel: "मालक",
        selectDate: "तारीख निवडा",
        messageOptional: "संदेश (ऐच्छिक)",
        specialRequirements: "काही विशेष आवश्यकता असल्यास लिहा...",
        cancel: "रद्द करा",
        sendRequest: "विनंती पाठवा",
        bookingRequestSent: "बुकिंग विनंती यशस्वीरीत्या पाठवली! 🎉",
        unread: "न वाचलेले",
        chatTitle: "ट्रॅक्टर मालक किंवा मजुरांशी बोला",
        chatSubtitle: "बुकिंग, उपलब्धता, किंमत आणि येण्याची वेळ याबद्दल थेट चर्चा करा.",
        searchContacts: "संपर्क शोधा...",
        allContacts: "सर्व संपर्क",
        contactRoleTractor: "ट्रॅक्टर मालक",
        contactRoleLabour: "मजूर पुरवठादार",
        contactRoleFarmer: "शेतकरी",
        noContacts: "कोणताही संपर्क सापडला नाही",
        startConversation: "संभाषण सुरू करा",
        startConversationDesc: "डावीकडून संपर्क निवडा किंवा ट्रॅक्टर आणि मजूर कार्डमधून थेट संदेश उघडा.",
        noMessagesYet: "अजून संदेश नाहीत",
        noMessagesHint: "किंमत, उपलब्धता किंवा भेटीची वेळ विचारण्यासाठी पहिला संदेश पाठवा.",
        typeMessage: "संदेश टाइप करा...",
        tapToMessage: "संदेशासाठी संपर्क निवडा",
        tapToMessageDesc: "ट्रॅक्टर मालक किंवा मजूर पुरवठादाराशी चॅट सुरू करण्यासाठी एक संपर्क निवडा.",
        openMessages: "संदेश उघडा",
        languageButton: "English",
        roleFarmerBadge: "🌾 शेतकरी",
        kharifTip: "खरीप पेरणी हंगाम १ जूनपासून सुरू होत आहे",
        mspTip: "गव्हाच्या हमीभावात ८% वाढ",
        pmKisanTip: "पंतप्रधान किसान योजनेचा नवीन हप्ता जुलैमध्ये अपेक्षित",
      }
    : {
        dashboard: "Dashboard",
        hireTractor: "Hire Tractor",
        hireLabour: "Hire Labour",
        myBookings: "My Bookings",
        earnings: "Earnings",
        schemes: "Govt Schemes",
        cropDoctor: "Crop Doctor",
        messages: "Messages",
        notifications: "Notifications",
        profile: "Profile",
        settings: "Settings",
        farmer: "Farmer",
        goHome: "Go to Home Page",
        logout: "Logout",
        welcomeBack: "Welcome back,",
        maharashtra: "Maharashtra",
        india: "India",
        homePage: "Home Page",
        activeListings: "Active Listings",
        totalEarnings: "Total Earnings",
        schemeBenefits: "Scheme Benefits",
        earningsOverview: "Earnings Overview",
        thisMonth: "This Month",
        lastMonth: "Last Month",
        lastThreeMonths: "Last 3 Months",
        quickActions: "Quick Actions",
        alertsTips: "Alerts & Tips",
        upcomingBookings: "Upcoming Bookings",
        viewAll: "View All →",
        recentActivity: "Recent Activity",
        topServices: "Top Services",
        availableTractors: "Available Tractors",
        tractorIntro: "New tractors added by tractor owners will appear here.",
        refreshTractors: "Refresh Tractors",
        available: "Available",
        contactUnavailable: "Contact unavailable",
        bookNow: "Book Now",
        messageOwner: "Message Owner",
        availableLabour: "Available Labour",
        labourIntro: "Available labour providers for farm work will appear here.",
        refreshLabour: "Refresh Labour",
        hireNow: "Hire Now",
        noTractors: "No tractors available right now.",
        noLabour: "No labour available right now.",
        noBookings: "No bookings yet. Hire a tractor or labour to get started!",
        noNotifications: "No notifications yet. Book a tractor or labour to get started!",
        browseTractors: "Browse Tractors",
        bookingConfirmed: "Booking confirmed. Please come on the booked date.",
        ownerPhone: "Owner phone",
        bookingPending: "Pending",
        bookingAccepted: "Accepted",
        bookingRejected: "Rejected",
        bookingAcceptedShort: "Confirmed",
        byOwner: "Owner",
        tractorOwner: "Tractor Owner",
        labourProvider: "Labour Provider",
        earningsReport: "Earnings Report",
        totalEarned: "Total Earned",
        recentTransactions: "Recent Transactions",
        received: "Received",
        paid: "Paid",
        myProfile: "My Profile",
        totalBookings: "Total Bookings",
        activeSince: "Active Since",
        village: "Village",
        na: "N/A",
        comingSoon: "This section is coming soon.",
        bookLabel: "Book",
        ownerLabel: "Owner",
        selectDate: "Select Date",
        messageOptional: "Message (optional)",
        specialRequirements: "Any special requirements...",
        cancel: "Cancel",
        sendRequest: "Send Request",
        bookingRequestSent: "Booking request sent successfully! 🎉",
        unread: "Unread",
        chatTitle: "Talk to labour providers and tractor owners",
        chatSubtitle: "Discuss bookings, availability, pricing, and arrival details directly from here.",
        searchContacts: "Search contacts...",
        allContacts: "All contacts",
        contactRoleTractor: "Tractor Owner",
        contactRoleLabour: "Labour Provider",
        contactRoleFarmer: "Farmer",
        noContacts: "No contacts found",
        startConversation: "Select a conversation",
        startConversationDesc: "Choose a contact from the left or open a direct message from the tractor and labour cards.",
        noMessagesYet: "No messages yet",
        noMessagesHint: "Send the first message to ask about pricing, availability, or meeting time.",
        typeMessage: "Type a message...",
        tapToMessage: "Choose a contact to message",
        tapToMessageDesc: "Select a tractor owner or labour provider to start chatting.",
        openMessages: "Open Messages",
        languageButton: "मराठी",
        roleFarmerBadge: "🌾 Farmer",
        kharifTip: "Kharif sowing season starts June 1st",
        mspTip: "MSP for wheat increased by 8%",
        pmKisanTip: "New PM-KISAN installment due in July",
      };

  const NAV = [
    { id: "home", label: copy.dashboard, icon: "🏠" },
    { id: "tractors", label: copy.hireTractor, icon: "🚜" },
    { id: "labour", label: copy.hireLabour, icon: "👷" },
    { id: "bookings", label: copy.myBookings, icon: "📅" },
    { id: "messages", label: copy.messages, icon: "💬" },
    { id: "earnings", label: copy.earnings, icon: "💰" },
    { id: "schemes", label: copy.schemes, icon: "📋" },
    { id: "crop", label: copy.cropDoctor, icon: "🌿" },
    { id: "notifications", label: copy.notifications, icon: "🔔" },
    { id: "profile", label: copy.profile, icon: "👤" },
    { id: "settings", label: copy.settings, icon: "⚙️" },
  ];

  const { user, logout } = useAuth();
  const { getListingsByType, createBooking, getBookingsForUser, fetchListings } = useBooking();
  const { getForUser } = useNotifications();
  const { getConversations, getMessages, sendMessage, markRead, getUnreadCount } = useChat();

  const [activeTab, setActiveTab] = useState("home");
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const myNotifs = getForUser(user?.email || "");
  const unreadNotifs = myNotifs.filter((n) => !n.read).length;
  const myBookings = getBookingsForUser(user) || [];
  const acceptedBookings = myBookings.filter((b) => b.status === "accepted");
  const pendingBookings = myBookings.filter((b) => b.status === "pending");
  const tractors = getListingsByType("tractor");
  const labours = getListingsByType("labour");
  const conversations = getConversations(user?.email || "");
  const chatUnread = getUnreadCount(user?.email || "");
  const currentMessages = selectedContact
    ? getMessages(user?.email || "", selectedContact.email)
    : [];
  const totalLiveListings = tractors.length + labours.length;
  const tractorCountLabel = mr
    ? `${tractors.length} ${tractors.length === 1 ? "ट्रॅक्टर" : "ट्रॅक्टर्स"}`
    : `${tractors.length} Tractor${tractors.length === 1 ? "" : "s"}`;
  const labourCountLabel = mr
    ? `${labours.length} कामगार`
    : `${labours.length} Worker${labours.length === 1 ? "" : "s"}`;

  const stats = mr
    ? [
        { label: copy.activeListings, value: totalLiveListings || "०", sub: `${tractorCountLabel} • ${labourCountLabel}`, subColor: "#16a34a", icon: "🌾", iconBg: "#dcfce7" },
        { label: copy.totalEarnings, value: "₹२४,५००", sub: "या महिन्यात +१८%", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
        { label: copy.myBookings, value: myBookings.length || "०", sub: acceptedBookings.length ? `${acceptedBookings.length} मंजूर` : "१ आगामी", subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
        { label: copy.messages, value: chatUnread || "०", sub: chatUnread ? `${chatUnread} न वाचलेले संदेश` : "नवीन संदेश नाहीत", subColor: chatUnread ? "#ca8a04" : "#16a34a", icon: "💬", iconBg: "#fef9c3" },
      ]
    : [
        { label: copy.activeListings, value: totalLiveListings || "0", sub: `${tractorCountLabel} • ${labourCountLabel}`, subColor: "#16a34a", icon: "🌾", iconBg: "#dcfce7" },
        { label: copy.totalEarnings, value: "₹24,500", sub: "+18% this month", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
        { label: copy.myBookings, value: myBookings.length || "0", sub: acceptedBookings.length ? `${acceptedBookings.length} confirmed` : "1 upcoming", subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
        { label: copy.messages, value: chatUnread || "0", sub: chatUnread ? `${chatUnread} unread messages` : "No new messages", subColor: chatUnread ? "#ca8a04" : "#16a34a", icon: "💬", iconBg: "#fef9c3" },
      ];

  const recentActivity = mr
    ? [
        { message: "सुरेश पाटील यांना ट्रॅक्टर बुकिंग विनंती पाठवली", status: "प्रलंबित", time: "२ तासांपूर्वी", icon: "🚜", statusBg: "#fef9c3", statusColor: "#92400e" },
        { message: "गणेश कदम यांनी मजूर विनंती स्वीकारली", status: "मंजूर", time: "५ तासांपूर्वी", icon: "✅", statusBg: "#dcfce7", statusColor: "#15803d" },
        { message: "₹२,००० चे पेमेंट मिळाले", status: "पूर्ण", time: "१ दिवसापूर्वी", icon: "💵", statusBg: "#dbeafe", statusColor: "#1d4ed8" },
        { message: "गव्हाच्या पीक यादीत बदल केला", status: "अपडेट", time: "२ दिवसांपूर्वी", icon: "📋", statusBg: "#f3f4f6", statusColor: "#374151" },
      ]
    : [
        { message: "Tractor booking request sent to Suresh Patil", status: "Pending", time: "2 hours ago", icon: "🚜", statusBg: "#fef9c3", statusColor: "#92400e" },
        { message: "Ganesh Kadam accepted your labour request", status: "Accepted", time: "5 hours ago", icon: "✅", statusBg: "#dcfce7", statusColor: "#15803d" },
        { message: "Payment of ₹2,000 received", status: "Completed", time: "1 day ago", icon: "💵", statusBg: "#dbeafe", statusColor: "#1d4ed8" },
        { message: "Crop listing (Wheat) updated", status: "Updated", time: "2 days ago", icon: "📋", statusBg: "#f3f4f6", statusColor: "#374151" },
      ];

  const barData = [10, 15, 12, 18, 14, 20, 16];
  const maxBar = Math.max(...barData);
  const dayLabels = mr ? ["सो", "मं", "बु", "गु", "शु", "श", "र"] : ["M", "T", "W", "T", "F", "S", "S"];

  const getRoleLabel = (role) => {
    if (role === "tractor") return copy.contactRoleTractor;
    if (role === "labour") return copy.contactRoleLabour;
    return copy.contactRoleFarmer;
  };

  const getStatusLabel = (status) => {
    if (status === "accepted") return copy.bookingAccepted;
    if (status === "rejected") return copy.bookingRejected;
    return copy.bookingPending;
  };

  const getContactRole = (email, fallbackRole = "farmer") => {
    const matchedTractor = tractors.find((item) => item.ownerEmail === email);
    if (matchedTractor) return "tractor";
    const matchedLabour = labours.find((item) => item.ownerEmail === email);
    if (matchedLabour) return "labour";
    return fallbackRole;
  };

  const getContactStyle = (role) => CONTACT_STYLES[role] || CONTACT_STYLES.farmer;

  const makeContact = ({ email, name, role, phone, lastTime = "", lastPreview = "", unread = 0 }) => ({
    email,
    name: name || email,
    role: getContactRole(email, role),
    phone: phone || "",
    lastTime,
    lastPreview,
    unread,
  });

  const contactsMap = new Map();
  const registerContact = (contact) => {
    if (!contact?.email || contact.email === user?.email) return;
    const existing = contactsMap.get(contact.email);
    const latestTime = [existing?.lastTime, contact.lastTime].filter(Boolean).sort().at(-1) || "";
    contactsMap.set(contact.email, {
      ...existing,
      ...contact,
      name: contact.name || existing?.name || contact.email,
      role: contact.role || existing?.role || "farmer",
      phone: contact.phone || existing?.phone || "",
      lastTime: latestTime,
      lastPreview: contact.lastPreview || existing?.lastPreview || "",
      unread: Math.max(existing?.unread || 0, contact.unread || 0),
    });
  };

  conversations.forEach((conversation) => {
    const lastMsg = conversation.lastMsg;
    const displayName = lastMsg?.from === user?.email ? lastMsg?.toName : lastMsg?.fromName;
    const relatedBooking = myBookings.find(
      (booking) => booking.ownerId === conversation.other || booking.farmerEmail === conversation.other
    );
    const relatedListing =
      tractors.find((listing) => listing.ownerEmail === conversation.other) ||
      labours.find((listing) => listing.ownerEmail === conversation.other);

    registerContact(
      makeContact({
        email: conversation.other,
        name: displayName || relatedListing?.ownerName || relatedBooking?.ownerName || conversation.other,
        role: relatedListing?.type || getContactRole(conversation.other),
        phone: relatedListing?.phone || relatedBooking?.ownerPhone || "",
        lastTime: conversation.lastMsg?.time || "",
        lastPreview: conversation.lastMsg?.text || "",
        unread: conversation.unread || 0,
      })
    );
  });

  myBookings.forEach((booking) => {
    registerContact(
      makeContact({
        email: booking.ownerId,
        name: booking.ownerName,
        role: booking.listingType,
        phone: booking.ownerPhone || "",
      })
    );
  });

  tractors.forEach((listing) => {
    registerContact(
      makeContact({
        email: listing.ownerEmail,
        name: listing.ownerName,
        role: "tractor",
        phone: listing.phone || "",
      })
    );
  });

  labours.forEach((listing) => {
    registerContact(
      makeContact({
        email: listing.ownerEmail,
        name: listing.ownerName,
        role: "labour",
        phone: listing.phone || "",
      })
    );
  });

  const allContacts = Array.from(contactsMap.values()).sort((a, b) => {
    if (a.lastTime || b.lastTime) {
      return new Date(b.lastTime || 0) - new Date(a.lastTime || 0);
    }
    return a.name.localeCompare(b.name);
  });

  const filteredContacts = allContacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      getRoleLabel(contact.role).toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (["home", "tractors", "labour", "messages"].includes(activeTab)) {
      fetchListings();
    }
  }, [activeTab, fetchListings]);

  useEffect(() => {
    if (!selectedContact && conversations.length > 0) {
      const firstContact = allContacts.find((contact) => contact.email === conversations[0].other);
      if (firstContact) {
        setSelectedContact(firstContact);
      }
    }
  }, [allContacts, conversations, selectedContact]);

  useEffect(() => {
    if (activeTab === "messages" && selectedContact?.email && user?.email) {
      markRead(user.email, selectedContact.email);
    }
  }, [activeTab, currentMessages.length, markRead, selectedContact, user?.email]);

  useEffect(() => {
    if (activeTab === "messages") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, currentMessages]);

  const closeBookingModal = () => {
    setBookingModal(null);
    setBookingDate("");
    setBookingMsg("");
    setBookingSuccess("");
  };

  const handleBook = (item) => {
    setBookingModal(item);
    setBookingDate("");
    setBookingMsg("");
    setBookingSuccess("");
  };

  const confirmBooking = async () => {
    await createBooking(user, bookingModal, bookingDate, bookingMsg);
    setBookingSuccess(copy.bookingRequestSent);
    setTimeout(() => closeBookingModal(), 1800);
  };

  const openMessagesForContact = (contact) => {
    if (!contact?.email) return;
    setActiveTab("messages");
    setSelectedContact(contact);
    setShowProfileMenu(false);
    setSidebarOpen(false);
    if (user?.email) {
      markRead(user.email, contact.email);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact?.email || !user?.email) return;
    sendMessage(
      user.email,
      user.name || copy.farmer,
      selectedContact.email,
      selectedContact.name,
      messageText.trim()
    );
    setMessageText("");
  };

  const renderMessageButton = (contact, color) => (
    <button
      onClick={() => openMessagesForContact(contact)}
      style={{
        width: "100%",
        background: "#fff",
        color,
        border: `1px solid ${color}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {copy.messageOwner}
    </button>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f8fafc" }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 49 }}
        />
      )}

      <aside
        style={{
          width: 220,
          background: "linear-gradient(180deg,#14532d 0%,#052e16 100%)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease",
        }}
        className={`farmer-sidebar${sidebarOpen ? " sidebar-open" : ""}`}
      >
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌾</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>Shetkari Mitra</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{copy.farmer}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "10px 10px 0" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 15 }}>🏡</span> {copy.goHome}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.id === "schemes"
                  ? navigate("/schemes")
                  : item.id === "crop"
                    ? navigate("/crop")
                    : setActiveTab(item.id)
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                marginBottom: 2,
                background: activeTab === item.id ? "rgba(74,222,128,0.15)" : "transparent",
                color: activeTab === item.id ? "#4ade80" : "rgba(255,255,255,0.65)",
                border: activeTab === item.id ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
              {item.id === "notifications" && unreadNotifs > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                  {unreadNotifs}
                </span>
              )}
              {item.id === "bookings" && pendingBookings.length > 0 && (
                <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                  {pendingBookings.length}
                </span>
              )}
              {item.id === "messages" && chatUnread > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, padding: "0 4px" }}>
                  {chatUnread > 9 ? "9+" : chatUnread}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            🚪 {copy.logout}
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: 220, flex: 1 }} className="farmer-main">
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "14px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-hamburger"
              style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", display: "none" }}
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{copy.welcomeBack}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name || copy.farmer} 👋</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                📍 {user?.village || copy.maharashtra}, {copy.india}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
            <button
              onClick={toggleLang}
              style={{
                background: "#fff",
                border: "1px solid #d1d5db",
                borderRadius: 999,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                color: "#374151",
              }}
            >
              🌐 {copy.languageButton}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}
            >
              💬
              {chatUnread > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, padding: "0 3px" }}>
                  {chatUnread > 9 ? "9+" : chatUnread}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}
            >
              🔔
              {unreadNotifs > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "F"}
              </div>
              <span style={{ fontSize: 11, color: "#6b7280" }}>▼</span>
            </button>

            {showProfileMenu && (
              <div style={{ position: "absolute", top: 52, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", width: 190, zIndex: 100 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2, fontWeight: 600 }}>{copy.roleFarmerBadge}</div>
                </div>
                <button onClick={() => navigate("/")} style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#374151", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  🏡 {copy.homePage}
                </button>
                <button onClick={() => setActiveTab("messages")} style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#374151", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  💬 {copy.openMessages}
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#ef4444", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}
                >
                  🚪 {copy.logout}
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: 28 }}>
          {activeTab === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {stats.map((stat, index) => (
                  <div key={index} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{stat.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{stat.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: stat.subColor }}>{stat.sub}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: stat.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{stat.icon}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{copy.earningsOverview}</div>
                    <select style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 10px", background: "#fff", color: "#374151" }}>
                      <option>{copy.thisMonth}</option>
                      <option>{copy.lastMonth}</option>
                      <option>{copy.lastThreeMonths}</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
                    {barData.map((height, index) => (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div
                          style={{
                            width: "100%",
                            background: "linear-gradient(to top,#16a34a,#4ade80)",
                            borderRadius: "5px 5px 0 0",
                            height: `${(height / maxBar) * 110}px`,
                            transition: "height 0.4s ease",
                          }}
                        />
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{dayLabels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{copy.quickActions}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { label: copy.hireTractor, icon: "🚜", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("tractors") },
                      { label: copy.hireLabour, icon: "👷", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("labour") },
                      { label: copy.myBookings, icon: "📅", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", action: () => setActiveTab("bookings") },
                      { label: copy.messages, icon: "💬", color: "#fff7ed", border: "#fdba74", text: "#c2410c", action: () => setActiveTab("messages") },
                    ].map((action, index) => (
                      <button key={index} onClick={action.action} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", borderRadius: 10, border: `1px solid ${action.border}`, background: action.color, color: action.text, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        <span style={{ fontSize: 18 }}>{action.icon}</span>
                        {action.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 8 }}>📢 {copy.alertsTips}</div>
                    {[copy.kharifTip, copy.mspTip, copy.pmKisanTip].map((tip, index) => (
                      <div key={index} style={{ display: "flex", gap: 8, padding: "8px 10px", background: "#f0fdf4", borderRadius: 8, marginBottom: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>•</span>
                        <span style={{ fontSize: 12, color: "#374151" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {acceptedBookings.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{copy.upcomingBookings}</div>
                    <button onClick={() => setActiveTab("bookings")} style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>{copy.viewAll}</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                    {acceptedBookings.slice(0, 3).map((booking, index) => (
                      <div key={index} style={{ padding: "14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{booking.listingTitle || booking.title}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>📅 {booking.date}</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                          {copy.byOwner}: {booking.ownerName}
                        </div>
                        <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#dcfce7", color: "#15803d" }}>
                          ✅ {copy.bookingAcceptedShort}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{copy.recentActivity}</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>{copy.viewAll}</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentActivity.map((activity, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{activity.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{activity.message}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{activity.time}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: activity.statusBg, color: activity.statusColor, whiteSpace: "nowrap" }}>{activity.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>{copy.topServices}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { title: mr ? "ट्रॅक्टर भाड्याने" : "Tractor Rental", count: tractorCountLabel, icon: "🚜", tab: "tractors", bg: "#f0fdf4", border: "#bbf7d0" },
                      { title: mr ? "मजूर सेवा" : "Labour Services", count: labourCountLabel, icon: "👷", tab: "labour", bg: "#fef9c3", border: "#fde047" },
                      { title: copy.messages, count: chatUnread ? `${chatUnread} ${copy.unread}` : mr ? "थेट संवाद" : "Direct interaction", icon: "💬", tab: "messages", bg: "#fff7ed", border: "#fdba74" },
                    ].map((service, index) => (
                      <button key={index} onClick={() => setActiveTab(service.tab)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: service.bg, borderRadius: 10, border: `1px solid ${service.border}`, cursor: "pointer", textAlign: "left" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{service.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{service.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{service.count}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tractors" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>🚜 {copy.availableTractors}</h2>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{copy.tractorIntro}</div>
                </div>
                <button onClick={() => fetchListings()} style={{ background: "#fff", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                  {copy.refreshTractors}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {tractors.map((tractor) => {
                  const contact = makeContact({
                    email: tractor.ownerEmail,
                    name: tractor.ownerName,
                    role: "tractor",
                    phone: tractor.phone || "",
                  });

                  return (
                    <div key={tractor._id || tractor.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #fef9c3" }}>
                      <div
                        style={{
                          height: 130,
                          background: tractor.image ? `linear-gradient(rgba(15,23,42,0.14), rgba(15,23,42,0.14)), url(${tractor.image})` : "linear-gradient(135deg,#14532d,#16a34a)",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          padding: 14,
                          color: "#fff",
                        }}
                      >
                        <span style={{ fontSize: 40 }}>{tractor.image ? "" : "🚜"}</span>
                        <span style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                          {copy.available}
                        </span>
                      </div>
                      <div style={{ padding: "18px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{tractor.title}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>👤 {tractor.ownerName}</div>
                          </div>
                          <span style={{ background: "#fef9c3", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, height: "fit-content" }}>🚜 {copy.tractorOwner}</span>
                        </div>
                        <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6b7280", marginBottom: 8, flexWrap: "wrap" }}>
                          <span>📍 {tractor.location}</span>
                          <span>💰 {tractor.price}</span>
                          {tractor.rating ? <span>⭐ {tractor.rating}</span> : null}
                        </div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>📞 {tractor.phone || copy.contactUnavailable}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {renderMessageButton(contact, "#ca8a04")}
                          <button onClick={() => handleBook(tractor)} style={{ width: "100%", background: "#ca8a04", color: "#fff", border: "none", borderRadius: 10, padding: "10px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                            {copy.bookNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {tractors.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 48, color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚜</div>
                    <p>{copy.noTractors}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "labour" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>👷 {copy.availableLabour}</h2>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>{copy.labourIntro}</div>
                </div>
                <button onClick={() => fetchListings()} style={{ background: "#fff", color: "#9a3412", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                  {copy.refreshLabour}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {labours.map((labour, index) => {
                  const contact = makeContact({
                    email: labour.ownerEmail,
                    name: labour.ownerName,
                    role: "labour",
                    phone: labour.phone || "",
                  });

                  return (
                    <div key={labour._id || labour.id || index} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ffedd5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{labour.ownerName}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>🔧 {labour.skill || labour.title}</div>
                        </div>
                        <span style={{ background: "#ffedd5", color: "#9a3412", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, height: "fit-content" }}>👷 {copy.labourProvider}</span>
                      </div>
                      <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6b7280", marginBottom: 10, flexWrap: "wrap" }}>
                        <span>📍 {labour.location}</span>
                        <span>💰 {labour.price}</span>
                        {labour.rating && <span>⭐ {labour.rating}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>📞 {labour.phone || copy.contactUnavailable}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {renderMessageButton(contact, "#ea580c")}
                        <button onClick={() => handleBook(labour)} style={{ width: "100%", background: "#ea580c", color: "#fff", border: "none", borderRadius: 10, padding: "10px 12px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                          {copy.hireNow}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {labours.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 48, color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
                    <p>{copy.noLabour}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>💬 {copy.messages}</h2>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>{copy.chatSubtitle}</p>
                </div>
                {chatUnread > 0 && (
                  <div style={{ background: "#ef4444", color: "#fff", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontWeight: 800 }}>
                    {chatUnread} {copy.unread}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16, minHeight: 560 }}>
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ padding: "16px 16px 0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 10 }}>{copy.allContacts}</div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={copy.searchContacts}
                      style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
                    {filteredContacts.map((contact, index) => {
                      const contactStyle = getContactStyle(contact.role);
                      const isSelected = selectedContact?.email === contact.email;

                      return (
                        <button
                          key={contact.email || index}
                          onClick={() => openMessagesForContact(contact)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "11px 10px",
                            borderRadius: 12,
                            marginBottom: 4,
                            background: isSelected ? "#f0fdf4" : "transparent",
                            border: isSelected ? "1px solid #bbf7d0" : "1px solid transparent",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                            {contactStyle.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.name}</span>
                              {contact.unread > 0 && (
                                <span style={{ background: "#ef4444", color: "#fff", borderRadius: "50%", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, padding: "0 4px", flexShrink: 0 }}>
                                  {contact.unread > 9 ? "9+" : contact.unread}
                                </span>
                              )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: contactStyle.bg, color: contactStyle.text }}>
                                {getRoleLabel(contact.role)}
                              </span>
                              {contact.phone && <span style={{ fontSize: 11, color: "#9ca3af" }}>📞 {contact.phone}</span>}
                            </div>
                            {contact.lastPreview && (
                              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {contact.lastPreview}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {filteredContacts.length === 0 && (
                      <div style={{ textAlign: "center", padding: 32, color: "#9ca3af", fontSize: 13 }}>{copy.noContacts}</div>
                    )}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {selectedContact ? (
                    <>
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18 }}>
                            {getContactStyle(selectedContact.role).icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>{selectedContact.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                              {getRoleLabel(selectedContact.role)}
                              {selectedContact.phone ? ` · ${selectedContact.phone}` : ""}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab(selectedContact.role === "labour" ? "labour" : "tractors")}
                          style={{ background: "#fff", border: "1px solid #d1d5db", borderRadius: 999, padding: "8px 12px", fontSize: 12, fontWeight: 700, color: "#374151", cursor: "pointer" }}
                        >
                          {selectedContact.role === "labour" ? copy.hireLabour : copy.hireTractor}
                        </button>
                      </div>

                      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                        {currentMessages.length === 0 && (
                          <div style={{ textAlign: "center", color: "#9ca3af", padding: 48 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{copy.noMessagesYet}</p>
                            <p style={{ fontSize: 13 }}>{copy.noMessagesHint}</p>
                          </div>
                        )}

                        {currentMessages.map((message, index) => {
                          const isMine = message.from === user?.email;
                          return (
                            <div key={message.id || index} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
                              <div style={{ maxWidth: "72%", background: isMine ? "linear-gradient(135deg,#16a34a,#15803d)" : "#f3f4f6", color: isMine ? "#fff" : "#111827", padding: "10px 14px", borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                                <div>{message.text}</div>
                                <div style={{ fontSize: 10, marginTop: 4, opacity: 0.72, textAlign: "right" }}>
                                  {new Date(message.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                  {isMine && <span style={{ marginLeft: 4 }}>{message.read ? "✓✓" : "✓"}</span>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>

                      <form onSubmit={handleSendMessage} style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10, alignItems: "center" }}>
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={copy.typeMessage}
                          style={{ flex: 1, border: "1px solid #e5e7eb", borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none" }}
                        />
                        <button
                          type="submit"
                          disabled={!messageText.trim()}
                          style={{ background: messageText.trim() ? "linear-gradient(135deg,#16a34a,#15803d)" : "#e5e7eb", color: messageText.trim() ? "#fff" : "#9ca3af", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: messageText.trim() ? "pointer" : "not-allowed", fontSize: 20 }}
                        >
                          ➤
                        </button>
                      </form>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", padding: 32 }}>
                      <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#374151", marginBottom: 8 }}>{copy.tapToMessage}</h3>
                      <p style={{ fontSize: 14, textAlign: "center", maxWidth: 320 }}>{copy.tapToMessageDesc}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📅 {copy.myBookings}</h2>
              {myBookings.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p style={{ color: "#9ca3af", fontSize: 15 }}>{copy.noBookings}</p>
                  <button onClick={() => setActiveTab("tractors")} style={{ marginTop: 16, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                    {copy.browseTractors}
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {myBookings.map((booking, index) => {
                    const bookingStatusStyle = BOOKING_STATUS_STYLES[booking.status] || BOOKING_STATUS_STYLES.pending;
                    const bookingContact = makeContact({
                      email: booking.ownerId,
                      name: booking.ownerName,
                      role: booking.listingType,
                      phone: booking.ownerPhone || "",
                    });

                    return (
                      <div key={booking.id || booking._id || index} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                            {booking.listingType === "tractor" ? "🚜" : "👷"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{booking.listingTitle || booking.title}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                              {copy.ownerLabel}: {booking.ownerName} · 📅 {booking.date}
                            </div>
                            {booking.status === "accepted" && (
                              <div style={{ fontSize: 12, color: "#166534", marginTop: 4, fontWeight: 600 }}>✅ {copy.bookingConfirmed}</div>
                            )}
                            {booking.status === "accepted" && booking.ownerPhone && (
                              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
                                📞 {copy.ownerPhone}: {booking.ownerPhone}
                              </div>
                            )}
                            {booking.message && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>"{booking.message}"</div>}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", minWidth: 132 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: bookingStatusStyle.bg, color: bookingStatusStyle.text }}>
                            {getStatusLabel(booking.status)}
                          </span>
                          <button onClick={() => openMessagesForContact(bookingContact)} style={{ border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 10, padding: "8px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                            {copy.messageOwner}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "earnings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>💰 {copy.earningsReport}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {(mr
                  ? [
                      { label: copy.thisMonth, value: "₹८,५००", trend: "+१८%" },
                      { label: copy.lastMonth, value: "₹७,२००", trend: "+१२%" },
                      { label: copy.totalEarned, value: "₹२४,५००", trend: "YTD" },
                    ]
                  : [
                      { label: copy.thisMonth, value: "₹8,500", trend: "+18%" },
                      { label: copy.lastMonth, value: "₹7,200", trend: "+12%" },
                      { label: copy.totalEarned, value: "₹24,500", trend: "YTD" },
                    ]).map((earning, index) => (
                  <div key={index} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{earning.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{earning.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{earning.trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>{copy.recentTransactions}</div>
                {(mr
                  ? [
                      { date: "२५ मे", desc: "गहू विक्री - मंडी", amount: "₹३,२००", status: copy.received },
                      { date: "२२ मे", desc: "मजूर पेमेंट मिळाले", amount: "₹८००", status: copy.received },
                      { date: "२० मे", desc: "ट्रॅक्टर बुकिंग - रमेश", amount: "₹१,२००", status: copy.paid },
                    ]
                  : [
                      { date: "25 May", desc: "Wheat crop sale - Mandi", amount: "₹3,200", status: copy.received },
                      { date: "22 May", desc: "Labour payment received", amount: "₹800", status: copy.received },
                      { date: "20 May", desc: "Tractor booking - Ramesh", amount: "₹1,200", status: copy.paid },
                    ]).map((payment, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f9fafb", borderRadius: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{payment.desc}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{payment.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{payment.amount}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#dcfce7", color: "#15803d" }}>{payment.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>🔔 {copy.notifications}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myNotifs.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
                    <p style={{ color: "#9ca3af" }}>{copy.noNotifications}</p>
                  </div>
                ) : (
                  myNotifs.map((notification, index) => (
                    <div key={notification.id || index} style={{ background: notification.read ? "#fff" : "#f0fdf4", borderRadius: 12, padding: "16px 20px", border: notification.read ? "1px solid #f3f4f6" : "1px solid #bbf7d0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {notification.type === "booking_request" ? "🚜" : notification.type === "booking_update" ? "✅" : "🔔"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{notification.title}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{notification.message}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{new Date(notification.time).toLocaleString()}</div>
                      </div>
                      {!notification.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", flexShrink: 0, marginTop: 4 }} />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>👤 {copy.myProfile}</h2>
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36, fontWeight: 800 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || "F"}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name}</div>
                    <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                      🌾 {copy.farmer} · {user?.village || copy.maharashtra}
                    </div>
                    <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginTop: 4 }}>📧 {user?.email}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {[
                    { label: copy.totalBookings, value: myBookings.length },
                    { label: copy.activeSince, value: "2024" },
                    { label: copy.village, value: user?.village || copy.na },
                  ].map((item, index) => (
                    <div key={index} style={{ padding: "16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{item.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginTop: 4 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!["home", "tractors", "labour", "messages", "bookings", "earnings", "notifications", "profile"].includes(activeTab) && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{NAV.find((item) => item.id === activeTab)?.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{NAV.find((item) => item.id === activeTab)?.label}</h2>
              <p style={{ color: "#9ca3af" }}>{copy.comingSoon}</p>
            </div>
          )}
        </main>
      </div>

      {bookingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              {copy.bookLabel}: {bookingModal.title || bookingModal.ownerName}
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              {copy.ownerLabel}: {bookingModal.ownerName} · {bookingModal.price}
            </p>
            {bookingSuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16, color: "#15803d", textAlign: "center", fontWeight: 600 }}>{bookingSuccess}</div>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{copy.selectDate}</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 14, boxSizing: "border-box" }}
                />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{copy.messageOptional}</label>
                <textarea
                  value={bookingMsg}
                  onChange={(e) => setBookingMsg(e.target.value)}
                  placeholder={copy.specialRequirements}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, resize: "none", height: 80, boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={closeBookingModal} style={{ flex: 1, border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 10, padding: "11px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    {copy.cancel}
                  </button>
                  <button onClick={confirmBooking} disabled={!bookingDate} style={{ flex: 1, background: bookingDate ? "#16a34a" : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: bookingDate ? "pointer" : "not-allowed", fontSize: 14 }}>
                    {copy.sendRequest}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
