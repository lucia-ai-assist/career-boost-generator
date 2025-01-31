import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const BulletPointForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    jobTitle: "",
    industry: "",
    experienceLevel: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Coming Soon!",
      description: "This feature will be available soon.",
    });
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="e.g. Software Engineer"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          placeholder="e.g. Technology"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level (years)</Label>
        <Input
          id="experienceLevel"
          type="number"
          min="0"
          max="50"
          placeholder="e.g. 5"
          value={formData.experienceLevel}
          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Key Skills (comma separated)</Label>
        <Textarea
          id="skills"
          placeholder="e.g. JavaScript, React, Node.js"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
        {loading ? "Generating..." : "Generate Bullet Points"}
      </Button>
    </form>
  );
};