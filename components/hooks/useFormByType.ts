/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type FormQuestion = {
  id: string;
  title: string | null;
  text: string;
  order: number;
};

export type FormTopic = {
  id: string;
  title: string;
  order: number;
  scaleText: string | null;
  scaleLines: string[];
  questions: FormQuestion[];
};

export type FormWithTopics = {
  versionId: string;
  version: string;
  typeName: string;
  topics: FormTopic[];
};

function splitScale(scale?: string | null): string[] {
  return scale ? scale.split('|br|').map(s => s.trim()).filter(Boolean) : [];
}

export function useFormByType(formTypeName: string) {
  const [data, setData] = useState<FormWithTopics | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    let alive = true;
    const supabase = createClient();

    async function run() {
      setLoading(true);
      setError(null);

      const { data: rows, error } = await supabase
        .from('form_versions')
        .select(`
          id,
          version,
          is_active,
          form_types!inner(name),
          topics:topics(
            id,
            title,
            order_index,
            evaluation_scale,
            questions:questions(
              id,
              title,
              question_text,
              order_index
            )
          )
        `)
        .eq('form_types.name', formTypeName)
        .eq('is_active', true)
        .order('order_index', { ascending: true, foreignTable: 'topics' })
        .order('order_index', { ascending: true, foreignTable: 'topics.questions' })
        .limit(1);

      if (!alive) return;

      if (error) {
        setError(error.message);
        setData(null);
        setLoading(false);
        return;
      }

      if (!rows || rows.length === 0) {
        setError(`Não encontrei versão ativa para o tipo "${formTypeName}".`);
        setData(null);
        setLoading(false);
        return;
      }

      const row: any = rows[0];

      const topics: FormTopic[] = (row.topics ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        order: t.order_index,
        scaleText: t.evaluation_scale ?? null,
        scaleLines: splitScale(t.evaluation_scale),
        questions: (t.questions ?? []).map((q: any) => ({
          id: q.id,
          title: q.title ?? null,
          text: q.question_text,
          order: q.order_index,
        })),
      }));

      const normalized: FormWithTopics = {
        versionId: row.id,
        version: row.version,
        typeName: row.form_types.name,
        topics,
      };

      setData(normalized);
      setLoading(false);
    }

    run();
    return () => { alive = false; };
  }, [formTypeName]);

  return { data, isLoading, error };
}
