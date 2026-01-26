export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
  safelist: [
    "border-cyan-400/30","border-violet-400/30","border-amber-400/30",
    "bg-cyan-500/10","bg-violet-500/10","bg-amber-500/10",
    "focus-visible:ring-cyan-300/40","focus-visible:ring-violet-300/40","focus-visible:ring-amber-300/40",
  ],
};
