"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to SkillVibe</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Learn Together.
            <span className="block text-primary">
              Teach What You Love.
            </span>
          </h1>


          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A peer-powered space where students share skills, book sessions, and grow together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/skills">
              <Button size="lg" className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded-lg shadow-md transition">
                Explore Skills
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/profile">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Share Your Skill
              </Button>
            </Link>
          </div>

          <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
  <img
    src="https://media.istockphoto.com/id/2174317591/vector/contemporary-halftone-collage-concept-idea-generation-invention-and-cognition-ready-solution.jpg?s=1024x1024&w=is&k=20&c=3ej16Oim-sfHbISadb_o-BGL6oB5Ln4mlKhJAoH7J0w="
    alt="Creative learning illustration"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
</div>


        </div>
      </section>

      {/* Community Value */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why SkillVibe?</h2>
            <p className="text-lg text-muted-foreground">Everything you need to learn and teach together</p>
          </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <BookOpen className="w-6 h-6 text-primary" />, title: "Share What You Know", desc: "Teach skills you're passionate about." },
            { icon: <Zap className="w-6 h-6 text-primary" />, title: "Discover New Skills", desc: "Learn from peers like you." },
            { icon: <Users className="w-6 h-6 text-primary" />, title: "Grow Together", desc: "Join a supportive learning community." }
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-2xl p-8 hover:shadow-lg transition">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <h2 className="text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
        <Link href="/register">
          <Button size="lg" className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded-lg shadow-md transition">
            Join SkillVibe Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}


