"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select(`
  id,
  skill_name,
  user_id,
  profiles(full_name)
`)

        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
      } else {
        setSkills(data);
      }
    };

    fetchSkills();
  }, []);

  // 📅 MANUAL BOOKING ONLY
  const handleBook = async (skill) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      router.push("/login");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    const { error } = await supabase.from("sessions").insert([
      {
        tutor_id: skill.user_id,
        learner_id: user.id,
        skill_id: skill.id,
        session_date: selectedDate,
        session_time: selectedTime,
        status: "pending"
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Booking request sent!");
      router.push("/sessions");
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-background px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Discover Skills</h1>

        {/* 🔍 Search */}
        <div className="mb-8 relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-100/40 to-amber-100/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    🚀 {skill.skill_name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-5">
                    Tutor:{" "}
                    <span className="font-medium text-gray-700">
                      {skill.profiles?.full_name}
                    </span>
                  </p>

                  <input
                    type="date"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full mb-2 px-3 py-1 border rounded-lg"
                  />

                  <input
                    type="time"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full mb-2 px-3 py-1 border rounded-lg"
                  />

                  <button
                    onClick={() => handleBook(skill)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
