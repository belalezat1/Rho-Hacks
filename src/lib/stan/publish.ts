import { getStanUrl } from "@/lib/briefs/generate";

export interface StanPublishResult {
  ok: true;
  mode: "guided_stan_publish";
  stanUrl: string;
  briefId: string | null;
  title: string;
  note: string;
}

export function publishBriefToStan(input: {
  briefId?: string | null;
  title?: string;
}): StanPublishResult {
  return {
    ok: true,
    mode: "guided_stan_publish",
    stanUrl: getStanUrl(),
    briefId: input.briefId ?? null,
    title: input.title ?? "Money Brief",
    note: "Open the Stan URL to attach the generated PDF + audio pack. Programmatic product APIs may be limited during the hackathon.",
  };
}
