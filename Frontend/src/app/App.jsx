import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    const currentProblem = problem;
    setProblem("");
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3000/use-graph", {
        problem: currentProblem,
      });

      const data = res.data;
      
      setHistory((prev) => [
        ...prev,
        {
          id: Date.now(),
          problem: currentProblem,
          solution_1: data.solution_1,
          solution_2: data.solution_2,
          judge: data.judge,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to reach the server. Ensure the backend is running.");
      setProblem(currentProblem); // restore input
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-gray-100 font-sans antialiased flex flex-col">
      <header className="py-12 text-center shrink-0">
        <h1 className="text-4xl font-light tracking-tight text-white">
          AI Battle Arena
        </h1>
        <p className="text-gray-400 font-light tracking-wide text-lg mt-3">
          Compare models side-by-side. Clean, seamless, infinite.
        </p>
      </header>

      {/* Chat History Feed */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 space-y-32 pb-48">
        
        {history.map((item) => (
          <section key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out space-y-16">
            
            {/* User Prompts */}
            <div className="flex justify-end">
              <div className="bg-[#22262F] text-gray-100 border border-gray-700/50 px-8 py-5 rounded-3xl rounded-tr-sm max-w-3xl text-xl font-light shadow-sm">
                {item.problem}
              </div>
            </div>

            {/* Solutions Juxtaposition */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
              
              {/* Model 1 */}
              <article className="space-y-6 shrink-0 border-t border-gray-800 pt-8">
                <header className="flex justify-between items-end">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                    Model One
                  </h3>
                </header>
                <div className="text-lg leading-relaxed text-gray-300 font-light whitespace-pre-wrap">
                  {item.solution_1.split("**").map((text, i) => (
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-white drop-shadow-md">{text}</strong> : text
                  ))}
                </div>
              </article>

              {/* Model 2 */}
              <article className="space-y-6 shrink-0 border-t border-gray-800 pt-8">
                <header className="flex justify-between items-end">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                    Model Two
                  </h3>
                </header>
                <div className="text-lg leading-relaxed text-gray-300 font-light whitespace-pre-wrap">
                  {item.solution_2}
                </div>
              </article>
            </div>

            {/* Judging Area */}
            <section className="bg-[#161A21] rounded-3xl p-12 shadow-sm border border-gray-800/80 space-y-10">
              <div className="text-center">
                <h2 className="text-xl font-light tracking-tight text-white">
                  Judge Verdict
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                {/* Score 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
                    <span className="text-3xl font-light text-white">
                      {item.judge.solution_1_score}
                      <span className="text-lg text-gray-500">/10</span>
                    </span>
                    <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Model One</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-light">
                    {item.judge.solution_1_reasoning}
                  </p>
                </div>

                {/* Score 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
                    <span className="text-3xl font-light text-white">
                      {item.judge.solution_2_score}
                      <span className="text-lg text-gray-500">/10</span>
                    </span>
                    <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Model Two</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-light">
                    {item.judge.solution_2_reasoning}
                  </p>
                </div>
              </div>
            </section>
          </section>
        ))}

        {/* Loading Indicator inside the feed */}
        {loading && (
          <div className="flex justify-center py-12 animate-pulse">
             <span className="text-indigo-400 font-light tracking-widest uppercase text-sm">Evaluating...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-400 font-light py-4">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Input Field */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14] to-transparent pt-24 pb-8 px-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="flex bg-[#161a21] rounded-full shadow-lg overflow-hidden ring-1 ring-gray-700/50 p-2 items-center">
            <input
              type="text"
              className="flex-1 bg-transparent px-8 py-4 outline-none text-lg font-light text-gray-100 placeholder:text-gray-500"
              placeholder="Ask a question..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={loading}
            />
            <button
              disabled={loading || !problem.trim()}
              className="px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            >
              Send
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default App;
