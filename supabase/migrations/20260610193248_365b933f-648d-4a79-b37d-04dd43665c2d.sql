
CREATE POLICY "site-videos public read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-videos');

CREATE POLICY "site-videos admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-videos admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "site-videos admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-videos' AND public.has_role(auth.uid(), 'admin'));
