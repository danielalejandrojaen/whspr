import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import React, { useEffect, useState } from 'react';


interface WaveSurferProps {
    audioUrl: string;
    postId: number;
}

const WaveSurferComponent: React.FC<WaveSurferProps> = ({ audioUrl, postId}) => {
    const [wave, setWave] = useState<WaveSurfer | null>(null);
    const [display, setDisplay] = useState<boolean>(false); 
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    // const { audioUrl, postId } = props;
    const containerId = `waveform-${postId}`
    const createSoundWaves = () => {
        let regions: RegionsPlugin
        //if there is a wavesurfer already, destroy it
        if (wave) {
            wave.destroy();
        }
        //create the new wave
        console.log('creating new wave')
        const wavesurfer = WaveSurfer.create({
            barWidth: 15,
            barRadius: 5,
            barGap: 2,
            interact: true,
            container: `#${containerId}`,
            waveColor: 'rgb(0, 255, 0)',
            progressColor: 'rgb(0, 0, 255)',
            url: audioUrl,
            width: "auto",
            height: "auto",
            normalize: true,
        });

        regions = wavesurfer.registerPlugin(RegionsPlugin.create());


        wavesurfer.on('click', () => {
            regions.addRegion({
                start: wavesurfer.getCurrentTime(),
                end: wavesurfer.getCurrentTime() + 0.25,
                drag: true,
                color: 'hsla(250, 100%, 30%, 0.5)',
                id: 'test',
            })
        })
        // wavesurfer.on('decode', () => { THIS CODE WORKS AND IS LEFT COMMENTED OUT UNTIL SOMEONE NEEDS TO USE IT,
        //     regions.addRegion({          IT ADDS A REGIONE TO THE WAVE FORM THAT THE USER CAN DRAG TO HIGHLIGHT SPECIFIC PARTS OF THE WAVE
        //         start: 0.25,         THIS WILL BE TINKERED WITH A LOT FOR USER CREATED SOUNDS
        //         end: 0.5,
        //         drag: true,
        //         color: 'hsla(250, 100%, 30%, 0.5)',
        //     })
        // })
        
        console.log('wave created!', wavesurfer)
        setWave(wavesurfer);
        setDisplay(true);
    }

    useEffect(() => {
        createSoundWaves();
        console.log('wave', wave);
    }, [audioUrl]);
    return (
        <div>
            <br/>
            <div id={containerId}></div>
            <button type='button' id="play-btn" onClick={() => {
                if (wave) {
                    wave.playPause();
                    setIsPlaying(!isPlaying);
                }
            }}>{isPlaying ? 'Stop' : 'Play'}</button>
        </div>
    )
}

export default WaveSurferComponent;