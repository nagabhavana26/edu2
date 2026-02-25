import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { JobCard } from "@/components/dashboard/JobCard";
import { Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const { data: jobData } = await supabase.from("jobs").select("*");
    if (jobData) {
      const jobIds = jobData.map((j: any) => j.id);
      const { data: apps } = await supabase
        .from("job_applications")
        .select("job_id")
        .in("job_id", jobIds.length > 0 ? jobIds : ["__none__"]);
      const appliedIds = new Set((apps || []).map((a: any) => a.job_id));
      setJobs(jobData.map((j: any) => ({ ...j, has_applied: appliedIds.has(j.id) })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const applyToJob = async (jobId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("job_applications").insert({ job_id: jobId, student_id: user.id });
    toast({ title: "Applied!", description: "Your application has been submitted." });
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-primary" />
        Job Opportunities
      </h1>
      {jobs.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Jobs Available</h2>
          <p className="text-muted-foreground">Jobs matching your profile will appear here.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, index) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location || "Remote"}
              type={(job.job_type as "internship" | "full-time" | "part-time") || "full-time"}
              skills={job.required_skills || []}
              deadline={job.deadline ? new Date(job.deadline) : new Date(Date.now() + 30 * 86400000)}
              isEligible={!job.has_applied}
              delay={index * 0.1}
              onApply={!job.has_applied ? () => applyToJob(job.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
