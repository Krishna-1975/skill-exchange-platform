import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo + About */}
        <div>
          <h2 className="text-xl font-bold mb-3">SkillVibe ✨</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A peer-powered space where students share skills and grow together.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/skills" className="hover:text-primary">Browse Skills</Link></li>
            <li><Link href="/sessions" className="hover:text-primary">My Sessions</Link></li>
            <li><Link href="/profile" className="hover:text-primary">Profile</Link></li>
          </ul>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold mb-4">Community</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">Join Us</Link></li>
            <li><Link href="#" className="hover:text-primary">Guidelines</Link></li>
            <li><Link href="#" className="hover:text-primary">Support</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
            <li><Link href="#" className="hover:text-primary">Terms</Link></li>
            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-border/40 text-center py-6 text-sm text-muted-foreground">
        © 2026 SkillVibe. All rights reserved. Built with ✨
      </div>
    </footer>
  );
}

