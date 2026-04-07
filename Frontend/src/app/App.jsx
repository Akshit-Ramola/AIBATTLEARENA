import { useState } from "react";
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
      const res = await fetch("http://localhost:3000/use-graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: currentProblem }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex flex-col">
      <header className="py-12 text-center shrink-0">
        <h1 className="text-4xl font-light tracking-tight text-gray-800">
          AI Battle Arena
        </h1>
        <p className="text-gray-500 font-light tracking-wide text-lg mt-3">
          Compare models side-by-side. Clean, seamless, infinite.
        </p>
      </header>

      {/* Chat History Feed */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 space-y-32 pb-48">
        
        {history.map((item) => (
          <section key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out space-y-16">
            
            {/* User Prompts */}
            <div className="flex justify-end">
              <div className="bg-gray-100 text-gray-800 px-8 py-5 rounded-3xl rounded-tr-sm max-w-3xl text-xl font-light shadow-sm">
                {item.problem}
              </div>
            </div>

            {/* Solutions Juxtaposition */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
              
              {/* Model 1 */}
              <article className="space-y-6 shrink-0 border-t border-gray-200 pt-8">
                <header className="flex justify-between items-end">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Model One
                  </h3>
                </header>
                <div className="text-lg leading-relaxed text-gray-700 font-light whitespace-pre-wrap">
                  {item.solution_1.split("**").map((text, i) => (
                    i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{text}</strong> : text
                  ))}
                </div>
              </article>

              {/* Model 2 */}
              <article className="space-y-6 shrink-0 border-t border-gray-200 pt-8">
                <header className="flex justify-between items-end">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Model Two
                  </h3>
                </header>
                <div className="text-lg leading-relaxed text-gray-700 font-light whitespace-pre-wrap">
                  {item.solution_2}
                </div>
              </article>
            </div>

            {/* Judging Area */}
            <section className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 space-y-10">
              <div className="text-center">
                <h2 className="text-xl font-light tracking-tight text-gray-800">
                  Judge Verdict
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                {/* Score 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <span className="text-3xl font-light text-gray-900">
                      {item.judge.solution_1_score}
                      <span className="text-lg text-gray-400">/10</span>
                    </span>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Model One</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {item.judge.solution_1_reasoning}
                  </p>
                </div>

                {/* Score 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <span className="text-3xl font-light text-gray-900">
                      {item.judge.solution_2_score}
                      <span className="text-lg text-gray-400">/10</span>
                    </span>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Model Two</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-light">
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
             <span className="text-gray-400 font-light tracking-widest uppercase text-sm">Evaluating...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 font-light py-4">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Input Field */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-24 pb-8 px-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <div className="flex bg-white rounded-full shadow-lg overflow-hidden ring-1 ring-gray-200 p-2 items-center">
            <input
              type="text"
              className="flex-1 bg-transparent px-8 py-4 outline-none text-lg font-light text-gray-800 placeholder:text-gray-300"
              placeholder="Ask a question..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={loading}
            />
            <button
              disabled={loading || !problem.trim()}
              className="px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-black hover:bg-gray-800 text-white"
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
