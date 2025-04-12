import Link from 'next/link';

export default function LevelCard({ title, href, color, icon, delay }) {
  return (
    <div
      className="flex flex-col items-center p-8 rounded-lg shadow-lg transform transition-all hover:shadow-xl cursor-pointer animate-slide-in"
      style={{ backgroundColor: color, animationDelay: `${delay}s` }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      <Link href={href}>
        <div className="px-6 py-2 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Get Started
        </div>
      </Link>
    </div>
  );
}