import React, { useState, useEffect, MouseEventHandler, SyntheticEvent } from 'react';
import { Container, Stack } from 'react-bootstrap';
import Oscillator from './Oscillator';
import RecordSynth from './RecordSynth';
import Filters from './Filters';
import SynthVoice from './SynthVoice';
import * as Tone from 'tone';


interface Props {
  audioContext: AudioContext,
  oscillator: OscillatorNode,
  filter: BiquadFilterNode
  mediaDest: MediaStreamAudioDestinationNode
  finalDest: AudioDestinationNode
  userId: number
}

const SynthDaw = ({audioContext, finalDest, oscillator, mediaDest, filter, userId}: Props): React.JSX.Element => {
  // setting base context's state
  const [contextState, setContextState] = useState('');
  const synth = new Tone.Synth();
  const [title, setTitle] = useState('');

  // oscillator's settings
  const [oscSettings, setOscSettings] = useState({
    frequency: oscillator.frequency.value,
    detune: oscillator.detune.value,
    type: oscillator.type
  });

  // start the audio
  const start: () => void = () => {
    if (contextState === '') {
      oscillator.start();
      setContextState('started');
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  };

  // stop the audio
  const stop: () => void = () => {
    if (audioContext.state === 'running') {
      audioContext.suspend();
    }
  };

  // change the type value => not working
  const changeType: (e: any) => void = (e) => {
    let { id } = e.target;
    setOscSettings({...oscSettings, type: id});
    oscillator.type = id;
  };

  // change the frequency values => not working
  const changeValue = (e: any) => {
    let value: number = e.target.value;
    let id: string = e.target.id;
    setOscSettings({...oscSettings, [id]: Number(value)})
    if (id === 'frequency') {
      oscillator.frequency.value = Number(value);
    } else if (id === 'detune') {
      oscillator.detune.value = Number(value);
    }
  };

  return (
    <Container className="synthCont w-50 rounded text-white">
      <Stack>
        <h2 className="text-center">Set the Tone!</h2>
        <Filters title={title} audioContext={audioContext} userId={userId} />
        <Oscillator oscSettings={oscSettings} changeType={changeType} changeValue={changeValue} />
        <RecordSynth title={title} audioContext={audioContext} stop={stop} start={start} mediaDest={mediaDest} finalDest={finalDest} userId={userId} />
      </Stack>
    </Container>
  );
}

export default SynthDaw;