import ChatInterface from "../../components/ChatInterface";

export default function Home() {
  return (
    <div className="bg-blue-950-50 min-h-screen">
      <header className="bg-black shadow-sm">
        <div className="mx-auto px-4 py-4 max-w-4xl">
          <h1 className="flex items-center gap-3 font-bold text-gray-900 text-2xl">
            <span className="bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-transparent">
              FoodieBot
            </span>
            <span className="bg-green-100 px-2 py-1 rounded-full text-green-800 text-sm">
              Live Chat
            </span>
          </h1>
        </div>
      </header>

      <main className="mx-auto -mt-[42px] p-4 max-w-4xl">
        <ChatInterface />
      </main>
    </div>
  );
}
