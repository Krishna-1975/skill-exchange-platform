"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Video, MessageSquare } from "lucide-react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);

    // 1️⃣ Fetch sessions
    const { data: sessionData, error } = await supabase
      .from("sessions")
      .select("*")
      .or(`learner_id.eq.${user.id},tutor_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (error || !sessionData) return;

    // 2️⃣ Collect skill & tutor IDs
    const skillIds = [...new Set(sessionData.map(s => s.skill_id))];
    const tutorIds = [...new Set(sessionData.map(s => s.tutor_id))];

    // 3️⃣ Fetch skills
    const { data: skills } = await supabase
      .from("skills")
      .select("id, skill_name")
      .in("id", skillIds);

    // 4️⃣ Fetch tutors
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", tutorIds);

    // 5️⃣ Create lookup maps
    const skillMap = Object.fromEntries(
      skills?.map(s => [s.id, s.skill_name]) || []
    );

    const tutorMap = Object.fromEntries(
      profiles?.map(p => [p.id, p.full_name]) || []
    );

    // 6️⃣ Merge data
    const merged = sessionData.map(s => ({
      ...s,
      skill_name: skillMap[s.skill_id] || "Skill",
      tutor_name: tutorMap[s.tutor_id] || "Tutor",
    }));

    setSessions(merged);
  };

  const handleApprove = async (id) => {
    await supabase.from("sessions").update({ status: "approved" }).eq("id", id);
    fetchSessions();
  };

  const handleReject = async (id) => {
    await supabase.from("sessions").update({ status: "rejected" }).eq("id", id);
    fetchSessions();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">My Sessions</h1>

      {sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-5 space-y-2">

            <p className="text-lg font-semibold">🎯 {s.skill_name}</p>
            <p className="text-gray-600">Tutor: {s.tutor_name}</p>

            {s.tutor_id === currentUserId ? (
              <span className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                🧑‍🏫 You are teaching
              </span>
            ) : (
              <span className="inline-block px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                🎓 You are learning
              </span>
            )}

            <p className="text-sm text-gray-500">
              📅 {new Date(s.session_date).toLocaleDateString()} — {s.session_time}
            </p>

            <p className="text-sm">
              Status:{" "}
              <span className={`font-semibold ${
                s.status === "approved" ? "text-green-600" :
                s.status === "pending" ? "text-yellow-600" : "text-red-600"
              }`}>
                {s.status}
              </span>
            </p>

            {s.status === "pending" && s.tutor_id === currentUserId && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleApprove(s.id)}
                  className="bg-green-600 text-white px-4 py-1 rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(s.id)}
                  className="border border-red-500 text-red-500 px-4 py-1 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}

            {s.status === "approved" && (
              <div className="pt-3 space-y-2">
                <button className="w-full border rounded-lg py-2 flex justify-center gap-2">
                  <Video size={18} /> Join Call
                </button>
                <button className="w-full border rounded-lg py-2 flex justify-center gap-2">
                  <MessageSquare size={18} /> Message
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
