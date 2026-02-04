"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Video, MessageSquare } from "lucide-react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("sessions")
        .select(`
          id,
          status,
          session_date,
          session_time,
          skills(skill_name),
          tutor:profiles!sessions_tutor_id_fkey(full_name),
          learner_id,
          tutor_id
        `)
        .or(`learner_id.eq.${user.id},tutor_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (!error) setSessions(data);
    };

    fetchSessions();
  }, []);

  const refreshSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("sessions")
      .select(`
        id,
        status,
        session_date,
        session_time,
        skills(skill_name),
        tutor:profiles!sessions_tutor_id_fkey(full_name),
        learner_id,
        tutor_id
      `)
      .or(`learner_id.eq.${user.id},tutor_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    setSessions(data);
  };

  const handleApprove = async (id) => {
    await supabase.from("sessions").update({ status: "approved" }).eq("id", id);
    refreshSessions();
  };

  const handleReject = async (id) => {
    await supabase.from("sessions").update({ status: "rejected" }).eq("id", id);
    refreshSessions();
  };

  // 🎬 FAKE BUTTON ACTIONS
  const handleJoinCall = () => alert("Video call feature coming soon 🎥");
  const handleMessage = () => alert("Chat feature coming soon 💬");

  const total = sessions.length;
  const approved = sessions.filter(s => s.status === "approved").length;
  const pending = sessions.filter(s => s.status === "pending").length;

  const filteredSessions =
    filter === "all"
      ? sessions
      : sessions.filter(s => s.status === filter);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">My Sessions</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Total Sessions</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approved}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-500">{pending}</p>
        </div>
      </div>

      {/* 🎛 FILTER */}
      <div className="flex gap-3">
        {["all", "approved", "pending", "rejected"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full capitalize ${
              filter === type ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 📋 SESSION CARDS */}
      {filteredSessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white shadow rounded-xl p-5 space-y-2">

              <p className="text-lg font-semibold">🎯 {session.skills?.skill_name}</p>
              <p className="text-gray-600">Tutor: {session.tutor?.full_name}</p>

              {session.tutor_id === currentUserId ? (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  🧑‍🏫 You are teaching
                </span>
              ) : (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                  🎓 You are learning
                </span>
              )}

              {session.session_date && (
                <p className="text-sm text-gray-500">
                  📅 {new Date(session.session_date).toLocaleDateString()} — {session.session_time}
                </p>
              )}

              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    session.status === "approved"
                      ? "text-green-600"
                      : session.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {session.status}
                </span>
              </p>

              {/* 🎯 Tutor Actions */}
              {session.status === "pending" && session.tutor_id === currentUserId && (
                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleApprove(session.id)} className="bg-green-600 text-white px-4 py-1 rounded-lg">
                    Approve
                  </button>
                  <button onClick={() => handleReject(session.id)} className="border border-red-500 text-red-500 px-4 py-1 rounded-lg">
                    Reject
                  </button>
                </div>
              )}

              {/* 🚀 SHOW AFTER APPROVED */}
              {session.status === "approved" && (
                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleJoinCall}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
                  >
                    <Video size={18} />
                    Join Call
                  </button>

                  <button
                    onClick={handleMessage}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition"
                  >
                    <MessageSquare size={18} />
                    Message
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
