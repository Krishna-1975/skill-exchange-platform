"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Mail, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: skillsData } = await supabase
        .from("skills")
        .select("*")
        .eq("user_id", user.id);
      setSkills(skillsData || []);
    };

    loadData();
  }, []);

  const handleEditProfile = async () => {
    const newName = prompt("Enter new name:", profile.full_name);
    const newAbout = prompt("About you:", profile.about || "");

    if (!newName) return;

    await supabase
      .from("profiles")
      .update({ full_name: newName, about: newAbout })
      .eq("id", user.id);

    alert("Profile updated!");
    window.location.reload();
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return alert("Enter skill name");

    const { error, data } = await supabase.from("skills").insert([
      {
        skill_name: newSkill,
        user_id: user.id,
      },
    ]).select();

    if (error) {
      alert(error.message);
    } else {
      alert("Skill added!");
      setSkills([...skills, data[0]]);
      setNewSkill("");
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
          <p className="text-gray-500">Teaching {skills.length} skill(s)</p>
        </div>

        {/* ABOUT */}
        <div>
          <h2 className="font-semibold mb-2">About Me</h2>
          <p className="text-gray-600">{profile?.about || "No bio added yet."}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={handleEditProfile}
            className="flex-1 py-2 rounded-lg bg-orange-500 text-white flex items-center justify-center gap-2"
          >
            <Edit2 size={16} /> Edit Profile
          </button>

          <button className="flex-1 py-2 rounded-lg border border-gray-300 flex items-center justify-center gap-2">
            <Mail size={16} /> Contact
          </button>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Skills I Teach</h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md"
            >
              + Add Skill
            </button>
          </div>

          {showForm && (
            <div className="mb-6 bg-orange-50 p-4 rounded-xl border">
              <input
                type="text"
                placeholder="Enter skill name"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <button
                onClick={handleAddSkill}
                className="w-full bg-orange-500 text-white py-2 rounded-lg"
              >
                Save Skill
              </button>
            </div>
          )}

          <div className="grid gap-6">
            {skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => router.push("/skills")}
                className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">🚀 {skill.skill_name}</h3>
                <p className="text-sm text-orange-500 font-medium mt-1">
                  Students can book this skill →
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
