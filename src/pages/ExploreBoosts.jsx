import { Instagram, Youtube, Facebook, Twitter, Linkedin, Music2 } from "lucide-react";
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
      icon: <Twitter className="text-sky-500 w-10 h-10" />,
      boosts: ["Followers", "Likes", "Retweets", "Views"],
    },
    {
      name: "Facebook",
      icon: <Facebook className="text-blue-600 w-10 h-10" />,
      boosts: ["Page Likes", "Followers", "Post Likes", "Comments", "Views"],
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="text-blue-700 w-10 h-10" />,
      boosts: ["Connections", "Followers", "Post Likes", "Engagements"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-16 px-6 md:px-20">
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Explore Our Social Media Boosting Services 🚀
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Want to grow your social media presence faster? Our tailored boost services help influencers, brands, and creators gain real engagement across multiple platforms. Get more likes, followers, and reach — effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1 border border-blue-100"
          >
            <div className="flex items-center gap-3 mb-4">
              {platform.icon}
              <h2 className="text-xl font-bold text-blue-800">{platform.name}</h2>
            </div>
            <ul className="space-y-1 text-gray-700 mb-4">
              {platform.boosts.map((boost, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {boost}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Explore Our Boosts
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-blue-900 mb-2">
          Ready to Supercharge Your Growth?
        </h3>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied creators using SocialPulse to amplify their influence.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-800 transition"
        >
          Get Started Now
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-10 bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition"
      >
        ← Back to Landing
      </button>
    </div>
  );
}

export default ExploreBoosts;
