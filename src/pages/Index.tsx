import { Hero } from "@/components/Hero";
import { BulletPointForm } from "@/components/BulletPointForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Hero />
      <div id="generator" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Generate Your Resume Bullets</h2>
        <BulletPointForm />
      </div>
    </div>
  );
};

export default Index;