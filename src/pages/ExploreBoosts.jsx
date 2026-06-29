import { Instagram, Youtube, Facebook, Twitter, Linkedin, Music2, Rocket, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router";

function ExploreBoosts() {
  const navigate = useNavigate();

  const platforms = [
    {
      name: "Instagram",
      icon: <Instagram className="text-pink-500 w-10 h-10" />,
      boosts: ["Likes", "Followers", "Comments", "Views", "Story Views"],
    },
    {
      name: "TikTok",
      icon: <Music2 className="text-rose-500 w-10 h-10" />,
      boosts: ["Likes", "Followers", "Views", "Shares", "Comments"],
    },
    {
      name: "YouTube",
      icon: <Youtube className="text-red-600 w-10 h-10" />,
      boosts: ["Subscribers", "Likes", "Comments", "Views", "Watch Time"],
    },
    {
      name: "Twitter (X)",
      icon: <Twitter className="text-cyan-500 w-10 h-10" />,
      boosts: ["Followers", "Likes", "Retweets", "Views"],
    },
    {
      name: "Facebook",
      icon: <Facebook className="text-brand-600 w-10 h-10" />,
      boosts: ["Page Likes", "Followers", "Post Likes", "Comments", "Views"],
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="text-brand-700 w-10 h-10" />,
      boosts: ["Connections", "Followers", "Post Likes", "Engagements"],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-12 md:py-16 flex flex-col items-center">
      <div className="max-w-3xl text-center mb-12">
        <p className="eyebrow inline-flex items-center justify-center gap-1.5 mb-2">
          <Rocket className="w-4 h-4" />
          Explore Boosts
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold heading-gradient mb-4">
          Explore Our Social Media Boosting Services
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
          Want to grow your social media presence faster? Our tailored boost services help influencers, brands, and creators gain real engagement across multiple platforms. Get more likes, followers, and reach — effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="card card-hover p-6 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-4">
              {platform.icon}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{platform.name}</h2>
            </div>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-5">
              {platform.boosts.map((boost, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-600" />
                  {boost}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/login")}
              className="btn btn-md btn-primary w-full"
            >
              Explore Our Boosts
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Ready to Supercharge Your Growth?
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Join thousands of satisfied creators using SocialPulse to amplify their influence.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn btn-lg btn-primary"
        >
          Get Started Now
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="btn btn-md btn-ghost mt-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Landing
      </button>
      </div>
    </div>
  );
}

export default ExploreBoosts;
