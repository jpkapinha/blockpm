-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_project_id uuid
)
returns table (
  id uuid,
  content text,
  similarity float,
  chunk_index int,
  source_id uuid
)
language plpgsql
as $$
begin
  return query
  select
    embeddings.id,
    embeddings.chunk_text as content,
    1 - (embeddings.embedding <=> query_embedding) as similarity,
    embeddings.chunk_index,
    embeddings.input_id as source_id
  from embeddings
  where 1 - (embeddings.embedding <=> query_embedding) > match_threshold
  and embeddings.project_id = filter_project_id
  order by similarity desc
  limit match_count;
end;
$$;
