import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/admin";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/ai/chunking";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { projectId, inputId, sourceType, storagePath, fileName, mimeType, content } = await req.json();
        const supabase = createClient();

        let textContent = "";
        let finalInputId = inputId;

        // 1. Process Content (Text extraction)
        if (sourceType === "upload" && storagePath) {
            // Download file from Supabase Storage
            const { data: fileBlob, error: downloadError } = await supabase.storage
                .from("project-files")
                .download(storagePath);

            if (downloadError || !fileBlob) {
                throw new Error(`Failed to download file: ${downloadError?.message}`);
            }

            const buffer = Buffer.from(await fileBlob.arrayBuffer());

            // Parse file
            if (mimeType === "application/pdf" || fileName?.endsWith(".pdf")) {
                // @ts-expect-error Types might be missing for pdf2json constructor
                const pdfParser = new PDFParser(null, 1); // 1 = text content only
                textContent = await new Promise((resolve, reject) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                    pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
                    pdfParser.parseBuffer(buffer);
                }) as string;
            } else if (
                mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                fileName?.endsWith(".docx")
            ) {
                const result = await mammoth.extractRawText({ buffer });
                textContent = result.value;
            } else {
                // Assume text/plain or markdown
                textContent = buffer.toString("utf-8");
            }

            // Create input record if not exists
            if (!inputId) {
                const { data: newInput, error: insertError } = await supabase
                    .from("inputs")
                    .insert({
                        project_id: projectId,
                        source_type: "upload",
                        source_meta: { file_name: fileName, mime_type: mimeType },
                        storage_path: storagePath,
                        raw_content: textContent,
                        processed: false,
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                finalInputId = newInput.id;
            }
        } else if (sourceType === "note" && content) {
            textContent = content; // Provided directly
            // Create note input if missing
            if (!inputId) {
                const { data: newInput, error: insertError } = await supabase
                    .from("inputs")
                    .insert({
                        project_id: projectId,
                        source_type: "note",
                        raw_content: textContent,
                        processed: false,
                    })
                    .select()
                    .single();
                if (insertError) throw insertError;
                finalInputId = newInput.id;
            }
        } else {
            return NextResponse.json({ error: "Invalid source type or missing content" }, { status: 400 });
        }

        if (!textContent?.trim()) {
            return NextResponse.json({ error: "No text content extracted" }, { status: 400 });
        }

        // 2. Chunk & Embed
        const chunks = await chunkText(textContent, { source: fileName || "note" });

        // Generate embeddings for chunks (in batches of 10)
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
            const embeddings = await Promise.all(
                batch.map(chunk => generateEmbedding(chunk.pageContent))
            );

            // 3. Store Embeddings
            const upsertData = batch.map((chunk, idx) => ({
                project_id: projectId,
                input_id: finalInputId,
                chunk_text: chunk.pageContent,
                chunk_index: i + idx,
                embedding: embeddings[idx],
            }));

            const { error: embeddingError } = await supabase
                .from("embeddings")
                .insert(upsertData);

            if (embeddingError) throw embeddingError;
        }

        // 4. Mark Input as Processed
        await supabase.from("inputs").update({ processed: true }).eq("id", finalInputId);

        return NextResponse.json({ success: true, inputId: finalInputId });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Ingestion error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
