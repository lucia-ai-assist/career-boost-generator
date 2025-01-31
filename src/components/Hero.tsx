import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fadeIn">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
        Transform Your Resume
      </h1>
      <p className="text-xl md:text-2xl text-secondary mb-8 max-w-2xl">
        Generate powerful, ATS-friendly bullet points that make your experience stand out. Powered by AI.
      </p>
      <Button 
        className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white"
        onClick={() => window.scrollTo({ top: document.getElementById('generator')?.offsetTop, behavior: 'smooth' })}
      >
        Get Started
      </Button>
    </div>
  );
};