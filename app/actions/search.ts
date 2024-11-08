"use server";

import { Index } from "@upstash/vector";
import type { Applicant } from "@/types";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function search(query: string = ""): Promise<Applicant[]> {
  const response = await index.query({
    topK: 50,
    data: query,
    includeMetadata: true,
    includeVectors: false,
  });
  return response.map((result) => result.metadata) as Applicant[];
}
