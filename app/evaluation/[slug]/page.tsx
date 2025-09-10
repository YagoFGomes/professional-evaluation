/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useFormByType } from '@/components/hooks/useFormByType';
import Image from "next/image";

export default function FormClient() {
  const { data, isLoading, error } = useFormByType("Fit Cultural");

  const form = useForm<any>({
    defaultValues: {},
  });

  const options = [
    { value: "1", label: "1 - Abaixo do Esperado" },
    { value: "2", label: "2 - Parcialmente Atende" },
    { value: "3", label: "3 - Atende Plenamente" },
    { value: "4", label: "4 - Supera as Expectativas" },
  ];

  if (isLoading) return <p className="text-charcoal text-center">Carregando formulário…</p>;
  if (error) return <p className="text-red-600 text-center">Erro: {error}</p>;
  if (!data) return <p className="text-center text-smoke">Formulário não encontrado</p>;

  const onSubmit = (values: any) => {
    console.log("Formulário enviado:", values);
  };

  return (
    <div className="min-h-screen bg-[#2E334E] py-8 px-3 sm:px-6 lg:px-12">
      <div className="w-full max-w-screen-2xl mx-auto space-y-10">

        {/* ================== CABEÇALHO ================== */}
        <section className="bg-white border border-[#2E334E] p-6 rounded-md shadow-sm space-y-6">
          {/* Linha 1: Logo + Título + Info Técnica */}
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 items-center border-b border-[#ABAEAB] pb-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <div className="aspect-[148/55] w-32 relative">
                <Image
                  src="https://claglobal.com.br/wp-content/uploads/2024/07/logo.png"
                  fill
                  className="object-contain"
                  alt="Logo CLA"
                />
              </div>
            </div>

            <div className="text-center md:col-span-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2E334E] leading-snug">
                AVALIAÇÃO DE<br className="md:hidden" /> FIT CULTURAL
              </h1>
            </div>

            <div className="text-sm space-y-1 mt-4 md:mt-0 text-[#2E334E] mx-auto">
              <div >
                <p><strong>REV.:</strong> 13/07/2025</p>
                <p><strong>SETOR:</strong> RH - DHO</p>
                <p><strong>FORM.:</strong> FIT CULTURAL</p>
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <p className="text-sm text-[#25282A] italic leading-relaxed">
            <strong>OBJETIVO:</strong> Grau de compatibilidade entre os valores, comportamentos, crenças e atitudes de um colaborador (ou candidato) e a cultura organizacional da empresa.
          </p>

          {/* Dados do colaborador */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-[#2E334E] mt-2">
            <p><strong>NOME:</strong> CAMILA BATISTA</p>
            <p><strong>EMPRESA:</strong> CLA CONSULTORIA</p>
            <p><strong>DEPARTAMENTO:</strong> RH</p>
            <p><strong>ADMISSÃO:</strong> 06/01/2025</p>
            <p><strong>DATA DA AVALIAÇÃO:</strong> 01/09/2025</p>
            <p><strong>CHEFIA IMEDIATA:</strong> THIAGO BREHMER</p>
          </div>

          {/* Instruções */}
          <div className="mt-4 text-sm text-[#25282A] space-y-2 leading-relaxed">
            <div>
              Cada fator de avaliação terá uma nota, conforme segue:
            </div>
            <p className="flex flex-wrap gap-2">
              <strong>1</strong> para Abaixo do Esperado,
              <strong>2</strong> para Parcialmente Atende,
              <strong>3</strong> para Atende Plenamente,
              <strong>4</strong> para Supera as Expectativas.
            </p>
          </div>
        </section>

        {/* ================== FORMULÁRIO ================== */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

            {data.topics.map((topic, topicIndex) => (
              <section
                key={topic.id}
                className="bg-white border border-[#2E334E] rounded-md p-6 space-y-4 shadow-sm"
              >
                <div>
                  <h2 className="text-xl font-semibold text-[#2E334E] mb-2">{topic.title}</h2>
                </div>

                {/* Wrapper com scroll horizontal */}
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    {/* Cabeçalho da tabela */}
                    <div className="grid grid-cols-[1fr_4fr] text-sm font-semibold text-[#2E334E] border border-[#ABAEAB] bg-[#F7F7F6]">
                      <div className="px-4 py-2 border-r border-[#ABAEAB]">Critério</div>
                      <div className="grid grid-cols-4 text-center">
                        {options.map((opt) => (
                          <div key={opt.value} className="px-2 py-2 border-l border-[#ABAEAB]">
                            {opt.label.split("–")[0]}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perguntas */}
                    {topic.questions.map((q) => {
                      const fieldName = `topic_${topicIndex}_question_${q.id}`;
                      return (
                        <div
                          key={q.id}
                          className="grid grid-cols-[1fr_4fr] border border-t border-[#ABAEAB] bg-white"
                        >
                          <div className="border-r border-[#ABAEAB] px-4 py-3 text-sm font-semibold text-[#2E334E]">
                            {q.title && <strong>{q.title} — </strong>}
                            {q.text}
                          </div>

                          <FormField
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                              <div className="grid grid-cols-4 text-center">
                                {options.map((opt) => (
                                  <div
                                    key={opt.value}
                                    className="flex items-center justify-center border-l border-[#ABAEAB] py-3"
                                  >
                                    <FormItem>
                                      <FormControl>
                                        <RadioGroup>
                                          <RadioGroupItem
                                            value={opt.value}
                                            checked={field.value === opt.value}
                                            onChange={field.onChange}
                                            onClick={() => field.onChange(opt.value)}
                                            className="accent-[#7DD2D3] focus:ring-2 border-[#2E334E] focus:border-2 focus:ring-transparent w-6 h-6"
                                          />
                                        </RadioGroup>
                                      </FormControl>
                                    </FormItem>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-legenda (se houver) */}
                {topic.scaleLines.length > 0 && (
                  <ul className="text-sm text-[#828595] list-disc pl-5 mb-4">
                    {topic.scaleLines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* BOTÃO */}
            <div className="text-center pt-6">
              <Button
                type="submit"
                className="bg-[#7DD2D3] text-[#2E334E] hover:bg-[#39a5a7] px-8 py-2 text-base font-semibold rounded-md"
              >
                Enviar Respostas
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
