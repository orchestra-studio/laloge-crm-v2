import { PipelinePage } from "./components/pipeline-page";
import { getPipelineData } from "@/lib/supabase/queries/pipeline";
import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "Pipeline La Loge",
    description: "Vue Kanban connectée à Supabase pour piloter le pipeline commercial La Loge.",
    canonical: "/pipeline"
  });
}

export default async function Page() {
  const initialColumns = await getPipelineData();

  return <PipelinePage initialColumns={initialColumns} />;
}
