import { createContext, useContext, useState, useEffect } from "react";
import { initialDonations, initialMoneyDonations } from "../data/mockData";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";

const STORAGE_KEYS = {
  DONATIONS: "foodshare_donations",
  MONEY_DONATIONS: "foodshare_money_donations",
  CURRENT_USER: "foodshare_current_user",
  TOKEN: "foodshare_token",
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [moneyDonations, setMoneyDonations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const storedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      const storedMoneyDonations = localStorage.getItem(STORAGE_KEYS.MONEY_DONATIONS);
      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      setDonations(storedDonations ? JSON.parse(storedDonations) : initialDonations);
      setMoneyDonations(
        storedMoneyDonations ? JSON.parse(storedMoneyDonations) : initialMoneyDonations
      );
      setCurrentUser(storedCurrentUser ? JSON.parse(storedCurrentUser) : null);

      if (!storedDonations) {
        localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(initialDonations));
      }
      if (!storedMoneyDonations) {
        localStorage.setItem(STORAGE_KEYS.MONEY_DONATIONS, JSON.stringify(initialMoneyDonations));
      }

      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.log("Cannot load users from server:", err.message);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }, [donations, loading]);

  useEffect(() => {
    if (!loading)
      localStorage.setItem(STORAGE_KEYS.MONEY_DONATIONS, JSON.stringify(moneyDonations));
  }, [moneyDonations, loading]);

  async function register({ name, email, password, role, phone, address, donorType, restaurantPlace }) {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          address,
          donorType,
          restaurant: restaurantPlace,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "রেজিস্ট্রেশন হয়নি। আবার চেষ্টা করুন।" };
      }
      setUsers((prev) => [...prev, data.user]);
      return {
        success: true,
        message: "রেজিস্ট্রেশন সম্পন্ন হয়েছে! অ্যাডমিন অ্যাপ্রুভ করার পর আপনি লগইন করতে পারবেন।",
      };
    } catch (err) {
      return { success: false, message: "সার্ভারের সাথে সংযোগ হয়নি। ব্যাকএন্ড চালু আছে কি না দেখুন।" };
    }
  }

  async function login(email, password) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" };
      }
      setCurrentUser(data.user);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: "সার্ভারের সাথে সংযোগ হয়নি। ব্যাকএন্ড চালু আছে কি না দেখুন।" };
    }
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  async function approveUser(userId) {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      console.log("Approve failed:", err.message);
    }
  }

  async function rejectUser(userId) {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" });
      if (!res.ok) return;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.log("Reject failed:", err.message);
    }
  }

  async function toggleBlockUser(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newStatus = user.status === "blocked" ? "approved" : "blocked";
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      console.log("Block failed:", err.message);
    }
  }

  const value = {
    users,
    donations,
    moneyDonations,
    currentUser,
    loading,
    register,
    login,
    logout,
    approveUser,
    rejectUser,
    toggleBlockUser,
    setDonations,
    setMoneyDonations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth অবশ্যই AuthProvider এর ভেতরে ব্যবহার করতে হবে।");
  }
  return context;
}
