import { useState } from "react";
import {
  FaCog,
  FaUser,
  FaLock,
  FaBell,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../context/authcontext";
import { useToast } from "../context/toastcontext";
import api from "../services/api";

function Settings() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await api.put("/auth/update-profile", { name, email });
      updateUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400">
          <FaCog className="text-xl" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Settings
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage your account settings.
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl bg-[#0f192e] border border-slate-800/80 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Profile</h2>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {savingProfile ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="rounded-2xl bg-[#0f192e] border border-slate-800/80 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-amber-400" />
          <h2 className="text-lg font-bold text-white">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
            />
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {changingPassword ? <FaSpinner className="animate-spin text-xs" /> : <FaLock className="text-xs" />}
            {changingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Notifications Section */}
      <div className="rounded-2xl bg-[#0f192e] border border-slate-800/80 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Email Notifications</p>
            <p className="text-xs text-slate-500 mt-0.5">Receive updates about your courses and progress</p>
          </div>
          <button
            onClick={() => {
              setNotifications(!notifications);
              toast.success(notifications ? "Notifications disabled" : "Notifications enabled");
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              notifications ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              notifications ? "left-7" : "left-1"
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
