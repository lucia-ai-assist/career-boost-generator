import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const BulletPointForm = () => {
  const [loading, setLoading] = useState(false);
  const [generatedPoints, setGeneratedPoints] = useState<string[]>([]);
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
    
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;

      const response = await supabase.functions.invoke('generate-bullet-points', {
        body: {
          ...formData,
          userId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { bulletPoints } = response.data;
      setGeneratedPoints(bulletPoints);

      toast({
        title: "Success!",
        description: "Your bullet points have been generated.",
      });
    } catch (error) {
      console.error('Error generating bullet points:', error);
      toast({
        title: "Error",
        description: "Failed to generate bullet points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-lg p-6 mb-8">
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Generating..." : "Generate Bullet Points"}
        </Button>
      </form>

      {generatedPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Bullet Points</CardTitle>
            <CardDescription>
              Here are your professionally crafted resume bullet points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 list-disc pl-6">
              {generatedPoints.map((point, index) => (
                <li key={index} className="text-gray-700">
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};