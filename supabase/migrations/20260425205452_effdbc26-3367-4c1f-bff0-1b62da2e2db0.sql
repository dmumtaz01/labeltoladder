drop policy if exists "anyone authenticated can insert ai review" on public.quality_reviews;

create policy "scoped insert quality reviews" on public.quality_reviews
  for insert to authenticated
  with check (
    exists (
      select 1 from public.annotation_jobs j
      left join public.employer_tasks t on t.id = j.task_id
      where j.id = quality_reviews.annotation_job_id
        and (
          j.candidate_id = auth.uid()
          or t.employer_id = auth.uid()
          or has_role(auth.uid(), 'admin')
        )
    )
  );