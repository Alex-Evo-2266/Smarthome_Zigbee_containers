'use client';

import { Devices } from './Devices';
import { useTopic } from "@/lib/hooks/topic.hook";

export default async function Page() {
  
  const {topic} = await useTopic();

  if (!topic) {
    return <p>⚠️ Ошибка: не удалось загрузить topic из конфигурации</p>;
  }

  return (
    <Devices topic={topic}/>
  );
}
