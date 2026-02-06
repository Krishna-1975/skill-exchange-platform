"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // 1️⃣ Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select("id, skill_name, user_id")
        .order("created_at", { ascending: false });

      if (skillsError) {
        console.error(skillsError);
        return;
      }

      // 2️⃣ Fetch profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name");

      // Convert profiles array → object { id: name }
      const profileMap = {};
      profilesData?.forEach((p) => {
        profileMap[p.id] = p.full_name;
      });

      setSkills(skillsData);
      setProfiles(profileMap);
    };

    fetchData();
  }, []);

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
        status: "pending",
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
    <div className="w-full bg-background px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Discover Skills</h1>

        <div className="mb-8 relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border"
          />
        </div>

        {filteredSkills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div key={skill.id} className="bg-white border rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-1">
                  🚀 {skill.skill_name}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Tutor:{" "}
                  <span className="font-medium">
                    {profiles[skill.user_id] || "Unknown"}
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
                  className="w-full py-2 rounded-lg bg-orange-500 text-white"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
