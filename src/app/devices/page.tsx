
import { useTopic } from '@/lib/hooks/topic.hook';
import { Devices } from './Devices';

export default function Page() {
  
  const {topic} = useTopic()

  if(!topic)
    return null

  return (
    <Devices topic={topic}/>
  );
}
